'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Props {
    initialDate?: string;
    onSelect?: (formatted: string) => void;
    disabled?: boolean; // ✅ Added disabled prop
}

export default function CustomDatePicker({
    initialDate,
    onSelect,
    disabled = false, // ✅ Default false
}: Props) {
    const id = useId();
    const [date, setDate] = useState<Date | undefined>();

    useEffect(() => {
        if (initialDate) {
            setDate(new Date(initialDate));
        } else {
            setDate(undefined);
        }
    }, [initialDate]);

    const handleSelect = (selectedDate: Date | undefined) => {
        if (disabled) return; // ✅ Prevent selection if disabled
        setDate(selectedDate);

        if (onSelect && selectedDate) {
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            onSelect(formattedDate);
        }
    };

    return (
        <div>
            <div className="*:not-first:mt-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id={id}
                            variant="outline"
                            className={cn(
                                'group w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]',
                                disabled && 'cursor-not-allowed opacity-50',
                            )}
                            disabled={disabled} // ✅ Disable the button
                        >
                            <span
                                className={cn(
                                    'truncate',
                                    !date && 'text-muted-foreground',
                                )}
                            >
                                {date
                                    ? format(date, 'yyyy-MM-dd')
                                    : 'Pick a date'}
                            </span>
                            <CalendarIcon
                                size={16}
                                className="shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground"
                                aria-hidden="true"
                            />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            disabled={disabled} // ✅ Disable date picking
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
