"use client";
import { ChangeEvent } from "react";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TEMPLATES, getField } from "@/utils/templates";

type Props = {
  formData: Record<string, string>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export function ApplicationForLoanForm({ formData, onChange }: Props) {
  // Renders a single field by name, choosing Input vs Textarea as needed
  const renderField = (name: string) => {
    const f = getField("ApplicationForLoan", name);
    if (!f) {
      console.warn(`Field "${name}" not found in ApplicationForLoan template`);
      return null; // or return a placeholder ui
    }

    return f.type === "textarea" ? (
      <div key={name} className="md:col-span-2">
        <Label htmlFor={name}>{f.label}</Label>
        <Textarea id={name} name={name} value={formData[name] || ""} onChange={onChange} rows={3} />
      </div>
    ) : (
      <div key={name}>
        <Label htmlFor={name}>{f.label}</Label>
        <Input
          id={name}
          name={name}
          type={f.type}
          value={formData[name] || ""}
          onChange={onChange}
          className="h-8"
        />
      </div>
    );
  };

  // These fields get laid out in custom sections below
  const fieldsHandledSeparately = [
    "coopName",
    "coopAddress",
    "bookNo",
    "loanFor",
    "period",
    "repaidIn",
    "installmentPesos",
    "installmentPesos2",
    "installmentPesosNumber",
    "loanDueDate",
    "purpose",
    "dateSigned",
    "applicantSignature",
    "applicantAddress",
    "meetingHeldDay",
    "meetingHeldYear",
  ];

  // Split the remaining fields into those before vs. after approvalExceptions
  const allNames = TEMPLATES.ApplicationForLoan.fields.map((f) => f.name);
  const nonCustom = allNames.filter((n) => !fieldsHandledSeparately.includes(n));
  const idx = nonCustom.indexOf("approvalExceptions");
  const fieldsBefore = idx >= 0 ? nonCustom.slice(0, idx) : nonCustom;
  const fieldsAfter = idx >= 0 ? nonCustom.slice(idx) : [];

  return (
    <CardContent className="space-y-8">
      {/* 1. Cooperative Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
        {["coopName", "coopAddress", "bookNo"].map(renderField)}
      </div>

      {/* 2. "I hereby apply ..." sentence */}
      <div className="text-sm space-y-1">
        <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-2 leading-relaxed">
          <span>I hereby apply for a loan for</span>
          <Input
            name="loanFor"
            type="number"
            placeholder="Amount"
            className="inline-block w-28 h-8 px-2 text-sm"
            value={formData.loanFor || ""}
            onChange={onChange}
          />
          <span>PESOS for a period of</span>
          <Input
            name="period"
            type="number"
            placeholder="Months"
            className="inline-block w-20 h-8 px-2 text-sm"
            value={formData.period || ""}
            onChange={onChange}
          />
          <span>months, to be repaid in</span>
          <Input
            name="repaidIn"
            type="text"
            placeholder="e.g. Cash"
            className="inline-block w-32 h-8 px-2 text-sm"
            value={formData.repaidIn || ""}
            onChange={onChange}
          />
          <span>installments of</span>
          <Input
            name="installmentPesos"
            type="text"
            placeholder="Amount in words"
            className="inline-block w-48 h-8 px-2 text-sm"
            value={formData.installmentPesos || ""}
            onChange={onChange}
          />
          <span>and</span>
          <Input
            name="installmentPesos2"
            type="text"
            placeholder="Cents in words"
            className="inline-block w-40 h-8 px-2 text-sm"
            value={formData.installmentPesos2 || ""}
            onChange={onChange}
          />
          <span>PESOS (P</span>
          <Input
            name="installmentPesosNumber"
            type="number"
            placeholder="0.00"
            className="inline-block w-24 h-8 px-2 text-sm"
            value={formData.installmentPesosNumber || ""}
            onChange={onChange}
          />
          <span>) each plus interest; I prefer the first payment to all due on</span>
          <Input
            name="loanDueDate"
            type="date"
            className="inline-block w-36 h-8 px-2 text-sm"
            value={formData.loanDueDate || ""}
            onChange={onChange}
          />
          <span>.</span>
        </p>
      </div>

      {/* 3. Loan Purpose */}
      {getField("ApplicationForLoan", "purpose") && (
        <div>
          <Label htmlFor="purpose" className="block mb-1.5 text-sm font-medium">
            I desire this loan for the following provident/productive purposes: (Explain fully)
          </Label>
          <Textarea
            id="purpose"
            name="purpose"
            value={formData.purpose || ""}
            onChange={onChange}
            rows={3}
          />
        </div>
      )}

      {/* 4. Certification Text */}
      <div className="space-y-1 text-xs text-gray-600 border-t border-b py-3">
        <p>
          I hereby certify that I will not resign during the term of my loan and that I have no
          pending case with my employer-school.
        </p>
        <p>
          I hereby certify that all statements made including those on the reverse side hereon are
          true and complete and submitted for the purpose of obtaining credit.
        </p>
      </div>

      {/* 5. Signature Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
        {["dateSigned", "applicantSignature", "applicantAddress"].map((name) => {
          const fld = getField("ApplicationForLoan", name)!;
          const label = name === "applicantSignature" ? "Name in Print & Signature" : fld.label;
          return (
            <div key={name}>
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                name={name}
                type={fld.type}
                value={formData[name] || ""}
                onChange={onChange}
                className="h-8"
              />
            </div>
          );
        })}
      </div>

      {/* 6. Fields Before Meeting Approval */}
      {fieldsBefore.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pt-6 border-t">
          {fieldsBefore.map(renderField)}
        </div>
      )}

      {/* 7. Meeting Approval Statement */}
      {getField("ApplicationForLoan", "meetingHeldDay") && (
        <div className="space-y-2 pt-6 border-t">
          <Label className="text-muted-foreground font-medium text-base block mb-2">
            Meeting Approval Statement
          </Label>
          <div className="space-y-2 text-sm">
            <div className="flex flex-wrap items-center gap-1.5 whitespace-nowrap">
              <span>At a meeting held on</span>
              <Input
                id="meetingHeldDay"
                name="meetingHeldDay"
                type="text"
                className="w-32 h-8 px-2 text-sm"
                placeholder="e.g. May 25"
                value={formData.meetingHeldDay || ""}
                onChange={onChange}
              />
              <span>, 20</span>
              <Input
                id="meetingHeldYear"
                name="meetingHeldYear"
                type="text"
                className="w-16 h-8 px-2 text-sm"
                placeholder="YY"
                value={formData.meetingHeldYear || ""}
                onChange={onChange}
              />
              <span>,</span>
            </div>
            <div>
              <span className="text-sm leading-relaxed">
                we approved the above loan in the amount and on the conditions requested by the
                applicant, except as to the following (list any changes in amount, terms, or
                conditions below):
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 8. Fields After Meeting Approval */}
      {fieldsAfter.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pt-6 border-t">
          {fieldsAfter.map(renderField)}
        </div>
      )}
    </CardContent>
  );
}
