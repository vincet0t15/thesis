import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmploymentTypeProps } from '@/types/employmentType';
interface Props {
    selectedType?: number;
    setSelectedTypes: (type: number) => void;
    employment_types: EmploymentTypeProps[];
}
export default function SelectEmploymentType({ selectedType, setSelectedTypes, employment_types }: Props) {
    const handleChangeEmploymentType = (type: string) => {
        setSelectedTypes(Number(type));
    };
    return (
        <div>
            <Select value={String(selectedType)} onValueChange={handleChangeEmploymentType}>
                <SelectTrigger className="w-full">
                    {selectedType ? <SelectValue /> : <span className="truncate text-gray-500">Select employment type...</span>}
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {employment_types.map((data, index) => (
                            <SelectItem key={index} value={String(data.id)}>
                                {data.employment_type}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
