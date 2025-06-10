export enum DocumentCategory {
  LOAN_APPLICATION = "Loan Application",
  UNSECURED_LOANS_APPLICATION = "Unsecured Loans Application",
  SPECIAL_LOANS = "Special Loans",
  OTHERS = "Others",
  PROCESSING = "Processing...", // For classification
  ERROR = "Error Processing",
}

export const API_KEY_ERROR_MESSAGE = "API_KEY environment variable not set. Please ensure it's configured.";
export const GEMINI_API_KEY = process.env.API_KEY;
export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const MAX_TOTAL_FILES = 10;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ACCEPTED_FILE_TYPES = '.png,.jpeg,.jpg,.webp,.gif,.pdf';

export const CATEGORY_KEYWORDS_PROMPT_PART = `
- "Loan Application": if the document prominently features "APPLICATION FOR LOAN" near the top.
- "Unsecured Loans Application": if the document prominently features "APPLICATION FOR UNSECURED LOANS" near the top.
- "Special Loans": if the document prominently features "APPLICATION FOR 13TH MONTH LOAN/LONGEVITY LOAN/ANNIVERSARY BONUS LOAN" or similar phrases for special loan types near the top.
- "Others": if none of the above specific phrases are clearly identified, or if the document is not a loan application.
`;

export const NON_PROCESSABLE_FOR_CLASSIFICATION_CATEGORIES = [DocumentCategory.OTHERS, DocumentCategory.ERROR, DocumentCategory.PROCESSING];
// Categories that are not suitable for data extraction step
export const NON_PROCESSABLE_FOR_DATA_EXTRACTION_CATEGORIES = [DocumentCategory.OTHERS, DocumentCategory.ERROR, DocumentCategory.PROCESSING];


// --- Field Definitions for Tables ---
export const LOAN_APPLICATION_COLUMNS: TableColumn<LoanApplicationData>[] = [
  { key: 'applicantName', label: 'Applicant Name'},
  { key: 'loanAmountPesos', label: 'Loan Amount (PHP)'},
  { key: 'loanPeriodMonths', label: 'Period (Months)'},
  { key: 'applicationDate', label: 'Application Date', type: 'date' },
  { key: 'loanPurpose', label: 'Purpose' },
  { key: 'creditCooperativeName', label: 'Cooperative Name' },
  { key: 'creditCooperativeAddress', label: 'Cooperative Address' },
  { key: 'bookNo', label: 'Book No.' },
  { key: 'numberOfInstallments', label: '# Installments'},
  { key: 'semiMonthlyInstallmentsOf1', label: 'Semi-Monthly Installments of'},
  { key: 'semiMonthlyInstallmentsOf2', label: 'Installment 2 (PESOS)'},
  { key: 'semiMonthlyInstallmentsPesos', label: 'Installment 2 (PHP)', type: 'number' },
  { key: 'allDueOn', label: 'All Due On'},
  { key: 'applicantAddress', label: 'Applicant Address' },
  { key: 'makerName', label: 'Maker Name' },
  { key: 'makerUnobligedShares', label: 'Maker Unobliged Shares', type: 'number' },
  { key: 'makerLoans', label: 'Maker Loans' },
  { key: 'makerAsPrincipal', label: 'Maker Principal (PHP)', type: 'number' },
  { key: 'makerAsCoMaker', label: 'Maker Co-Maker (PHP)', type: 'number' },
  { key: 'coMaker1UnobligedShares', label: 'Co-Maker 1 Unobliged Shares', type: 'number' },
  { key: 'coMaker1Loans', label: 'Co-Maker 1 Loans' },
  { key: 'coMaker1AsPrincipal', label: 'Co-Maker 1 Principal (PHP)', type: 'number' },
  { key: 'coMaker1AsCoMaker', label: 'Co-Maker 1 Co-Maker (PHP)', type: 'number' },
  { key: 'coMaker2UnobligedShares', label: 'Co-Maker 2 Unobliged Shares', type: 'number' },
  { key: 'coMaker2Loans', label: 'Co-Maker 2 Loans' },
  { key: 'coMaker2AsPrincipal', label: 'Co-Maker 2 Principal (PHP)', type: 'number' },
  { key: 'coMaker2AsCoMaker', label: 'Co-Maker 2 Co-Maker (PHP)', type: 'number' },
  { key: 'coMakerCertificationDate', label: 'Co-Maker Cert. Date', type: 'date' },
  { key: 'treasurerName', label: 'Treasurer Name' },
  { key: 'meetingHeldDateMonthDay', label: 'Meeting Date (MM/DD)' },
  { key: 'meetingHeldYear', label: 'Meeting Year', type: 'number' },
  { key: 'exceptAsToTheFollowing', label: 'Condition Exceptions'},
  { key: 'minutesRecordedDateMonthDay', label: 'Minutes Date (MM/DD)' },
  { key: 'minutesRecordedYear', label: 'Minutes Year', type: 'number' },
  { key: 'committeeMember1', label: 'Committee Member 1' },
  { key: 'committeeMember2', label: 'Committee Member 2' },
  { key: 'committeeMember3', label: 'Committee Member 3' },
];

