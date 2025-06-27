"use client";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  formData: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export function ApplicationForSpecialLoanForm({ formData, onChange }: Props) {
  return (
    <CardContent className="space-y-6">
      {/* Applicant Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Applicant Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="dateFiled">Date Filed</Label>
            <Input
              id="dateFiled"
              name="dateFiled"
              type="date"
              value={formData.dateFiled || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="surname">Surname</Label>
            <Input
              id="surname"
              name="surname"
              type="text"
              value={formData.surname || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="middleInitial">Middle Initial</Label>
            <Input
              id="middleInitial"
              name="middleInitial"
              type="text"
              value={formData.middleInitial || ""}
              onChange={onChange}
              className="h-8"
              maxLength={1}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="memberSchool">Member School</Label>
            <Input
              id="memberSchool"
              name="memberSchool"
              type="text"
              value={formData.memberSchool || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="dateOfEmployment">Date of Employment</Label>
            <Input
              id="dateOfEmployment"
              name="dateOfEmployment"
              type="date"
              value={formData.dateOfEmployment || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="yearsOfService">Number of Years of Service</Label>
            <Input
              id="yearsOfService"
              name="yearsOfService"
              type="number"
              value={formData.yearsOfService || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Loan Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Loan Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="loanType">Type of Loan</Label>
            <Input
              id="loanType"
              name="loanType"
              type="text"
              value={formData.loanType || ""}
              onChange={onChange}
              className="h-8"
              placeholder="e.g., 13th Month Loan"
            />
          </div>
          <div>
            <Label htmlFor="specialLoanAmount">Amount of Loan (₱)</Label>
            <Input
              id="specialLoanAmount"
              name="specialLoanAmount"
              type="number"
              value={formData.specialLoanAmount || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Signatures</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="coMakerSignature">
              Signature of Co-Maker (for less than 10 yrs)
            </Label>
            <Input
              id="coMakerSignature"
              name="coMakerSignature"
              type="text"
              value={formData.coMakerSignature || ""}
              onChange={onChange}
              className="h-8"
              placeholder="Name of Co-Maker"
            />
          </div>
          <div>
            <Label htmlFor="makerSignature">Signature of Maker</Label>
            <Input
              id="makerSignature"
              name="makerSignature"
              type="text"
              value={formData.makerSignature || ""}
              onChange={onChange}
              className="h-8"
              placeholder="Name of Maker"
            />
          </div>
        </div>
      </div>

      {/* Certification Section */}
      <div className="space-y-4 border-2 border-gray-300 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700">
          Certification (To be accomplished by Accounting Office)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="certifiedEmployeeName">Employee Name</Label>
            <Input
              id="certifiedEmployeeName"
              name="certifiedEmployeeName"
              type="text"
              value={formData.certifiedEmployeeName || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="certifiedSchoolName">School Name</Label>
            <Input
              id="certifiedSchoolName"
              name="certifiedSchoolName"
              type="text"
              value={formData.certifiedSchoolName || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="certifiedYearsOfService">Years of Service</Label>
            <Input
              id="certifiedYearsOfService"
              name="certifiedYearsOfService"
              type="number"
              value={formData.certifiedYearsOfService || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="thirteenthMonthAmount">13th Month Amount (₱)</Label>
            <Input
              id="thirteenthMonthAmount"
              name="thirteenthMonthAmount"
              type="number"
              value={formData.thirteenthMonthAmount || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="longevityPayAmount">Longevity Pay Amount (₱)</Label>
            <Input
              id="longevityPayAmount"
              name="longevityPayAmount"
              type="number"
              value={formData.longevityPayAmount || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="certifierName">
              Certified Correct (Name/Designation)
            </Label>
            <Input
              id="certifierName"
              name="certifierName"
              type="text"
              value={formData.certifierName || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Credit Committee Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Credit Committee
        </h3>
        <div>
          <Label htmlFor="specialDisapprovalReason">
            Disapproval Reason (if applicable)
          </Label>
          <Textarea
            id="specialDisapprovalReason"
            name="specialDisapprovalReason"
            value={formData.specialDisapprovalReason || ""}
            onChange={onChange}
            rows={3}
            placeholder="We recommend disapproval of the loan due to the following reason(s):"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="specialCreditCommittee1">
              Credit Committee Member 1
            </Label>
            <Input
              id="specialCreditCommittee1"
              name="specialCreditCommittee1"
              type="text"
              value={formData.specialCreditCommittee1 || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="specialCreditCommittee2">
              Credit Committee Member 2
            </Label>
            <Input
              id="specialCreditCommittee2"
              name="specialCreditCommittee2"
              type="text"
              value={formData.specialCreditCommittee2 || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Manager Approval */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Manager Approval
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="specialManagerTreasurer">
              DLSCC Manager/Treasurer
            </Label>
            <Input
              id="specialManagerTreasurer"
              name="specialManagerTreasurer"
              type="text"
              value={formData.specialManagerTreasurer || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="specialManagerDate">Date</Label>
            <Input
              id="specialManagerDate"
              name="specialManagerDate"
              type="date"
              value={formData.specialManagerDate || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
        </div>
      </div>
    </CardContent>
  );
}
