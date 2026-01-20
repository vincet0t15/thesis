import Pagination from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { FilterProps } from '@/types/filter';

import { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { IconCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { FilterIcon, HardDriveDownload, Printer } from 'lucide-react';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
import { FilterData } from './filterData';
import ImportLogs from './importLogs';
import SelectEmployementType from './selectEmployementType';
import { StudentProps } from '@/types/students';
import { CourseProps } from '@/types/courses';
import { EventProps } from '@/types/events';
import { YearLevelProps } from '@/types/yearlevel';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daily Time Record',
        href: '/dtr',
    },
];

interface Props {
    students: PaginatedDataResponse<StudentProps>;
    filters: FilterProps;
    courses: CourseProps[];
    events: EventProps[];
    yearLevels: YearLevelProps[];
}
export default function DTR({ students, filters, courses, events, yearLevels }: Props) {
    const [openImport, setOpenImport] = useState(false);
    const [openFilterData, setOpenFilterData] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<number[]>([]);
    const isAllSelected = students.data.every((student) => selectedStudent.includes(student.id));


    const { data, setData } = useForm<{
        search: string;
        employment_type_id: number | null;
        date_from: Date | undefined;
        date_to: Date | undefined;
        selectedYear: string | null;
        selectedMonth: string | null;
        course_id: number | null;
        event_id: number | null;
        year_level_id: number | null;
    }>({
        search: filters.search || '',
        employment_type_id: filters.employment_type_id || 0,
        date_from: undefined as Date | undefined,
        date_to: undefined as Date | undefined,
        selectedYear: filters.selectedYear || '',
        selectedMonth: filters.selectedMonth || '',
        course_id: filters.course_id || 0,
        event_id: filters.event_id || 0,
        year_level_id: filters.year_level_id || 0,
    });

    const onChangeEvent = (id: number | 0) => {
        const isSameId = data.event_id === id;

        const updatedData = {
            ...data,
            event_id: isSameId ? null : id,
        };

        setData(updatedData);

        router.get(route('dtr.index'), updatedData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            router.get(route('dtr.index'), data, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedStudent((prev) => prev.filter((id) => !students.data.some((student) => student.id === id)));
        } else {
            const idsToAdd = students.data.map((student) => student.id).filter((id) => !selectedStudent.includes(id));

            setSelectedStudent((prev) => [...prev, ...idsToAdd]);
        }
    };

    const handlClickCheckBox = (id: number) => {
        const updatedIds = selectedStudent.includes(id) ? selectedStudent.filter((idx) => idx !== id) : [...selectedStudent, id];

        setSelectedStudent(updatedIds);
    };

    const handleClickPrint = () => {


        const url = route('dtr.print', {
            student: selectedStudent,
            event_id: data.event_id,
            selectedYear: data.selectedYear,
            selectedMonth: data.selectedMonth,
        });

        window.open(url, '_blank');
    };

    const onChangeCourse = (courseId: number) => {
        const newCourseId = data.course_id === courseId ? null : courseId;
        const updatedData = { ...data, course_id: newCourseId };
        setData(updatedData);

        router.get(route('dtr.index'), updatedData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const onChangeYear = (year: string) => {
        const updatedData = { ...data, selectedYear: year };
        setData(updatedData);
        router.get(route('dtr.index'), updatedData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const onChangeMonth = (month: string) => {
        const updatedData = { ...data, selectedMonth: month };
        setData(updatedData);
        router.get(route('dtr.index'), updatedData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const onChangeYearLevel = (yearLevelId: number) => {
        const newYearLevelId = data.year_level_id === yearLevelId ? null : yearLevelId;
        const updatedData = { ...data, year_level_id: newYearLevelId };
        setData(updatedData);

        router.get(route('dtr.index'), updatedData, {
            preserveState: true,
            preserveScroll: true,
        });
    };



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="DTR" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setOpenFilterData(true)}>
                            <FilterIcon />
                            <span className="rounded-sm lg:inline">Filter Data</span>
                        </Button>

                        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setOpenImport(true)}>
                            <HardDriveDownload />
                            <span className="rounded-sm lg:inline">Import Logs</span>
                        </Button>

                        {selectedStudent.length > 0 && (data.selectedYear || data.selectedMonth || data.event_id) && (
                            <Button variant="outline" size="sm" className="cursor-pointer" onClick={handleClickPrint}>
                                <Printer />
                                <span className="rounded-sm lg:inline">Print DTR</span>
                            </Button>
                        )}

                    </div>
                    <div className="flex items-center gap-2">
                        <Input onKeyDown={handleKeyDown} onChange={handleSearchChange} placeholder="Search..." value={data.search} />
                    </div>
                </div>
                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead className="w-[25px]">
                                    <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} className="border-white" />
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Fingerprint ID</TableHead>
                                <TableHead>Office</TableHead>
                                <TableHead className="">Status</TableHead>
                                <TableHead className="">Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.data.length > 0 ? (
                                students.data.map((student, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedStudent.includes(student.id)}
                                                onCheckedChange={() => handlClickCheckBox(student.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-sm uppercase">{student.name}</TableCell>
                                        <TableCell className="text-sm">{student.student_id}</TableCell>
                                        <TableCell className="text-sm uppercase">{student.course.course_name}</TableCell>



                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-3 text-center text-gray-500">
                                        No incoming documents available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={students} />
                </div>
            </div>
            {openImport && <ImportLogs open={openImport} setOpen={() => setOpenImport(false)} />}
            {openFilterData && (
                <FilterData
                    onChangeEvent={onChangeEvent}
                    selectedEvent={Number(data.event_id)}
                    events={events}
                    open={openFilterData}
                    setOpen={() => setOpenFilterData(false)}
                    courses={courses}
                    onChangeCourse={onChangeCourse}
                    selectedCourse={Number(data.course_id)}
                    onChangeYear={onChangeYear}
                    selectedYear={data.selectedYear || ''}
                    onChangeMonth={onChangeMonth}
                    selectedMonth={data.selectedMonth || ''}
                    yearLevels={yearLevels}
                    selectedYearLevel={Number(data.year_level_id)}
                    onChangeYearLevel={onChangeYearLevel}
                />
            )}
        </AppLayout>
    );
}
