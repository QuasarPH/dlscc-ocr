"use client";
import { ApplicationForLoanForm } from "./forms/ApplicationForLoanForm";
import { ApplicationForUnsecuredLoanForm } from "./forms/ApplicationForUnsecuredLoanForm";
import { ApplicationForSpecialLoanForm } from "./forms/ApplicationForSpecialLoanForm";
import { TEMPLATES } from "@/utils/templates";

export function FormRenderer({
  formType,
  formData,
  onChange,
}: {
  formType: keyof typeof TEMPLATES;
  formData: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (e: React.ChangeEvent<any>) => void;
}) {
  switch (formType) {
    case "ApplicationForLoan":
      return <ApplicationForLoanForm formData={formData} onChange={onChange} />;
    case "UnsecuredLoansApplication":
      return (
        <ApplicationForUnsecuredLoanForm
          formData={formData}
          onChange={onChange}
        />
      );
    case "SpecialLoansApplication":
      return (
        <ApplicationForSpecialLoanForm
          formData={formData}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}
