import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { toast } from 'sonner';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function ImportEmployee({ open, setOpen }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, reset, processing } = useForm({
        file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('file', e.target.files?.[0] || null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('employee.import'), {
            onSuccess: (response: { props: FlashProps }) => {
                console.log(response);
                toast.success(response.props.flash?.success);
                reset();
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setOpen(false);
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Importing Employee Data</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please wait while the data is being imported. Do not refresh or close the window during this process.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={submit}>
                    <Input type="file" accept=".xlsx,.xls,.csv" ref={fileInputRef} onChange={handleFileChange} />

                    <div className="mt-4 flex justify-end space-x-2">
                        <Button
                            onClick={() => setOpen(false)}
                            variant={'destructive'}
                            size={'sm'}
                            className="cursor-pointer rounded-sm"
                            type="button"
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button size={'sm'} variant="outline" className="cursor-pointer rounded-sm" type="submit" disabled={processing}>
                            {processing ? 'Importing...' : 'Import'}
                        </Button>
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
