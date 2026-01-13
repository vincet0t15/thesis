import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { EmployeeProps } from '@/types/employee';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    dataToChange: EmployeeProps;
}
export default function EmployeeChangeStatus({ open, setOpen, dataToChange }: Props) {
    const changeUserStatus = () => {
        router.put(
            route('employee.update.status', dataToChange.id),
            {},
            {
                onSuccess: (response: { props: FlashProps }) => {
                    toast.success(response.props.flash?.success);
                    setOpen(false);
                },
            },
        );
    };

    return (
        <div>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{dataToChange.is_active ? 'Deactivate' : 'Activate'} this user?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will {dataToChange.is_active ? 'deactivate' : 'activate'}{' '}
                            <strong className={`${dataToChange.is_active ? 'text-teal-600' : 'text-orange-700'}`}>{dataToChange.name}</strong>. Are
                            you sure you want to proceed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button size="sm" variant="outline" onClick={() => setOpen(false)} className="cursor-pointer rounded-sm">
                            Cancel
                        </Button>
                        <Button onClick={changeUserStatus} size="sm" className="cursor-pointer rounded-sm">
                            Continue
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
