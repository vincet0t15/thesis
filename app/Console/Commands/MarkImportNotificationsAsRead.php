<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MarkImportNotificationsAsRead extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:mark-imports-as-read {--hours=24 : Number of hours old to mark as read}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark import notifications as read after a specified time';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $hours = $this->option('hours');

        $count = DB::table('notifications')
            ->where('data', 'like', '%"type":"import_%')
            ->where('created_at', '<', now()->subHours($hours))
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $this->info("Marked {$count} import notifications as read.");

        return Command::SUCCESS;
    }
}
