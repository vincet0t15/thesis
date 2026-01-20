import Pagination from '@/components/paginationData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FilterProps } from '@/types/filter';
import { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { IconPlus } from '@tabler/icons-react';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';

import { CourseProps } from '@/types/courses';
import { YearLevelProps } from '@/types/yearlevel';
import { StudentProps } from '@/types/students';
import StudentCreate from './create';
import StudentEdit from './edit';
import DeleteStudent from './delete';

interface Props {
    students: PaginatedDataResponse<StudentProps>;
    filters: FilterProps;
    courses: CourseProps[];
    yearLevels: YearLevelProps[];
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '#',
    },
];
export default function StudentIndex({ students, filters, courses, yearLevels }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [dataToEdit, setDataEdit] = useState<StudentProps | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [dataToDelete, setDataToDelete] = useState<StudentProps | null>(null);
    const { data, setData } = useForm({
        search: filters.search || '',
        course_id: filters.course_id || 'all',
        year_level_id: filters.year_level_id || 'all',
    });

    const handleFilterChange = (key: string, value: string) => {
        const newData = { ...data, [key]: value };
        setData(key as any, value);

        const queryParams: any = { ...newData };
        if (queryParams.course_id === 'all') delete queryParams.course_id;
        if (queryParams.year_level_id === 'all') delete queryParams.year_level_id;
        if (!queryParams.search) delete queryParams.search;

        router.get(route('student.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const queryParams: any = { ...data };
            if (queryParams.course_id === 'all') delete queryParams.course_id;
            if (queryParams.year_level_id === 'all') delete queryParams.year_level_id;
            if (!queryParams.search) delete queryParams.search;

            router.get(route('student.index'), queryParams, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handleClickName = (data: StudentProps) => {
        setDataEdit(data);
        setOpenEdit(true);
    };

    const handleClickDelete = (data: StudentProps) => {
        setDataToDelete(data);
        setOpenDelete(true);
    };

    const handleClickEdit = (data: StudentProps) => {

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
                        <span className="rounded-sm lg:inline">Student</span>
                    </Button>

                    <div className="flex flex-1 items-center gap-2 justify-end">
                         <Select
                            value={String(data.course_id)}
                            onValueChange={(val) => handleFilterChange('course_id', val)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Course" />
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
                            value={String(data.year_level_id)}
                            onValueChange={(val) => handleFilterChange('year_level_id', val)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Years</SelectItem>
                                {yearLevels.map((yl) => (
                                    <SelectItem key={yl.id} value={String(yl.id)}>
                                        {yl.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input className="w-[200px]" onKeyDown={handleKeyDown} onChange={handleSearchChange} placeholder="Search..." value={data.search} />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Year Level</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.data.length > 0 ? (
                                students.data.map((student, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell>{student.student_id}</TableCell>
                                        <TableCell className="cursor-pointer text-sm uppercase hover:font-bold hover:underline">
                                            <span onClick={() => handleClickName(student)}>{student.name} </span>
                                        </TableCell>
                                        <TableCell className="text-sm uppercase">{student.course?.course_name || 'N/A'}</TableCell>
                                        <TableCell className="text-sm uppercase">{student.year_level?.name || 'N/A'}</TableCell>
                                        <TableCell className="text-sm gap-2 flex">
                                            <span
                                                className="cursor-pointer text-green-500 hover:text-orange-700 hover:underline"
                                                onClick={() => handleClickEdit(student)}
                                            >
                                                Edit
                                            </span>
                                            <span
                                                className="text-red-500 cursor-pointer hover:text-orange-700 hover:underline"
                                                onClick={() => handleClickDelete(student)}
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
                    <Pagination data={students} />
                </div>


                <StudentCreate open={openCreate} setOpen={setOpenCreate} courses={courses} yearLevels={yearLevels} />
                <DeleteStudent open={openDelete} setOpen={setOpenDelete} dataToDelete={dataToDelete} />
                {dataToEdit && openEdit ? (
                    <StudentEdit open={openEdit} setOpen={setOpenEdit} student={dataToEdit} courses={courses} yearLevels={yearLevels} />
                ) : null}
            </div>
        </AppLayout>
    );
}
