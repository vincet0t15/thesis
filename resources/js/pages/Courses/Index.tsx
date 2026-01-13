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
import CourseCreate from './create';
import DeleteCourse from './delete';
import EditCourse from './edit';

interface Props {
    courses: PaginatedDataResponse<CourseProps>;
    filters: FilterProps;
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '#',
    },
];
export default function CourseIndex({ courses, filters }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [dataToEdit, setDataEdit] = useState<CourseProps | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [dataToDelete, setDataToDelete] = useState<CourseProps | null>(null);
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const queryString = data.search ? { search: data.search } : undefined;
            router.get(route('course.index'), queryString, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handleClickName = (data: CourseProps) => {
        setDataEdit(data);
        setOpenEdit(true);
    };

    const handleClickDelete = (data: CourseProps) => {
        setDataToDelete(data);
        setOpenDelete(true);
    };

    const handleClickEdit = (data: CourseProps) => {

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
                        <span className="rounded-sm lg:inline">Course</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Input onKeyDown={handleKeyDown} onChange={handleSearchChange} placeholder="Search..." value={data.search} />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Course Name</TableHead>
                                <TableHead>Course Code</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.data.length > 0 ? (
                                courses.data.map((course, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell className="cursor-pointer text-sm uppercase hover:font-bold hover:underline">
                                            <span onClick={() => handleClickName(course)}>{course.course_name}</span>
                                        </TableCell>
                                        <TableCell className="text-sm uppercase">{course.course_code}</TableCell>
                                        <TableCell className="text-sm gap-2 flex">
                                            <span
                                                className="cursor-pointer text-green-500 hover:text-orange-700 hover:underline"
                                                onClick={() => handleClickEdit(course)}
                                            >
                                                Edit
                                            </span>
                                            <span
                                                className="text-red-500 cursor-pointer hover:text-orange-700 hover:underline"
                                                onClick={() => handleClickDelete(course)}
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
                    <Pagination data={courses} />
                </div>

                <CourseCreate open={openCreate} setOpen={setOpenCreate} />
                <DeleteCourse open={openDelete} setOpen={setOpenDelete} dataToDelete={dataToDelete} />
                {dataToEdit && openEdit && (
                    <EditCourse open={openEdit} setOpen={setOpenEdit} dataToEdit={dataToEdit} />
                )}


            </div>
        </AppLayout>
    );
}
