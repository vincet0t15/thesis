import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function ImportLogs({ open, setOpen }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLargeFile, setIsLargeFile] = useState(false);

    const { data, setData, post, reset, processing } = useForm({
        file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('file', file);
        
        // Flag large files (over 50MB) for special handling information
        if (file && file.size > 50 * 1024 * 1024) {
            setIsLargeFile(true);
        } else {
            setIsLargeFile(false);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('dtr.import.logs'), {
            onSuccess: () => {
                toast.success('Import started successfully');
                
                // For large files, provide additional information
                if (isLargeFile) {
                    toast.info('Large file import in progress', {
                        description: 'Your file is being processed in the background. You can continue using the application. You will receive a notification when the import is complete.',
                        duration: 10000
                    });
                }
                
                reset();
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setOpen(false);
            },
            onError: (errors) => {
                toast.error('Import failed', {
                    description: errors.file || 'An error occurred while starting the import process.'
                });
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Import Employee Logs</AlertDialogTitle>
                    <AlertDialogDescription>
                        {isLargeFile ? (
                            <div className="text-yellow-700">
                                <p className="font-semibold">Large File Detected</p>
                                <p>This file will be processed in the background. You can continue using the application while the import runs.</p>
                                <p className="mt-2">Estimated processing time: Several minutes depending on file size.</p>
                            </div>
                        ) : (
                            <p>Select an Excel file (.xlsx, .xls, .csv) to import employee logs.</p>
                        )}
                        <p className="mt-2">You will receive a notification when the import is complete.</p>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={submit}>
                    <Input 
                        type="file" 
                        accept=".xlsx,.xls,.csv" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        disabled={processing}
                    />

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
                        <Button 
                            size={'sm'} 
                            className="cursor-pointer rounded-sm" 
                            type="submit" 
                            disabled={processing || !data.file}
                        >
                            {processing ? (
                                <span className="flex items-center">
                                    <span className="mr-2 h-3 w-3 rounded-full border-2 border-t-2 border-white border-t-transparent animate-spin"></span>
                                    Starting Import...
                                </span>
                            ) : 'Import'}
                        </Button>
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}