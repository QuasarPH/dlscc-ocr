export type Field =
  | { name: string; label: string; type: "text" | "number" | "date" }
  | { name: string; label: string; type: "textarea" };

export interface Template {
  title: string;
  fields: Field[];
}

export const TEMPLATES: Record<"ApplicationForLoan" | "FormB", Template> = {
    ApplicationForLoan: {
        title: "APPLICATION FOR LOAN",
        fields: [
          { name: "coopName", label: "Credit Cooperative Name", type: "text" },
          { name: "coopAddress", label: "Cooperative Address", type: "text" },
          { name: "bookNo", label: "Book No.", type: "text" },
          { name: "loanFor", label: "Loan Amount", type: "number" },
          { name: "period", label: "Loan Period (months)", type: "number" },
          { name: "repaidIn", label: "Repay Method", type: "text" },
          { name: "installmentPesos", label: "Installment Amount 1 (In Word)", type: "text" },
          { name: "installmentPesos2", label: "Installment Amount 2 (In Word)", type: "text" },
          { name: "installmentPesosNumber", label: "Installment Amount (In Numbers)", type: "number" },
          { name: "loanDueDate", label: "Loan Due Date", type: "date" },
          { name: "purpose", label: "Loan Purpose", type: "textarea" },
          { name: "dateSigned", label: "Date", type: "date" },
          { name: "applicantSignature", label: "Name", type: "text" },
          { name: "applicantAddress", label: "Address", type: "text" },
          { name: "makerName", label: "Maker Name", type: "text" },
          { name: "makerShares", label: "Maker Un-obligated Shares (₱)", type: "number" },
          { name: "makerLoanNumber", label: "Maker Loan Number", type: "number" },
          { name: "makerLoanPrincipal", label: "Maker Loans – Principal (₱)", type: "number" },
          { name: "makerLoanCoMaker", label: "As Co-Maker (₱)", type: "text" },
          { name: "comaker1Name", label: "Co-Maker Name", type: "text" },
          { name: "comaker1Shares", label: "Co-Maker Un-obligated Shares (₱)", type: "number" },
          { name: "comaker1LoanNumber", label: "Co-Maker Loan Number", type: "number" },
          { name: "comaker1LoanPrincipal", label: "Co-Maker Loans – Principal (₱)", type: "number" },
          { name: "comaker1LoanCoMaker", label: "As Co-Maker (₱)", type: "text" },
          { name: "comaker2Name", label: "Co-Maker Name", type: "text" },
          { name: "comaker2Shares", label: "Co-Maker Un-obligated Shares (₱)", type: "number" },
          { name: "comaker2LoanNumber", label: "Co-Maker Loan Number", type: "number" },
          { name: "comaker2LoanPrincipal", label: "Co-Maker Loans – Principal (₱)", type: "number" },
          { name: "comaker2LoanCoMaker", label: "As Co-Maker (₱)", type: "text" },
          { name: "certifyDate", label: "Certify Date", type: "date" },
          { name: "certifyTreasurer", label: "Treasurer", type: "text" },
          { name: "meetingHeldDay", label: "Meeting Day (Text)", type: "text" },
          { name: "meetingHeldYear", label: "Meeting Year (Text)", type: "text" },
          { name: "approvalExceptions", label: "Approval Exceptions", type: "textarea" },
          { name: "minutesDatetime", label: "Datetime of Minutes", type: "text" },
          { name: "minutesYear", label: "Year of Minutes", type: "text" },
          { name: "committeeMember1", label: "1st Member of the Credit Committee", type: "text" },
          { name: "committeeMember2", label: "2nd Member of the Credit Committee", type: "text" },
          { name: "committeeMember3", label: "3rd Member of the Credit Committee", type: "text" }
        ]
      },
      FormB: {
        title: "LOAN APPLICATION – FORM B",
        fields: [
          { name: "name", label: "Name", type: "text" }
        ]
      }
};

export const getField = (formType: keyof typeof TEMPLATES, fieldName: string) =>
  TEMPLATES[formType].fields.find(f => f.name === fieldName);