export const UNSECURED_LOANS_APPLICATION_COLUMNS: TableColumn<UnsecuredLoansApplicationData>[] = [
  { key: 'applicantPrintedName', label: 'Applicant Name' },
  { key: 'loanAmount', label: 'Loan Amount (PHP)'},
  { key: 'loanPeriodMonths', label: 'Period (Months)'},
  { key: 'applicationDate', label: 'Application Date', type: 'date' },
  { key: 'installmentAmountWords', label: 'Installment (Words)' },
  { key: 'installmentAmountNumeric', label: 'Installment (Numeric)', type: 'number' },
  { key: 'firstInstallmentDue', label: 'First Installment Due'},
  { key: 'purchaseItem', label: 'Purchase Item' },
  { key: 'purchaseAmountWords', label: 'Purchase Amount (Words)' },
  { key: 'purchaseAmountNumeric', label: 'Purchase Amount (Numeric)', type: 'number' },
  { key: 'costItem', label: 'Cost Item' },
  { key: 'addressUnit', label: 'Address Unit' },
  { key: 'payPeriod1', label: 'Pay Period 1' },
  { key: 'payPeriod1NetPayBalance', label: 'PP1 Net Pay Balance', type: 'number' },
  { key: 'payPeriod2', label: 'Pay Period 2' },
  { key: 'payPeriod2NetPayBalance', label: 'PP2 Net Pay Balance', type: 'number' },
  { key: 'semiMonthlyInstallmentAmount', label: 'Semi-Monthly Installment', type: 'number' },
  { key: 'netTakeHomePay', label: 'Net Take Home Pay', type: 'number' },
  { key: 'grossSemiMonthlyPay', label: 'Gross Semi-Monthly Pay', type: 'number' },
  { key: 'netToGrossPercentage', label: 'Net to Gross %', type: 'number' },
  { key: 'payrollPrintedName', label: 'Payroll Name' },
  { key: 'month1', label: 'Month 1' }, { key: 'gross1', label: 'Gross 1', type: 'number' }, { key: 'net1', label: 'Net 1', type: 'number' },
  { key: 'month2', label: 'Month 2' }, { key: 'gross2', label: 'Gross 2', type: 'number' }, { key: 'net2', label: 'Net 2', type: 'number' },
  { key: 'month3', label: 'Month 3' }, { key: 'gross3', label: 'Gross 3', type: 'number' }, { key: 'net3', label: 'Net 3', type: 'number' },
  { key: 'month4', label: 'Month 4' }, { key: 'gross4', label: 'Gross 4', type: 'number' }, { key: 'net4', label: 'Net 4', type: 'number' },
  { key: 'month5', label: 'Month 5' }, { key: 'gross5', label: 'Gross 5', type: 'number' }, { key: 'net5', label: 'Net 5', type: 'number' },
  { key: 'month6', label: 'Month 6' }, { key: 'gross6', label: 'Gross 6', type: 'number' }, { key: 'net6', label: 'Net 6', type: 'number' },
  { key: 'month7', label: 'Month 7' }, { key: 'gross7', label: 'Gross 7', type: 'number' }, { key: 'net7', label: 'Net 7', type: 'number' },
  { key: 'total1', label: 'Total 1', type: 'number' }, { key: 'total2', label: 'Total 2', type: 'number' }, { key: 'average', label: 'Average', type: 'number' },
  { key: 'recommendApproval', label: 'Recommend Approval', type: 'boolean' },
  { key: 'recommendDisapproval', label: 'Recommend Disapproval', type: 'boolean' },
  { key: 'disapprovalReason', label: 'Disapproval Reason' },
  { key: 'managerTreasurerName', label: 'Manager/Treasurer Name' },
  { key: 'managerTreasurerDate', label: 'Manager/Treasurer Date', type: 'date' },
];

