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

export function ApplicationForUnsecuredLoanForm({ formData, onChange }: Props) {
  return (
    <CardContent className="space-y-6">
      {/* Loan Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Loan Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="loanAmount">Loan Amount (₱)</Label>
            <Input
              id="loanAmount"
              name="loanAmount"
              type="number"
              value={formData.loanAmount || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="loanPeriodMonths">Loan Period (months)</Label>
            <Input
              id="loanPeriodMonths"
              name="loanPeriodMonths"
              type="number"
              value={formData.loanPeriodMonths || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="installmentAmountWords">
              Installment Amount (In Words)
            </Label>
            <Input
              id="installmentAmountWords"
              name="installmentAmountWords"
              type="text"
              value={formData.installmentAmountWords || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="installmentAmountNumeric">
              Installment Amount (₱)
            </Label>
            <Input
              id="installmentAmountNumeric"
              name="installmentAmountNumeric"
              type="number"
              value={formData.installmentAmountNumeric || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="firstInstallmentDue">
              First Installment Due Date
            </Label>
            <Input
              id="firstInstallmentDue"
              name="firstInstallmentDue"
              type="date"
              value={formData.firstInstallmentDue || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Purchase Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Purchase Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="purchaseItem">Purchase Item</Label>
            <Input
              id="purchaseItem"
              name="purchaseItem"
              type="text"
              value={formData.purchaseItem || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="purchaseAmountWords">
              Purchase Amount (In Words)
            </Label>
            <Input
              id="purchaseAmountWords"
              name="purchaseAmountWords"
              type="text"
              value={formData.purchaseAmountWords || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="purchaseAmountNumeric">Purchase Amount (₱)</Label>
            <Input
              id="purchaseAmountNumeric"
              name="purchaseAmountNumeric"
              type="number"
              value={formData.purchaseAmountNumeric || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="costItem">Cost Item</Label>
            <Input
              id="costItem"
              name="costItem"
              type="text"
              value={formData.costItem || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Applicant Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Applicant Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="applicationDate">Date</Label>
            <Input
              id="applicationDate"
              name="applicationDate"
              type="date"
              value={formData.applicationDate || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="applicantName">Name in Print & Signature</Label>
            <Input
              id="applicantName"
              name="applicantName"
              type="text"
              value={formData.applicantName || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="applicantAddressUnit">Address (Unit)</Label>
            <Input
              id="applicantAddressUnit"
              name="applicantAddressUnit"
              type="text"
              value={formData.applicantAddressUnit || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Payroll Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Payroll Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="payPeriod1">Pay Period 1</Label>
            <Input
              id="payPeriod1"
              name="payPeriod1"
              type="text"
              value={formData.payPeriod1 || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="payPeriod1Balance">
              Pay Period 1 Net Pay Balance (₱)
            </Label>
            <Input
              id="payPeriod1Balance"
              name="payPeriod1Balance"
              type="number"
              value={formData.payPeriod1Balance || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="payPeriod2">Pay Period 2</Label>
            <Input
              id="payPeriod2"
              name="payPeriod2"
              type="text"
              value={formData.payPeriod2 || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="payPeriod2Balance">
              Pay Period 2 Net Pay Balance (₱)
            </Label>
            <Input
              id="payPeriod2Balance"
              name="payPeriod2Balance"
              type="number"
              value={formData.payPeriod2Balance || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="semiMonthlyInstallment">
              Semi-Monthly Installment (₱)
            </Label>
            <Input
              id="semiMonthlyInstallment"
              name="semiMonthlyInstallment"
              type="number"
              value={formData.semiMonthlyInstallment || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="netTakeHomePay">Net-Take Home Pay (₱)</Label>
            <Input
              id="netTakeHomePay"
              name="netTakeHomePay"
              type="number"
              value={formData.netTakeHomePay || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="grossSemiMonthlyPay">
              Gross Semi-Monthly Pay (₱)
            </Label>
            <Input
              id="grossSemiMonthlyPay"
              name="grossSemiMonthlyPay"
              type="number"
              value={formData.grossSemiMonthlyPay || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="netToGrossPercentage">
              % of Net-Take Home Pay to Gross
            </Label>
            <Input
              id="netToGrossPercentage"
              name="netToGrossPercentage"
              type="number"
              value={formData.netToGrossPercentage || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="payrollPersonnelName">Payroll Personnel Name</Label>
          <Input
            id="payrollPersonnelName"
            name="payrollPersonnelName"
            type="text"
            value={formData.payrollPersonnelName || ""}
            onChange={onChange}
            className="h-8"
          />
        </div>
      </div>

      {/* Monthly Pay Slip Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Pay Slip Average for 3 Months
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1 text-sm">
                  Month
                </th>
                <th className="border border-gray-300 px-2 py-1 text-sm">
                  Gross
                </th>
                <th className="border border-gray-300 px-2 py-1 text-sm">
                  Net
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <tr key={num}>
                  <td className="border border-gray-300 p-1">
                    <Input
                      name={`month${num}`}
                      type="text"
                      value={formData[`month${num}`] || ""}
                      onChange={onChange}
                      className="h-7 text-sm"
                      placeholder="Month"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <Input
                      name={`month${num}Gross`}
                      type="number"
                      value={formData[`month${num}Gross`] || ""}
                      onChange={onChange}
                      className="h-7 text-sm"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <Input
                      name={`month${num}Net`}
                      type="number"
                      value={formData[`month${num}Net`] || ""}
                      onChange={onChange}
                      className="h-7 text-sm"
                      placeholder="0.00"
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="border border-gray-300 p-1 text-sm">TOTAL</td>
                <td className="border border-gray-300 p-1">
                  <Input
                    name="totalGross"
                    type="number"
                    value={formData.totalGross || ""}
                    onChange={onChange}
                    className="h-7 text-sm font-semibold"
                    placeholder="0.00"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <Input
                    name="totalNet"
                    type="number"
                    value={formData.totalNet || ""}
                    onChange={onChange}
                    className="h-7 text-sm font-semibold"
                    placeholder="0.00"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-1 text-sm" colSpan={2}>
                  Average
                </td>
                <td className="border border-gray-300 p-1">
                  <Input
                    name="average"
                    type="number"
                    value={formData.average || ""}
                    onChange={onChange}
                    className="h-7 text-sm"
                    placeholder="0.00"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Committee Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Credit Committee
        </h3>
        <div>
          <Label htmlFor="disapprovalReason">
            Disapproval Reason (if applicable)
          </Label>
          <Textarea
            id="disapprovalReason"
            name="disapprovalReason"
            value={formData.disapprovalReason || ""}
            onChange={onChange}
            rows={3}
            placeholder="We recommend disapproval of the loan due to the following reason(s):"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="creditCommittee1">Credit Committee Member 1</Label>
            <Input
              id="creditCommittee1"
              name="creditCommittee1"
              type="text"
              value={formData.creditCommittee1 || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="creditCommittee2">Credit Committee Member 2</Label>
            <Input
              id="creditCommittee2"
              name="creditCommittee2"
              type="text"
              value={formData.creditCommittee2 || ""}
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
            <Label htmlFor="managerTreasurer">DLSCC Manager/Treasurer</Label>
            <Input
              id="managerTreasurer"
              name="managerTreasurer"
              type="text"
              value={formData.managerTreasurer || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="managerDate">Date</Label>
            <Input
              id="managerDate"
              name="managerDate"
              type="date"
              value={formData.managerDate || ""}
              onChange={onChange}
              className="h-8"
            />
          </div>
        </div>
      </div>
    </CardContent>
  );
}
