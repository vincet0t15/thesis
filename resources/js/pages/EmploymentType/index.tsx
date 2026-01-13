import Pagination from '@/components/paginationData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { EmploymentTypeProps } from '@/types/employmentType';
import { FilterProps } from '@/types/filter';
import { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { IconPlus } from '@tabler/icons-react';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
import { CreateEmploymentType } from './create';
import DeleteEmploymentType from './delete';
import { EditEmploymentType } from './edit';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employment Types',
        href: '/employment-types',
    },
];
interface Props {
    employmentTypes: PaginatedDataResponse<EmploymentTypeProps>;
    filters: FilterProps;
}
export default function EmploymentTypeIndex({ employmentTypes, filters }: Props) {
    const { data, setData } = useForm({
        search: filters.search || '',
    });
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [dataToEdit, setDataEdit] = useState<EmploymentTypeProps | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [dataToDelete, setDataToDelete] = useState<EmploymentTypeProps | null>(null);

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const queryString = data.search ? { search: data.search } : undefined;
            router.get(route('employment.index'), queryString, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handleClickName = (data: EmploymentTypeProps) => {
        setDataEdit(data);
        setOpenEdit(true);
    };

    const handleClickDelete = (data: EmploymentTypeProps) => {
        setDataToDelete(data);
        setOpenDelete(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employment Types" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setOpenCreate(true)}>
                        <IconPlus />
                        <span className="rounded-sm lg:inline">Employment Type</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Input onKeyDown={handleKeyDown} onChange={handleSearchChange} placeholder="Search..." value={data.search} />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Employment Type</TableHead>
                                <TableHead className="w-25"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employmentTypes.data.length > 0 ? (
                                employmentTypes.data.map((employmentType, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell className="cursor-pointer text-sm uppercase hover:font-bold hover:underline">
                                            <span onClick={() => handleClickName(employmentType)}>{employmentType.employment_type}</span>
                                        </TableCell>

                                        <TableCell className="text-sm">
                                            <span
                                                className="cursor-pointer hover:text-orange-700 hover:underline"
                                                onClick={() => handleClickDelete(employmentType)}
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
                    <Pagination data={employmentTypes} />
                </div>
            </div>
            {openCreate && <CreateEmploymentType open={openCreate} setOpen={() => setOpenCreate(false)} />}
            {openEdit && dataToEdit && <EditEmploymentType open={openEdit} setOpen={() => setOpenEdit(false)} dataToEdit={dataToEdit} />}
            {openDelete && dataToDelete && (
                <DeleteEmploymentType open={openDelete} setOpen={() => setOpenDelete(false)} dataToDelete={dataToDelete} />
            )}
        </AppLayout>
    );
}
