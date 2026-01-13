export interface EventProps {
    id: number;
    name: string;
    date_from: string;
    date_to: string;
    location: string;
    description: string;
    is_active: boolean;
    time_in?: string;

}

export type EventTypes = {
    name: string;
    date_from: string;
    date_to: string;
    location: string;
    description: string;
    is_active: boolean;
    time_in?: string;
}