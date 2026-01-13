import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EmploymentTypeProps } from '@/types/employmentType';
import { IconChevronDown, IconLayoutColumns } from '@tabler/icons-react';
interface Props {
    selectedType: number[];
    setSelectedTypes: (type: number) => void;
    employment_type: EmploymentTypeProps[];
}
export default function FilterType({ selectedType, setSelectedTypes, employment_type }: Props) {
    const toggleType = (type: number) => {
        setSelectedTypes(type);
    };
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                        <IconLayoutColumns className="mr-2" />
                        Filter
                        <IconChevronDown className="ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {employment_type.map((data, index) => (
                        <DropdownMenuCheckboxItem
                            className="text-[12px]"
                            key={index}
                            checked={selectedType.includes(data.id)}
                            onCheckedChange={() => toggleType(data.id)}
                        >
                            {data.employment_type}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
