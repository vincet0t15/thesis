import { CourseProps } from "./courses";

export interface StudentProps {
    id: number;
    name: string;
    student_id: string;
    course_id: number;
    course: CourseProps;
}

export type StudentTypes = {
    id?: number;
    name: string;
    student_id: string;
    course_id: number;
}