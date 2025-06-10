"use client";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TEMPLATES } from "@/utils/templates";

type Props = {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export function FormBForm({ formData, onChange }: Props) {
  return (
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.FormB.fields.map((f) => (
          <div key={f.name} className={f.type === "textarea" ? "md:col-span-2" : ""}>
            <Label htmlFor={f.name}>{f.label}</Label>
            {f.type === "textarea" ? (
              <Textarea
                id={f.name}
                name={f.name}
                value={formData[f.name] || ""}
                onChange={onChange}
                rows={4}
              />
            ) : (
              <Input
                id={f.name}
                name={f.name}
                type={f.type}
                value={formData[f.name] || ""}
                onChange={onChange}
                className="h-8"
              />
            )}
          </div>
        ))}
      </div>
    </CardContent>
  );
}
