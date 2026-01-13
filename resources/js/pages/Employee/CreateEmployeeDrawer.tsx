'use client';

import InputError from '@/components/input-error';
import { TimePicker } from '@/components/time-picker';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { EmployeeTypes } from '@/types/employee';
import { EmploymentTypeProps } from '@/types/employmentType';
import { OfficeProps } from '@/types/office';
import { useForm } from '@inertiajs/react';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';
import SelectEmploymentType from './selectEmploymentType';
import { SelectOffices } from './selectOffice';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    employmentTypes: EmploymentTypeProps[];
    offices: OfficeProps[];
}
export function CreateEmployee({ open, setOpen, employmentTypes, offices }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm<EmployeeTypes>({
        name: '',
        fingerprint_id: 0,
        office_id: 0,
        employment_type_id: 0,
        flexi_time_in: '',
        flexi_time_out: '',
        nightShift: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data);
        post(route('employee.store'), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                reset();
                setOpen(false);
            },
        });
    };

    const onChangeType = (id: number) => {
        setData((prev) => ({ ...prev, employment_type_id: id }));
    };

    const onChangeOffice = (id: number) => {
        setData((prev) => ({ ...prev, office_id: id }));
    };

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onChangeTimeIn = (time: string) => {
        setData((prev) => ({ ...prev, flexi_time_in: time }));
    };

    const onChangeTimeOut = (time: string) => {
        setData((prev) => ({ ...prev, flexi_time_out: time }));
    };
    return (
        <Drawer open={open} onOpenChange={setOpen} direction="right">
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add Employee</DrawerTitle>
                    <DrawerDescription>Fill out the form to register a new employee.</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Name</Label>
                            <Input placeholder="Enter employee name" name="name" value={data.name} onChange={handleInputChange} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="header">Fingerprint ID</Label>
                                <Input
                                    type="number"
                                    placeholder="Enter fingerprint ID"
                                    name="fingerprint_id"
                                    value={data.fingerprint_id}
                                    onChange={handleInputChange}
                                />
                                <InputError message={errors.fingerprint_id} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="header">Employement Type</Label>
                                <SelectEmploymentType
                                    selectedType={data.employment_type_id}
                                    employment_types={employmentTypes}
                                    setSelectedTypes={onChangeType}
                                />
                                <InputError message={errors.employment_type_id} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Office</Label>
                            <SelectOffices offices={offices} dataValue={data.office_id} onChange={onChangeOffice} />
                            <InputError message={errors.office_id} />
                        </div>
                        <div>
                            <hr />
                        </div>
                        <div>
                            <Label className="text-[17px] font-bold">Flexi Time</Label>
                        </div>

                        <div className="grid grid-cols-2 items-end gap-4">
                            <div className="flex flex-col gap-3">
                                <Label>Time In</Label>
                                <TimePicker onChangeTime={onChangeTimeIn} value={data.flexi_time_in} />
                                <InputError message={errors.fingerprint_id} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>Time Out</Label>
                                <TimePicker onChangeTime={onChangeTimeOut} value={data.flexi_time_out} />
                                <InputError message={errors.fingerprint_id} />
                            </div>
                        </div>
                        <div>
                            <hr />
                        </div>
                        <div>
                            <Label className="text-[17px] font-bold">Night Shift</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="night-shift" checked={data.nightShift} onCheckedChange={(checked) => setData('nightShift', checked)} />
                            <Label htmlFor="night-shift">{data.nightShift ? 'Night Shift Active' : 'Enable Night Shift'}</Label>
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Button onClick={submit} type="submit" size={'sm'} className="cursor-pointer">
                        Save
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
