import InputError from '@/components/input-error';
import { TimePicker } from '@/components/time-picker';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { EmployeeProps, EmployeeTypes } from '@/types/employee';
import { EmploymentTypeProps } from '@/types/employmentType';
import { OfficeProps } from '@/types/office';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import DeleteFlexiTime from './deleteFlexitime';
import { SelectOffices } from './selectOffice';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    employeeData: EmployeeProps;
    employmentTypes: EmploymentTypeProps[];
    offices: OfficeProps[];
}
export default function EmployeeDrawer({ open, setOpen, employeeData, employmentTypes, offices }: Props) {
    const { data, setData, put, reset, processing, errors } = useForm<EmployeeTypes>({
        name: employeeData.name || undefined,
        fingerprint_id: employeeData.fingerprint_id || 0,
        office_id: employeeData.office_id || 0,
        employment_type_id: employeeData.employment_type_id,
        flexi_time_in: employeeData?.flexi_time?.time_in || '',
        flexi_time_out: employeeData?.flexi_time?.time_out || '',
        nightShift: employeeData.night_shift?.is_nightshift ?? false,
    });

    const [deleteFlexiTime, setDeleteFlexiTime] = useState(false);
    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChangeEmploymentType = (data: string) => {
        setData((prev) => ({ ...prev, employment_type_id: Number(data) }));
    };

    const onChange = (officeId: number) => {
        setData((prev) => ({ ...prev, office_id: Number(officeId) }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('employee.update', employeeData.id), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                reset();
                setOpen(false);
            },
        });
    };

    const onChangeTimeIn = (time: string) => {
        setData((prev) => ({ ...prev, flexi_time_in: time }));
    };

    const onChangeTimeOut = (time: string) => {
        setData((prev) => ({ ...prev, flexi_time_out: time }));
    };

    return (
        <Drawer direction={'right'} open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Edit Employee</DrawerTitle>
                    <DrawerDescription>Update the employee's information below. Make sure all details are accurate before saving.</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto text-sm">
                    <form className="flex flex-1 flex-col justify-between">
                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                            <div className="flex flex-col gap-4 text-sm">
                                <div className="flex flex-col gap-3">
                                    <Label>Fullname</Label>
                                    <Input name="name" value={data.name} onChange={handleInputChange} />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label>Fingerprint ID</Label>
                                        <Input name="fingerprint_id" value={data.fingerprint_id} onChange={handleInputChange} />
                                        <InputError message={errors.fingerprint_id} />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="status">Employment Type</Label>
                                        <Select value={String(data.employment_type_id)} onValueChange={handleChangeEmploymentType}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {employmentTypes.map((data, index) => (
                                                        <SelectItem key={index} value={String(data.id)}>
                                                            {data.employment_type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.employment_type_id} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="reviewer">Office</Label>
                                    <SelectOffices offices={offices} onChange={onChange} dataValue={data.office_id} />
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
                                <div className="flex flex-col justify-end">
                                    <Button disabled={!employeeData.flexi_time} type="button" onClick={() => setDeleteFlexiTime(true)}>
                                        Disable
                                    </Button>
                                </div>
                                <div>
                                    <hr />
                                </div>
                                <div>
                                    <Label className="text-[17px] font-bold">Night Shift</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="night-shift"
                                        checked={data.nightShift}
                                        onCheckedChange={(checked) => setData('nightShift', checked)}
                                    />
                                    <Label htmlFor="night-shift">{data.nightShift ? 'Night Shift Active' : 'Enable Night Shift'}</Label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                {deleteFlexiTime && <DeleteFlexiTime open={deleteFlexiTime} setOpen={() => setDeleteFlexiTime(false)} dataToDelete={employeeData} />}
                <DrawerFooter>
                    <Button className="cursor-pointer" type="submit" disabled={processing} variant={'outline'} size={'sm'} onClick={submit}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Update
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
