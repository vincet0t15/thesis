import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EmploymentTypeProps } from '@/types/employmentType';

import { IconChevronDown, IconLayout2 } from '@tabler/icons-react';
interface Props {
    employment_types: EmploymentTypeProps[];
    value: number | null;
    onChange: (value: number) => void;
}
export default function SelectEmployementType({ employment_types, value, onChange }: Props) {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                        <IconLayout2 className="mr-2" />
                        Filter type
                        <IconChevronDown className="ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {employment_types.map((data, index) => (
                        <DropdownMenuCheckboxItem
                            className="text-[12px]"
                            key={index}
                            checked={data.id === value}
                            onCheckedChange={() => onChange(data.id)}
                        >
                            {data.employment_type}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
