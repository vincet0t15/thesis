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
import CreateEvents from './create';
import EditEvents from './edit';
import DeleteEvent from './delete';

interface Props {
    events: PaginatedDataResponse<EventProps>;
    filters: FilterProps;
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '#',
    },
];
export default function EventIndex({ events, filters }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [dataToEdit, setDataEdit] = useState<EventProps | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [dataToDelete, setDataToDelete] = useState<EventProps | null>(null);
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const queryString = data.search ? { search: data.search } : undefined;
            router.get(route('event.index'), queryString, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handleClickName = (data: EventProps) => {
        setDataEdit(data);
        setOpenEdit(true);
    };

    const handleClickDelete = (data: EventProps) => {
        setDataToDelete(data);
        setOpenDelete(true);
    };

    const handleClickUpdate = (data: EventProps) => {
        setDataEdit(data);
        setOpenEdit(true);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setOpenCreate(true)}>
                        <IconPlus />
                        <span className="rounded-sm lg:inline">Event</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Input onKeyDown={handleKeyDown} onChange={handleSearchChange} placeholder="Search..." value={data.search} />
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
                            {events.data.length > 0 ? (
                                events.data.map((event, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell className="cursor-pointer text-sm uppercase hover:font-bold hover:underline">
                                            <span onClick={() => handleClickName(event)}>{event.name}</span>
                                        </TableCell>

                                        <TableCell className="text-sm">{event.description}</TableCell>

                                        <TableCell className="text-sm uppercase">{event.date_from}</TableCell>
                                        <TableCell className="text-sm uppercase">{event.date_to}</TableCell>
                                        <TableCell className="text-sm uppercase">{event.location}</TableCell>

                                        <TableCell>
                                            <span
                                                className={`text-xs font-semibold px-2 py-1 rounded-full uppercase  ${event.is_active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {event.is_active ? 'Yes' : 'No'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm flex gap-2">
                                            <span
                                                className="text-green-700 cursor-pointer hover:text-orange-700 hover:underline"
                                                onClick={() => handleClickUpdate(event)}
                                            >
                                                Edit
                                            </span>
                                            <span
                                                className="text cursor-pointer text-orange-700 hover:underline"
                                                onClick={() => handleClickDelete(event)}
                                            >
                                                Delete
                                            </span>
                                        </TableCell>

                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-3 text-center text-gray-500">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={events} />
                </div>

                <CreateEvents
                    open={openCreate}
                    setOpen={setOpenCreate}
                />

                <DeleteEvent
                    open={openDelete}
                    setOpen={setOpenDelete}
                    dataToDelete={dataToDelete}
                />
                {openEdit && dataToEdit && (
                    <EditEvents
                        open={openEdit}
                        setOpen={setOpenEdit}
                        event={dataToEdit}
                    />
                )}
            </div>
        </AppLayout>
    );
}