export const SPECIAL_LOANS_COLUMNS: TableColumn<SpecialLoansData>[] = [
  { key: 'surname', label: 'Surname' },
  { key: 'firstName', label: 'First Name' },
  { key: 'middleInitial', label: 'MI' },
  { key: 'dateFiled', label: 'Date Filed', type: 'date' },
  { key: 'loanType', label: 'Loan Type' },
  { key: 'loanAmount', label: 'Loan Amount (PHP)'},
  { key: 'memberSchool', label: 'Member School/Unit' },
  { key: 'dateOfEmployment', label: 'Date of Employment', type: 'date' },
  { key: 'numberOfYearsOfService', label: 'Years of Service', type: 'number' },
  { key: 'certifiedEmployeeName', label: 'Certified Employee Name' },
  { key: 'certifiedEmployerSchool', label: 'Certified Employer School' },
  { key: 'certifiedServiceDuration', label: 'Certified Service Duration (Yrs)', type: 'number' },
  { key: 'thirteenthMonthAmount', label: '13th Month Amount (PHP)'},
  { key: 'longevityPayAmount', label: 'Longevity Pay (PHP)'},
  { key: 'certifiedPrintedName', label: 'Certifier Name' },
  { key: 'certifiedDesignation', label: 'Certifier Designation' },
  { key: 'recommendApproval', label: 'Recommend Approval', type: 'boolean' },
  { key: 'recommendDisapproval', label: 'Recommend Disapproval', type: 'boolean' },
  { key: 'disapprovalReason', label: 'Disapproval Reason' },
  { key: 'managerApproved', label: 'Manager Approved', type: 'boolean' },
  { key: 'managerDisapproved', label: 'Manager Disapproved', type: 'boolean' },
  { key: 'managerTreasurerName', label: 'Manager/Treasurer Name' },
  { key: 'managerTreasurerDate', label: 'Manager/Treasurer Date', type: 'date' },
];

export const COLUMN_DEFINITIONS: Record<DocumentCategory, TableColumn<never>[]> = {
    [DocumentCategory.LOAN_APPLICATION]: LOAN_APPLICATION_COLUMNS,
    [DocumentCategory.UNSECURED_LOANS_APPLICATION]: UNSECURED_LOANS_APPLICATION_COLUMNS,
    [DocumentCategory.SPECIAL_LOANS]: SPECIAL_LOANS_COLUMNS,
    [DocumentCategory.OTHERS]: [],
    [DocumentCategory.PROCESSING]: [],
    [DocumentCategory.ERROR]: [],
};


// --- Gemini Prompt Templates for Data Extraction ---
const SHARED_EXTRACTION_INSTRUCTIONS = `
You are an expert OCR and data extraction tool. Analyze the provided document image.
Extract the data according to the JSON schema provided below and return ONLY the JSON object.
If a field is not found, is blank, or not applicable, use null for its value. Do not make up data.
For date fields, if a clear date is present, provide it in "YYYY-MM-DD" format if possible. If the format is ambiguous or partial (e.g., only month/day), return it as extracted. If no date, use null.
For number fields, provide a numeric value or null. Remove currency symbols or commas before converting to a number.
For boolean fields, use true or false based on whether a corresponding checkbox is marked or text indicates affirmation/negation. If unclear, use null.
Ignore all signatures.
Do not add any explanatory text, greetings, or markdown formatting like \`\`\`json around the JSON object.
The document category is:
`;

const LOAN_APPLICATION_SCHEMA = `{
  "creditCooperativeName": "string | null",
  "creditCooperativeAddress": "string | null",
  "bookNo": "string | null",
  "loanAmountPesos": "string | null",
  "loanPeriodMonths": "string | null",
  "numberOfInstallments": "string | null",
  "semiMonthlyInstallmentsOf1": "string | null",
  "semiMonthlyInstallmentsOf2": "string | null",
  "semiMonthlyInstallmentsPesos": "string | null", // The one inside (P___)
  "allDueOn": "string | null",
  "loanPurpose": "string | null",
  "applicationDate": "string | null",
  "applicantName": "string | null",
  "applicantAddress": "string | null",
  "makerName": "string | null",
  "makerUnobligedShares": "number | null",
  "makerLoans": "string | null", // In the first row, next to makerUnobligedShares
  "makerAsPrincipal": "string | null", // In the first row, next to makerLoans
  "makerAsCoMaker": "string | null", // In the first row, next to makerAsPrincipal
  "coMaker1UnobligedShares": "number | null",
  "coMaker1Loans": "string | null",
  "coMaker1AsPrincipal": "number | null",
  "coMaker1AsCoMaker": "number | null",
  "coMaker2UnobligedShares": "number | null",
  "coMaker2Loans": "string | null",
  "coMaker2AsPrincipal": "number | null",
  "coMaker2AsCoMaker": "number | null",
  "coMakerCertificationDate": "string | null",
  "treasurerName": "string | null",
  "meetingHeldDateMonthDay": "string | null",
  "meetingHeldYear": "number | null",
  "exceptAsToTheFollowing": "string | null",
  "minutesRecordedDateMonthDay": "string | null",
  "minutesRecordedYear": "number | null",
  "committeeMember1": "string | null",
  "committeeMember2": "string | null",
  "committeeMember3": "string | null"
}`;

