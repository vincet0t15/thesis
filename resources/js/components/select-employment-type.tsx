import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmploymentTypeProps } from '@/types/employmentType';
interface Props {
    employmentTypes: EmploymentTypeProps[];
    value?: string;
    onChange: (data: string) => void;
}
export default function SelectEmploymentType({ employmentTypes, value, onChange }: Props) {
    return (
        <Select value={String(value)} onValueChange={onChange}>
            <SelectTrigger className="w-auto">
                {value !== '0' ? <SelectValue placeholder="Select employment type..." /> : 'Select employment type...'}
                {/* <SelectValue placeholder="Select employment type..." /> */}
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {employmentTypes.map((data, index) => (
                        <SelectItem key={index} value={String(data.id)}>
                            {data.employment_type}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
