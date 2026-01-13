import { StudentProps } from "./students";

export interface LogProps {
    id: number;
    user_id: number;
    checkType: string;
    event_id: number;
    student: StudentProps;
    date_time: string;
}