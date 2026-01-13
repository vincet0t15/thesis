import { Head, router, useForm } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import CustomDatePicker from '@/components/custom-date-picker';
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

interface ReportItem {
    event_name: string;
    date_from: string;
    date_to: string;
    program: string;
    attendees: number;
}

interface FilterProps {
    event_id?: string;
    date_from?: string;
    date_to?: string;
}

interface Props {
    reportData: PaginatedDataResponse<ReportItem>;
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

export default function AttendeeCountIndex({ reportData, allEvents, filters }: Props) {
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

                        <div className="flex flex-col gap-1.5 w-full sm:w-[180px]">
                            <label className="text-sm font-medium">Date From</label>
                            <CustomDatePicker
                                initialDate={data.date_from}
                                onSelect={(date) => handleFilterChange('date_from', date)}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 w-full sm:w-[180px]">
                            <label className="text-sm font-medium">Date To</label>
                            <CustomDatePicker
                                initialDate={data.date_to}
                                onSelect={(date) => handleFilterChange('date_to', date)}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead className="w-[30%]">Event</TableHead>
                                <TableHead className="w-[25%]">Date</TableHead>
                                <TableHead className="w-[30%]">Program</TableHead>
                                <TableHead className="text-right">Attendees</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reportData.data.length > 0 ? (
                                reportData.data.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.event_name}</TableCell>
                                        <TableCell>
                                            {dayjs(item.date_from).format('MM/DD/YYYY')}-{dayjs(item.date_to).format('MM/DD/YYYY')}
                                        </TableCell>
                                        <TableCell className="uppercase">{item.program}</TableCell>
                                        <TableCell className="text-right font-bold text-lg">
                                            {item.attendees}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                                        No data found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={reportData} />
                </div>
            </div>
        </AppLayout>
    );
}
