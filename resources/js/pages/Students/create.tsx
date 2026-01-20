import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';
import { SelectCourses } from './selectCourses';
import { CourseProps } from '@/types/courses';
import { StudentTypes } from '@/types/students';
import { YearLevelProps } from '@/types/yearlevel';

interface Props {
    courses: CourseProps[];
    yearLevels: YearLevelProps[];
    open: boolean;
    setOpen: (open: boolean) => void;
}
export default function StudentCreate({ open, setOpen, courses, yearLevels }: Props) {
    const { data, setData, processing, errors, post, reset } = useForm<StudentTypes>({
        name: '',
        student_id: '',
        course_id: 0,
        year_level_id: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('student.store'), {
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
                        <DialogTitle>Add Student</DialogTitle>
                        <DialogDescription>Fill in the details below to add a student.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Student ID</Label>
                            <Input
                                placeholder="Enter student ID"
                                className=""
                                onChange={handleInputChange}
                                value={data.student_id}
                                name="student_id"

                            />
                            <InputError message={errors.student_id} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input
                                placeholder="Enter student name"
                                className=""
                                onChange={handleInputChange}
                                value={data.name}
                                name="name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className='flex gap-4'>
                            <div className="grid gap-2 w-full">

                                <Label>Course</Label>
                                <SelectCourses
                                    courses={courses}
                                    onChange={(course_id) => setData((prev) => ({ ...prev, course_id }))}
                                    dataValue={data.course_id}

                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Year Level</Label>
                                <Select


                                    value={data.year_level_id ? String(data.year_level_id) : ''}
                                    onValueChange={(val) => setData('year_level_id', Number(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Year Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {yearLevels.map((yl) => (
                                            <SelectItem key={yl.id} value={String(yl.id)}>
                                                {yl.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button className="cursor-pointer" type="submit" disabled={processing} variant={'outline'} size={'sm'}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Add Student
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
