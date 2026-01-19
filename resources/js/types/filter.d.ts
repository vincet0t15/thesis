import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface FilterProps {
    search: string;
    course_id: number;
    selectedMonth: string;
    selectedYear: string;
    type: string;
    filterTypes: number[];
    employment_type_id: number;
    event_id: number;
    date_from: string;
    date_to: string;
}

interface MyPageProps extends InertiaPageProps {
    filters: FilterProps;
}
