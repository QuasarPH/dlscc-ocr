// Data structure for Loan Application
declare interface LoanApplicationData {
  creditCooperativeName: string | null;
  creditCooperativeAddress: string | null;
  bookNo: string | null;
  loanAmountPesos: number | null;
  loanPeriodMonths: number | null;
  numberOfInstallments: number | null;
  installmentAmount1: number | null;
  installmentAmount2: number | null;
  installmentAmountPesos: number | null;
  firstPaymentDueDate: string | null; // Dates as string initially, format later
  loanPurpose: string | null;
  applicationDate: string | null;
  applicantName: string | null;
  applicantAddress: string | null;
  makerName: string | null;
  makerUnobligedShares: number | null;
  makerLoans: string | null;
  makerPrincipalLoanAmount: number | null;
  makerCoMakerLoanAmount: number | null;
  coMaker1UnobligedShares: number | null;
  coMaker1Loans: string | null;
  coMaker1PrincipalLoanAmount: number | null;
  coMaker1CoMakerLoanAmount: number | null;
  coMaker2UnobligedShares: number | null;
  coMaker2Loans: string | null;
  coMaker2PrincipalLoanAmount: number | null;
  coMaker2CoMakerLoanAmount: number | null;
  coMakerCertificationDate: string | null;
  treasurerName: string | null;
  meetingHeldDateMonthDay: string | null;
  meetingHeldYear: number | null;
  minutesRecordedDateMonthDay: string | null;
  minutesRecordedYear: number | null;
  committeeMember1: string | null;
  committeeMember2: string | null;
  committeeMember3: string | null;
  [key: string]: never; // For dynamic access
}

// Data structure for Unsecured Loans Application
declare interface UnsecuredLoansApplicationData {
  loanAmount: number | null;
  loanPeriodMonths: number | null;
  installmentAmountWords: string | null;
  installmentAmountNumeric: number | null;
  firstInstallmentDueDate: string | null;
  purchaseItem: string | null;
  purchaseAmountWords: string | null;
  purchaseAmountNumeric: number | null;
  costItem: string | null;
  applicationDate: string | null;
  applicantPrintedName: string | null;
  addressUnit: string | null;
  payPeriod1: string | null;
  payPeriod1NetPayBalance: number | null;
  payPeriod2: string | null;
  payPeriod2NetPayBalance: number | null;
  semiMonthlyInstallmentAmount: number | null;
  netTakeHomePay: number | null;
  grossSemiMonthlyPay: number | null;
  netToGrossPercentage: number | null;
  payrollPrintedName: string | null;
  month1: string | null;
  month2: string | null;
  month3: string | null;
  month4: string | null;
  month5: string | null;
  month6: string | null;
  month7: string | null;
  gross1: number | null;
  gross2: number | null;
  gross3: number | null;
  gross4: number | null;
  gross5: number | null;
  gross6: number | null;
  gross7: number | null;
  net1: number | null;
  net2: number | null;
  net3: number | null;
  net4: number | null;
  net5: number | null;
  net6: number | null;
  net7: number | null;
  total1: number | null;
  total2: number | null;
  average: number | null;
  recommendApproval: boolean | null;
  recommendDisapproval: boolean | null;
  disapprovalReason: string | null;
  managerTreasurerName: string | null;
  managerTreasurerDate: string | null;
  [key: string]: never; // For dynamic access
}

// Data structure for Special Loans
declare interface SpecialLoansData {
  dateFiled: string | null;
  surname: string | null;
  firstName: string | null;
  middleInitial: string | null;
  memberSchool: string | null;
  dateOfEmployment: string | null;
  numberOfYearsOfService: number | null;
  loanType: string | null;
  loanAmount: number | null;
  certifiedEmployeeName: string | null;
  certifiedEmployerSchool: string | null;
  certifiedServiceDuration: number | null;
  thirteenthMonthAmount: number | null;
  longevityPayAmount: number | null;
  certifiedPrintedName: string | null;
  certifiedDesignation: string | null;
  recommendApproval: boolean | null;
  recommendDisapproval: boolean | null;
  disapprovalReason: string | null;
  managerApproved: boolean | null;
  managerDisapproved: boolean | null;
  managerTreasurerName: string | null;
  managerTreasurerDate: string | null;
  [key: string]: never; // For dynamic access
}

declare type ExtractedData = LoanApplicationData | UnsecuredLoansApplicationData | SpecialLoansData;

declare interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string | null;
  category: DocumentCategory;
  error?: string; 
  originalMimeType: string; 
  processedMimeType?: string;
  
  isDataExtracting?: boolean;
  isDataExtracted?: boolean;
  extractedData?: ExtractedData | null;
  dataExtractionError?: string;
}

declare interface TableColumn<T extends ExtractedData> {
  key: keyof T;
  label: string;
  type?: 'string' | 'number' | 'date' | 'boolean'; // Optional type for formatting
}

declare module 'pdfjs-dist/build/pdf.mjs' {
  export * from 'pdfjs-dist';
}

declare interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string | null;
  category: DocumentCategory;
  originalMimeType: string;
  processedMimeType: string | null;
  error?: string;
  isDataExtracting?: boolean;
  isDataExtracted?: boolean;
  dataExtractionError?: string;
  extractedData?: ExtractedData;
}