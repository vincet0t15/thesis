import Pagination from '@/components/paginationData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { EventProps } from '@/types/events';
import { FilterProps } from '@/types/filter';
import { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { IconPlus } from '@tabler/icons-react';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';

interface Props {
    events: PaginatedDataResponse<EventProps>;
    filters: FilterProps;
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '#',
    },
];
export default function AttendanceIndex() {

    breadcrumbs.push({
        title: 'Attendance',
        href: '#',
    });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="outline" size="sm" className="cursor-pointer">
                        <IconPlus />
                        <span className="rounded-sm lg:inline">Event</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Input placeholder="Search..." />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Location</TableHead>

                                <TableHead>Active</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                        </TableBody>
                    </Table>
                </div>
                <div>
                    {/* <Pagination data={events} /> */}
                </div>


            </div>
        </AppLayout>
    );
}
