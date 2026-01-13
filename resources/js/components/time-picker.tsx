'use client';

import { Input } from '@/components/ui/input';
interface Props {
    value: '';
    onChangeTime: (time: string) => void;
}
export function TimePicker({ value, onChangeTime }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChangeTime(e.target.value);
    };
    return (
        <div className="flex gap-4">
            <Input
                value={value}
                onChange={handleChange}
                type="time"
                id="time-picker"
                step="60"
                className="w-full appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
        </div>
    );
}
