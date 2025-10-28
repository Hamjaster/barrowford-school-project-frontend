import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  isLoading?: boolean;
}

export default function FilterDropdown({
  value,
  onValueChange,
  options,
  placeholder,
  isLoading = false,
}: FilterDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-gray-500" />
      <Select value={value} onValueChange={onValueChange} disabled={isLoading}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All {placeholder.toLowerCase()}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value !== "all" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onValueChange("all")}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
