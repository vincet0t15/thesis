<?php

namespace App\Jobs;

use App\Imports\LogsImport;
use App\Notifications\ImportCompletedNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Notification;
use Illuminate\Notifications\AnonymousNotifiable;

class ProcessLogsImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $filePath;
    protected $fileName;

    /**
     * Create a new job instance.
     *
     * @param string $filePath
     * @return void
     */
    public function __construct($filePath)
    {
        $this->filePath = $filePath;
        $this->fileName = basename($filePath);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            // Get the active event
            $activeEvent = \App\Models\Event::where('is_active', true)->first();
            $eventId = $activeEvent ? $activeEvent->id : null;

            // Process the Excel file with chunked reading
            Excel::import(new LogsImport($eventId), $this->filePath);

            // In a real application, you would send a notification to the user
            // For now, we'll just log it
            \Log::info('Logs import completed for file: ' . $this->fileName);

            // Clean up the temporary file
            Storage::disk('local')->delete($this->filePath);
        } catch (\Exception $e) {
            \Log::error('Logs import failed for file: ' . $this->fileName . '. Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     *
     * @param  \Throwable  $exception
     * @return void
     */
    public function failed(\Throwable $exception)
    {
        // Log the failure
        \Log::error('Logs import failed for file: ' . $this->fileName . '. Error: ' . $exception->getMessage());

        // In a real application, you would send a failure notification to the user
    }
}
