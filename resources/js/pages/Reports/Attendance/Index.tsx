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
import { IconFilter } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';


interface AttendanceRecord {
    student_id: number;
    student_name: string;
    student_code: string;
    course_name: string;
    date: string;
    time_in: string | null;
    time_out: string | null;
}

interface Props {
    logs: PaginatedDataResponse<AttendanceRecord>;
    courses: CourseProps[];
    events: EventProps[];
    filters: FilterProps;
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

export default function AttendanceIndex({ logs, courses, events, filters }: Props) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        course_id: filters.course_id || 'all',
        event_id: filters.event_id || 'all',
    });

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            get(route('report.attendance'), {
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

        router.get(route('report.attendance'), queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance Reports" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                    </div>

                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search student..."
                            value={data.search}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            className="w-full sm:w-[300px]"
                        />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Course</TableHead>
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
                                    <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                                        No attendance records found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={logs} />
                </div>
            </div>
        </AppLayout>
    );
}
