import CustomDatePicker from '@/components/custom-date-picker';
import Pagination from '@/components/paginationData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CourseProps } from '@/types/courses';
import { EventProps } from '@/types/events';
import { FilterProps } from '@/types/filter';
import { LogProps } from '@/types/logs';
import { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { IconFilter, IconPrinter } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';


interface AttendanceRecord {
    student_id: number;
    student_name: string;
    student_code: string;
    course_name: string;
    event_name: string | null;
    date: string;
    time_in: string | null;
    time_out: string | null;
}

interface Props {
    logs: PaginatedDataResponse<AttendanceRecord>;
    courses: CourseProps[];
    events: EventProps[];
    filters: FilterProps;
    totalTimeIn: number;
    totalTimeOut: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '#',
    },
    {
        title: 'Attendance',
        href: route('report.attendance'),
    },
];

export default function AttendanceIndex({ logs, courses, events, filters, totalTimeIn, totalTimeOut }: Props) {
    const { data, setData } = useForm({
        search: filters.search || '',
        course_id: filters.course_id || 'all',
        event_id: filters.event_id || 'all',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        initialized: '1',
    });

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const queryParams: any = { ...data };
            if (queryParams.course_id === 'all') delete queryParams.course_id;
            if (queryParams.event_id === 'all') delete queryParams.event_id;
            if (!queryParams.date_from) delete queryParams.date_from;
            if (!queryParams.date_to) delete queryParams.date_to;
            router.get(route('report.attendance'), queryParams, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };


    const handleFilterChange = (key: string, value: string) => {
        const newData = { ...data, [key]: value };
        setData(key as any, value);

        // Convert 'all' back to null for the backend
        const queryParams: any = { ...newData };
        if (queryParams.course_id === 'all') delete queryParams.course_id;
        if (queryParams.event_id === 'all') delete queryParams.event_id;
        if (!queryParams.date_from) delete queryParams.date_from;
        if (!queryParams.date_to) delete queryParams.date_to;


        router.get(route('report.attendance'), queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };


    const selectedCourse = courses.find((c) => String(c.id) === data.course_id)?.course_name || 'All Courses';
    const selectedEvent = events.find((e) => String(e.id) === data.event_id)?.name || 'All Events';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance Reports" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto print:overflow-visible rounded-xl p-4">
                {/* Print Header */}
                <div className="hidden print:block mb-6">
                    <div className="text-center space-y-1">
                        <h1 className="text-xl font-bold uppercase tracking-widest text-black">Daily Time Record System</h1>
                        <h2 className="text-lg font-semibold text-gray-800">Attendance Report</h2>
                        <p className="text-xs text-gray-500 italic">Generated on {dayjs().format('MMMM D, YYYY h:mm A')}</p>
                    </div>
                    <div className="mt-4 flex justify-between border-b border-black pb-2 text-xs">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-600 uppercase text-xs">Filter Criteria</span>
                            <div className="mt-1">
                                <span className="font-semibold">Course:</span> {selectedCourse}
                            </div>
                            <div>
                                <span className="font-semibold">Event:</span> {selectedEvent}
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-end">
                            <div><span className="font-semibold">Total Records:</span> {logs.total}</div>
                            <div><span className="font-semibold">Total Time In:</span> {totalTimeIn}</div>
                            <div><span className="font-semibold">Total Time Out:</span> {totalTimeOut}</div>
                        </div>
                    </div>
                </div>

                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print-hide">
                    <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                        <Select
                            value={String(data.course_id)}
                            onValueChange={(val) => handleFilterChange('course_id', val)}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Courses</SelectItem>
                                {courses.map((course) => (
                                    <SelectItem key={course.id} value={String(course.id)}>
                                        {course.course_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={String(data.event_id)}
                            onValueChange={(val) => handleFilterChange('event_id', val)}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Select Event" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Events</SelectItem>
                                {events.map((event) => (
                                    <SelectItem key={event.id} value={String(event.id)}>
                                        {event.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>


                        <div className="flex flex-col gap-1.5 w-full sm:w-[180px]">

                            <CustomDatePicker
                                placeholder="Date from"
                                initialDate={data.date_from}
                                onSelect={(date) => handleFilterChange('date_from', date)}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 w-full sm:w-[180px]">

                            <CustomDatePicker
                                placeholder="Date to"
                                initialDate={data.date_to}
                                onSelect={(date) => handleFilterChange('date_to', date)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search student..."
                            value={data.search}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            className="w-full sm:w-[300px]"
                        />
                        <Button variant="outline" size="icon" onClick={() => window.print()}>
                            <IconPrinter className="size-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex justify-end gap-6 text-sm font-medium text-gray-600 print:hidden px-1">
                    <span>Total Time In: <span className="text-black font-bold">{totalTimeIn}</span></span>
                    <span>Total Time Out: <span className="text-black font-bold">{totalTimeOut}</span></span>
                    <span>Total Records: <span className="text-black font-bold">{logs.total}</span></span>
                </div>

                <div className="w-full overflow-hidden print:overflow-visible print:w-full rounded-sm border shadow-sm">
                    <Table className="print:w-full print:table-fixed">
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>Time In</TableHead>
                                <TableHead>Time Out</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.data.length > 0 ? (
                                logs.data.map((record, index) => (
                                    <TableRow key={`${record.student_id}-${record.date}-${index}`}>
                                        <TableCell>{dayjs(record.date).format('MMM D, YYYY')}</TableCell>
                                        <TableCell>{record.student_code}</TableCell>
                                        <TableCell className="uppercase">{record.student_name}</TableCell>
                                        <TableCell>{record.course_name}</TableCell>
                                        <TableCell>
                                            {record.event_name ? (
                                                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                                                    {record.event_name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">Regular Class</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {record.time_in ? (
                                                <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                                                    {dayjs(record.time_in).format('h:mm A')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {record.time_out ? (
                                                <span className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                                                    {dayjs(record.time_out).format('h:mm A')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                                        No attendance records found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="print-hide">
                    <Pagination data={logs} />
                </div>

                {/* Print Footer */}
                <div className="hidden print:block fixed bottom-4 left-0 w-full text-center text-xs text-gray-500 border-t pt-2 bg-white">
                    System Generated Report | {dayjs().format('YYYY-MM-DD')}
                </div>
            </div>
        </AppLayout>
    );
}
