// components/FormSelector.tsx
"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type FormSelectorProps<T extends string> = {
  options: Record<T, string>;
  value: T;
  onChange: (v: T) => void;
};

export function FormSelector<T extends string>({ options, value, onChange }: FormSelectorProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={(v) => onChange(v as T)} defaultValue={value}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Choose a form..." />
          </SelectTrigger>
          <SelectContent>
            {/* cast Object.keys to T[] so key is typed correctly */}
            {(Object.keys(options) as T[]).map((key) => (
              <SelectItem key={key} value={key}>
                {options[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
