<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ImportCompletedNotification extends Notification
{
    use Queueable;

    protected $fileName;
    protected $recordCount;
    protected $success;

    /**
     * Create a new notification instance.
     *
     * @param string $fileName
     * @param int $recordCount
     * @param bool $success
     * @return void
     */
    public function __construct($fileName, $recordCount = 0, $success = true)
    {
        $this->fileName = $fileName;
        $this->recordCount = $recordCount;
        $this->success = $success;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        // For now, we'll use the database channel. In a full implementation,
        // you might also include email or other channels.
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        if ($this->success) {
            return [
                'message' => "Import of {$this->fileName} completed successfully.",
                'record_count' => $this->recordCount,
                'file_name' => $this->fileName,
                'type' => 'import_success'
            ];
        } else {
            return [
                'message' => "Import of {$this->fileName} failed.",
                'file_name' => $this->fileName,
                'type' => 'import_failure'
            ];
        }
    }
}
