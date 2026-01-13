'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

interface MonthSelectProps {
    value: string;
    onChange: (value: number) => void;
    placeholder?: string;
    className?: string;
}

export function MonthSelect({ value, onChange, placeholder = 'Select month...', className = '' }: MonthSelectProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className={cn('w-auto justify-between', className)}>
                    {value !== '0' && value ? (
                        months.find((month) => month.value === value)?.label
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search month..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No month found.</CommandEmpty>
                        <CommandGroup>
                            {months.map((month) => (
                                <CommandItem
                                    key={month.value}
                                    value={`${month.value} ${month.label.toLowerCase()}`} // include label for searching
                                    onSelect={() => {
                                        onChange(Number(month.value));
                                        setOpen(false);
                                    }}
                                >
                                    {month.label}
                                    <Check className={cn('ml-auto h-4 w-4', value === month.value ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
