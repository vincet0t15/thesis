import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Notification {
    id: string;
    type: string;
    message: string;
    read_at: string | null;
    created_at: string;
    data: {
        type: string;
        message: string;
        record_count?: number;
    };
}

export default function ImportNotifications() {
    const { props } = usePage();
    const notifications = props.notifications as Notification[] | undefined;

    useEffect(() => {
        if (notifications && notifications.length > 0) {
            notifications.forEach((notification) => {
                // Only show unread notifications
                if (!notification.read_at && notification.data.type === 'import_success') {
                    toast.success('Import Completed', {
                        description: `${notification.data.message} ${notification.data.record_count ? `(${notification.data.record_count} records)` : ''}`,
                        duration: 10000,
                    });
                } else if (!notification.read_at && notification.data.type === 'import_failure') {
                    toast.error('Import Failed', {
                        description: notification.data.message,
                        duration: 10000,
                    });
                }
            });
        }
    }, [notifications]);

    return null;
}
