'use client';

import CustomDatePicker from '@/components/custom-date-picker';
import { MonthSelect } from '@/components/select-month';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ChangeEventHandler } from 'react';
import { SelectCourses } from '../Students/selectCourses';
import { CourseProps } from '@/types/courses';
import { EventProps } from '@/types/events';
import { SelectEvents } from './selectEvents';
import { YearLevelProps } from '@/types/yearlevel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    courses: CourseProps[];
    events: EventProps[];
    yearLevels: YearLevelProps[];
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedCourse: number;
    onChangeCourse: (courseId: number) => void;
    selectedEvent: number;
    onChangeEvent: (eventId: number) => void;
    onChangeYear: (year: string) => void;
    selectedYear: string;
    onChangeMonth: (month: string) => void;
    selectedMonth: string;
    selectedYearLevel: number;
    onChangeYearLevel: (yearLevelId: number) => void;
}
export function FilterData({
    open,
    setOpen,
    courses,
    events,
    yearLevels,
    onChangeCourse,
    selectedCourse,
    selectedEvent,
    onChangeEvent,
    onChangeYear,
    selectedYear,
    onChangeMonth,
    selectedMonth,
    selectedYearLevel,
    onChangeYearLevel,
}: Props) {


    return (
        <Drawer open={open} direction="right" onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Filter Data</DrawerTitle>
                    <DrawerDescription>Fill out the form to register a new employee.</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Course</Label>
                            <SelectCourses courses={courses} onChange={onChangeCourse} dataValue={selectedCourse} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Year Level</Label>
                            <Select
                                value={selectedYearLevel ? String(selectedYearLevel) : ''}
                                onValueChange={(val) => onChangeYearLevel(Number(val))}
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
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Event</Label>
                            <SelectEvents events={events} onChangeEvent={onChangeEvent} dataValue={selectedEvent} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Year</Label>
                            <Input
                                placeholder="Year"
                                value={selectedYear}
                                onChange={(e) => onChangeYear(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Month</Label>
                            <MonthSelect
                                value={selectedMonth}
                                onChange={(value) => onChangeMonth(String(value))}
                            />
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Button onClick={() => setOpen(false)} size={'sm'} className="cursor-pointer">
                        Close
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