const UNSECURED_LOANS_APPLICATION_SCHEMA = `{
  "loanAmount": "string | null",
  "loanPeriodMonths": "string | null",
  "installmentAmountWords": "string | null",
  "installmentAmountNumeric": "number | null",
  "firstInstallmentDueDate": "string | null",
  "purchaseItem": "string | null",
  "purchaseAmountWords": "string | null",
  "purchaseAmountNumeric": "number | null",
  "costItem": "string | null",
  "applicationDate": "string | null",
  "applicantPrintedName": "string | null",
  "addressUnit": "string | null",
  "payPeriod1": "string | null",
  "payPeriod1NetPayBalance": "string | null",
  "payPeriod2": "string | null",
  "payPeriod2NetPayBalance": "string | null",
  "semiMonthlyInstallmentAmount": "string | null",
  "netTakeHomePay": "number | null",
  "grossSemiMonthlyPay": "number | null",
  "netToGrossPercentage": "number | null",
  "payrollPrintedName": "string | null",
  "month1": "string | null", "gross1": "number | null", "net1": "number | null",
  "month2": "string | null", "gross2": "number | null", "net2": "number | null",
  "month3": "string | null", "gross3": "number | null", "net3": "number | null",
  "month4": "string | null", "gross4": "number | null", "net4": "number | null",
  "month5": "string | null", "gross5": "number | null", "net5": "number | null",
  "month6": "string | null", "gross6": "number | null", "net6": "number | null",
  "month7": "string | null", "gross7": "number | null", "net7": "number | null",
  "total1": "number | null", "total2": "number | null", "average": "number | null",
  "recommendApproval": "boolean | null",
  "recommendDisapproval": "boolean | null",
  "disapprovalReason": "string | null",
  "managerTreasurerName": "string | null",
  "managerTreasurerDate": "string | null"
}`;

const SPECIAL_LOANS_SCHEMA = `{
  "dateFiled": "string | null",
  "surname": "string | null",
  "firstName": "string | null",
  "middleInitial": "string | null",
  "memberSchool": "string | null",
  "dateOfEmployment": "string | null",
  "numberOfYearsOfService": "number | null",
  "loanType": "string | null",
  "loanAmount": "string | null",
  "certifiedEmployeeName": "string | null",
  "certifiedEmployerSchool": "string | null",
  "certifiedServiceDuration": "number | null",
  "thirteenthMonthAmount": "number | null",
  "longevityPayAmount": "number | null",
  "certifiedPrintedName": "string | null",
  "certifiedDesignation": "string | null",
  "recommendApproval": "boolean | null",
  "recommendDisapproval": "boolean | null",
  "disapprovalReason": "string | null",
  "managerApproved": "boolean | null",
  "managerDisapproved": "boolean | null",
  "managerTreasurerName": "string | null",
  "managerTreasurerDate": "string | null"
}`;

export const DATA_EXTRACTION_PROMPT_TEMPLATES: Record<DocumentCategory, string> = {
  [DocumentCategory.LOAN_APPLICATION]: `${SHARED_EXTRACTION_INSTRUCTIONS} ${DocumentCategory.LOAN_APPLICATION}\nJSON Schema:\n${LOAN_APPLICATION_SCHEMA}`,
  [DocumentCategory.UNSECURED_LOANS_APPLICATION]: `${SHARED_EXTRACTION_INSTRUCTIONS} ${DocumentCategory.UNSECURED_LOANS_APPLICATION}\nJSON Schema:\n${UNSECURED_LOANS_APPLICATION_SCHEMA}`,
  [DocumentCategory.SPECIAL_LOANS]: `${SHARED_EXTRACTION_INSTRUCTIONS} ${DocumentCategory.SPECIAL_LOANS}\nJSON Schema:\n${SPECIAL_LOANS_SCHEMA}`,
  [DocumentCategory.OTHERS]: "", // Not applicable
  [DocumentCategory.PROCESSING]: "", // Not applicable
  [DocumentCategory.ERROR]: "", // Not applicable
};