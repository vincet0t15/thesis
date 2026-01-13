import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CourseProps, CourseTypes } from '@/types/courses';
import { OfficeProps, OfficeTypes } from '@/types/office';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    dataToEdit: CourseProps;
}
export default function EditCourse({ open, setOpen, dataToEdit }: Props) {

    const { data, setData, processing, errors, put, reset } = useForm<CourseTypes>({
        course_name: dataToEdit.course_name || '',
        course_code: dataToEdit.course_code || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('course.update', dataToEdit.id), {
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <form className="mt-4 flex flex-col gap-6" onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Edit Course</DialogTitle>
                        <DialogDescription>Fill in the details below to create a course.</DialogDescription >
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label>Course Name</Label>
                            <Input placeholder="Enter course name" onChange={handleInputChange} value={data.course_name} name="course_name" />
                            <InputError message={errors.course_name} />
                        </div>

                        <div className="grid gap-3">
                            <Label>Course Code</Label>
                            <Input placeholder="Enter course code" className="" onChange={handleInputChange} value={data.course_code} name="course_code" />
                            <InputError message={errors.course_code} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="cursor-pointer" type="submit" disabled={processing} variant={'outline'}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
