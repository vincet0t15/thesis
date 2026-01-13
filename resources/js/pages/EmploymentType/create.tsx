import InputError from '@/components/input-error';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmploymentTypes } from '@/types/employmentType';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export function CreateEmploymentType({ open, setOpen }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm<EmploymentTypes>({
        employment_type: '',
    });

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData((prev) => ({ ...prev, employment_type: e.target.value }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('employment.store'), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <form onSubmit={submit}>
                    <AlertDialogHeader className="mb-3">
                        <AlertDialogTitle>Create Employment Type</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please provide the necessary details to add a new employment type. You can edit or remove it later if needed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="mb-6 flex flex-col gap-3">
                        <Label>Employment Type</Label>
                        <Input placeholder="Enter employment type" onChange={handleInputChange} value={data.employment_type} required />
                        <InputError message={errors.employment_type} />
                    </div>
                    <AlertDialogFooter>
                        <Button size={'sm'} onClick={() => setOpen(false)} variant={'outline'} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button className="cursor-pointer" type="submit" disabled={processing} variant={'default'} size={'sm'}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
