import { CourseProps } from "./courses";
import { YearLevelProps } from "./yearlevel";

export interface StudentProps {
    id: number;
    name: string;
    student_id: string;
    course_id: number;
    year_level_id: number | null;
    course: CourseProps;
    year_level: YearLevelProps | null;
}

export type StudentTypes = {
    id?: number;
    name: string;
    student_id: string;
    course_id: number;
    year_level_id: number | null;
}