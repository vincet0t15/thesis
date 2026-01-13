import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EventProps, EventTypes } from '@/types/events';

import { useForm } from '@inertiajs/react';
import { Checkbox } from '@/components/ui/checkbox';
import { LoaderCircle } from 'lucide-react';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';
import CustomDatePicker from '@/components/custom-date-picker';


interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export default function CreateEvents({ open, setOpen }: Props) {
    const { data, setData, processing, errors, post, reset } = useForm<EventTypes>({
        name: '',
        date_from: '',
        date_to: '',
        location: '',
        description: '',
        time_in: '',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('event.store'), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                reset();
                setOpen(false);
            },
        });
    };

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const onChangeDateFrom = (date: string) => setData('date_from', date);
    const onChangeDateTo = (date: string) => setData('date_to', date);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <form className="mt-4 flex flex-col gap-6" onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Create Event</DialogTitle>
                        <DialogDescription>Fill in the details below to create a event.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input
                                placeholder="Enter name"
                                className=""
                                onChange={handleInputChange}
                                value={data.name}
                                name="name"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Date From</Label>
                            <CustomDatePicker
                                initialDate={data.date_from}
                                onSelect={onChangeDateFrom}
                            />
                            <InputError message={errors.date_from} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Date To</Label>
                            <CustomDatePicker
                                initialDate={data.date_to}
                                onSelect={onChangeDateTo}
                            />
                            <InputError message={errors.date_to} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Location</Label>
                            <Input placeholder="Enter location" className="" onChange={handleInputChange} value={data.location} name="location" />
                            <InputError message={errors.location} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Time In</Label>
                            <Input type='time' placeholder="Enter time in" className="" onChange={handleInputChange} value={data.time_in} name="time_in" />
                            <InputError message={errors.time_in} />
                        </div>
                        <div className="flex items-start gap-3">
                            <Checkbox
                                checked={data.is_active}
                                onCheckedChange={(checked) =>
                                    setData((prev) => ({ ...prev, is_active: Boolean(checked) }))
                                }
                            />
                            <div className="grid gap-2">
                                <Label htmlFor="terms-2">Active</Label>
                            </div>
                            <InputError message={errors.is_active} />
                        </div>


                    </div>
                    <DialogFooter>
                        <Button className="cursor-pointer" type="submit" disabled={processing} variant={'outline'} size={'sm'}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
