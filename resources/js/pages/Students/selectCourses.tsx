'use client';

import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { StudentProps } from '@/types/students';
import { useEffect, useState } from 'react';
import { CourseProps } from '@/types/courses';

interface Props {
    courses: CourseProps[];
    onChange: (course_id: number) => void;
    dataValue?: number;
}

export function SelectCourses({ courses, onChange, dataValue }: Props) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');

    const selectedCourse = courses.find((course) => String(course.id) === value);

    const handleSelectChange = (courseId: string) => {
        setValue(courseId === value ? '' : courseId);
        onChange(Number(courseId));
        setOpen(false);
    };

    useEffect(() => {
        if (dataValue === 0) {
            setValue('');
        } else {
            setValue(String(dataValue));
        }
    }, [dataValue]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="w-full bg-neutral-100">
                <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between truncate">
                    {selectedCourse ? selectedCourse.course_name : <span className="text-gray-500">Select course...</span>}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[355px] p-0">
                <Command>
                    <CommandInput placeholder="Search document type..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No data found...</CommandEmpty>
                        <CommandGroup className="text-left">
                            {courses.map((data) => (
                                <Tooltip key={data.id}>
                                    <CommandItem
                                        className="justify-start truncate text-left"
                                        value={data.course_name}
                                        onSelect={() => handleSelectChange(String(data.id))}
                                    >
                                        <TooltipTrigger asChild>
                                            <div className="flex">
                                                <Check className={cn('mr-2 h-4 w-4', value === String(data.id) ? 'opacity-100' : 'opacity-0')} />
                                                <span className="flex-1 text-left">{data.course_name}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{data.course_name}</p>
                                        </TooltipContent>
                                    </CommandItem>
                                </Tooltip>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
