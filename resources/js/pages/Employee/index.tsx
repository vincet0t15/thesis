import Pagination from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { EmployeeProps } from '@/types/employee';
import { EmploymentTypeProps } from '@/types/employmentType';
import { FilterProps } from '@/types/filter';
import { OfficeProps } from '@/types/office';
import { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { IconCircle, IconPlus } from '@tabler/icons-react';
import { HardDriveDownload } from 'lucide-react';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
import { CreateEmployee } from './CreateEmployeeDrawer';
import DeleteEmployee from './delete';
import EmployeeDrawer from './EditEmployeeDrawer';
import FilterType from './filterType';
import ImportEmployee from './importEmployee';
import EmployeeChangeStatus from './status';

interface Props {
    employees: PaginatedDataResponse<EmployeeProps>;
    filters: FilterProps;
    employmentTypes: EmploymentTypeProps[];
    offices: OfficeProps[];
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '#',
    },
];

export default function Page({ employees, filters, employmentTypes, offices }: Props) {
    const [openImport, setOpenImport] = useState(false);
    const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
    const [dataToUpdateStatus, setDataToUpdateStatus] = useState<EmployeeProps | null>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [employeeData, setEmployeeData] = useState<EmployeeProps | null>(null);
    const [openCreate, setOpenCreate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const { data, setData } = useForm({
        search: filters.search || '',
        filterTypes: (filters?.filterTypes || []).map(Number),
    });

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            router.get(
                route('student.index'),
                {
                    search: data.search,
                    'filterTypes[]': data.filterTypes,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handleClickUpdateStatus = (data: EmployeeProps) => {
        setDataToUpdateStatus(data);
        setOpenUpdateStatus(true);
    };

    const onChangeSelected = (type: number) => {
        const updatedFilterTypes = data.filterTypes.includes(type) ? data.filterTypes.filter((t) => t !== type) : [...data.filterTypes, type];

        setData('filterTypes', updatedFilterTypes);

        router.get(route('student.index'), {
            search: data.search,
            'filterTypes[]': updatedFilterTypes,
            preserveState: true,
            replace: true,
        });
    };

    const handleClickName = (data: EmployeeProps) => {
        setEmployeeData(data);
        setOpenDrawer(true);
    };

    const handleClickDelete = (data: EmployeeProps) => {
        setEmployeeData(data);
        setOpenDelete(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setOpenCreate(true)}>
                            <IconPlus />
                            <span className="rounded-sm lg:inline">Employee</span>
                        </Button>
                        <Button variant="outline" size="sm" className="cursor-pointer">
                            <HardDriveDownload />
                            <span
                                className="rounded-sm lg:inline"
                                onClick={() => {
                                    requestAnimationFrame(() => setOpenImport(true));
                                }}
                            >
                                Import
                            </span>
                        </Button>
                        <FilterType setSelectedTypes={onChangeSelected} selectedType={data.filterTypes} employment_type={employmentTypes} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Input onKeyDown={handleKeyDown} onChange={handleSearchChange} placeholder="Search..." value={data.search} />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Fingerprint ID</TableHead>
                                <TableHead>Office</TableHead>
                                <TableHead className="">Status</TableHead>
                                <TableHead className="">Type</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.data.length > 0 ? (
                                employees.data.map((employee, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell
                                            className="cursor-pointer text-sm uppercase hover:font-bold hover:underline"
                                            onClick={() => handleClickName(employee)}
                                        >
                                            {employee.name}
                                        </TableCell>
                                        <TableCell className="text-sm">{employee.fingerprint_id}</TableCell>
                                        <TableCell className="text-sm uppercase">{employee.office.office_name}</TableCell>
                                        <TableCell>
                                            {employee.is_active ? (
                                                <Badge variant="outline">
                                                    <IconCircle className="fill-green-500 dark:fill-green-400" />
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    <IconCircle className="dark:fill-orange-700" />
                                                    Inactive
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-sm">{employee.employment_type.employment_type}</TableCell>
                                        <TableCell className="text-center text-sm">
                                            <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2">
                                                <Label className="cursor-pointer hover:underline" onClick={() => handleClickUpdateStatus(employee)}>
                                                    {employee.is_active ? (
                                                        <span className="text-teal-700">Active</span>
                                                    ) : (
                                                        <span className="text-orange-400">Inactive</span>
                                                    )}
                                                </Label>
                                                <span className="hidden sm:inline">|</span>
                                                <Label
                                                    className="cursor-pointer text-red-600 hover:underline"
                                                    onClick={() => handleClickDelete(employee)}
                                                >
                                                    Delete
                                                </Label>
                                            </div>
                                        </TableCell>
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
                    <Pagination data={employees} />
                </div>
            </div>
            {openCreate && (
                <CreateEmployee open={openCreate} setOpen={() => setOpenCreate(false)} employmentTypes={employmentTypes} offices={offices} />
            )}
            {openDrawer && employeeData && (
                <EmployeeDrawer
                    offices={offices}
                    employmentTypes={employmentTypes}
                    open={openDrawer}
                    setOpen={() => setOpenDrawer(false)}
                    employeeData={employeeData}
                />
            )}
            {openImport && <ImportEmployee open={openImport} setOpen={() => setOpenImport(false)} />}
            {openUpdateStatus && dataToUpdateStatus && (
                <EmployeeChangeStatus open={openUpdateStatus} setOpen={() => setOpenUpdateStatus(false)} dataToChange={dataToUpdateStatus} />
            )}
            {openDelete && employeeData && <DeleteEmployee open={openDelete} setOpen={() => setOpenDelete(false)} dataToDelete={employeeData} />}
        </AppLayout>
    );
}
