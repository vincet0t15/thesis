import { Head, router, useForm } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/paginationData';
import dayjs from 'dayjs';
import { PaginatedDataResponse } from '@/types/pagination';

interface EventProps {
    id: number;
    name: string;
    date_from: string;
    date_to: string;
    attendee_count: number;
}

interface FilterProps {
    event_id?: string;
    date_from?: string;
    date_to?: string;
}

interface Props {
    events: PaginatedDataResponse<EventProps>;
    allEvents: { id: number; name: string }[];
    filters: FilterProps;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '#',
    },
    {
        title: 'Attendee Count',
        href: route('report.attendee-count'),
    },
];

export default function AttendeeCountIndex({ events, allEvents, filters }: Props) {
    const { data, setData, get } = useForm({
        event_id: filters.event_id || 'all',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const handleFilterChange = (key: string, value: string) => {
        const newData = { ...data, [key]: value };
        setData(key as any, value);

        const queryParams: any = { ...newData };
        if (queryParams.event_id === 'all') delete queryParams.event_id;
        if (!queryParams.date_from) delete queryParams.date_from;
        if (!queryParams.date_to) delete queryParams.date_to;

        router.get(route('report.attendee-count'), queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendee Count Report" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-end">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Event</label>
                            <Select
                                value={String(data.event_id)}
                                onValueChange={(val) => handleFilterChange('event_id', val)}
                            >
                                <SelectTrigger className="w-full sm:w-[250px]">
                                    <SelectValue placeholder="Select Event" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Events</SelectItem>
                                    {allEvents.map((event) => (
                                        <SelectItem key={event.id} value={String(event.id)}>
                                            {event.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Date From</label>
                            <Input
                                type="date"
                                value={data.date_from}
                                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                className="w-full sm:w-[180px]"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Date To</label>
                            <Input
                                type="date"
                                value={data.date_to}
                                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                className="w-full sm:w-[180px]"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Event Name</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead className="text-right">Total Attendees</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.data.length > 0 ? (
                                events.data.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">{event.name}</TableCell>
                                        <TableCell>{dayjs(event.date_from).format('MMM D, YYYY')}</TableCell>
                                        <TableCell>{dayjs(event.date_to).format('MMM D, YYYY')}</TableCell>
                                        <TableCell className="text-right font-bold text-lg">
                                            {event.attendee_count}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                                        No events found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={events} />
                </div>
            </div>
        </AppLayout>
    );
}
