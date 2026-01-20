import Pagination from '@/components/paginationData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FilterProps } from '@/types/filter';
import { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { IconPlus } from '@tabler/icons-react';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';

import { CourseProps } from '@/types/courses';
import { YearLevelProps } from '@/types/yearlevel';
import DeleteYearLevel from './delete';
import YearLevelCreate from './create';
import YearLevelEdit from './edit';

interface Props {
    yearLevels: PaginatedDataResponse<YearLevelProps>;
    filters: FilterProps;
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '#',
    },
];
export default function YearLevelIndex({ yearLevels, filters }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [dataToEdit, setDataEdit] = useState<YearLevelProps | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [dataToDelete, setDataToDelete] = useState<YearLevelProps | null>(null);
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const queryString = data.search ? { search: data.search } : undefined;
            router.get(route('year-level.index'), queryString, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handleClickName = (data: YearLevelProps) => {
        setDataEdit(data);
        setOpenEdit(true);
    };

    const handleClickDelete = (data: YearLevelProps) => {
        setDataToDelete(data);
        setOpenDelete(true);
    };

    const handleClickEdit = (data: YearLevelProps) => {

        setDataEdit(data);
        setOpenEdit(true);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white border-0 transition-colors" onClick={() => setOpenCreate(true)}>
                        <IconPlus />
                        <span className="rounded-sm lg:inline">Year Level</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Input onKeyDown={handleKeyDown} onChange={handleSearchChange} placeholder="Search..." value={data.search} />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="text-primary font-bold">Year Level Name</TableHead>
                                <TableHead className="text-primary font-bold text-end">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {yearLevels.data.length > 0 ? (
                                yearLevels.data.map((yearLevel, index) => (
                                    <TableRow key={index} className="text-sm ">
                                        <TableCell className="cursor-pointer text-sm ">
                                            <span >{yearLevel.name}</span>
                                        </TableCell>

                                        <TableCell className="text-sm gap-2 flex-end px-2 text-end">
                                            <span
                                                className="cursor-pointer text-green-500 hover:text-green-700 hover:underline"
                                                onClick={() => handleClickEdit(yearLevel)}
                                            >
                                                Edit
                                            </span>
                                            <span
                                                className="ml-2 text-red-500 cursor-pointer hover:text-orange-700 hover:underline"
                                                onClick={() => handleClickDelete(yearLevel)}
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
                    <Pagination data={yearLevels} />
                </div>

                {openCreate && <YearLevelCreate open={openCreate} setOpen={setOpenCreate} />}
                {openEdit && dataToEdit && <YearLevelEdit open={openEdit} setOpen={setOpenEdit} yearLevel={dataToEdit} />}
                {openDelete && dataToDelete && <DeleteYearLevel open={openDelete} setOpen={setOpenDelete} dataToDelete={dataToDelete} />}
            </div>
        </AppLayout>
    );
}
