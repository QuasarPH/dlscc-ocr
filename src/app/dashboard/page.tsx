// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Topbar } from "@/components/index/Topbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ApplicationType =
  | "ApplicationForLoan"
  | "UnsecuredLoansApplication"
  | "SpecialLoansApplication";

type Application = {
  id: string;
  applicationType: ApplicationType;
  formData: Record<string, string>;
  processed: boolean;
  dateSubmitted: string;
  createdAt: string;
  updatedAt: string;
};

type ApplicationCounts = {
  total: number;
  processed: number;
  notProcessed: number;
  byType: Record<
    ApplicationType,
    { total: number; processed: number; notProcessed: number }
  >;
};

export default function DashboardPage() {
  const [, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [counts, setCounts] = useState<ApplicationCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [processedFilter, setProcessedFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal state
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (typeFilter !== "ALL") params.append("type", typeFilter);
      if (processedFilter !== "ALL")
        params.append("processed", processedFilter);

      const response = await fetch(`/api/applications?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setApplications(data.applications);

        // Apply search filter on the frontend
        const filtered = searchQuery
          ? data.applications.filter((app: Application) => {
              const applicantName = getApplicantName(app).toLowerCase();
              const appId = app.id.toLowerCase();
              const query = searchQuery.toLowerCase();

              return applicantName.includes(query) || appId.includes(query);
            })
          : data.applications;

        setFilteredApplications(filtered);
        setCounts(data.counts);
      } else {
        setError(data.error || "Failed to fetch applications");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, processedFilter, searchQuery]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const getApplicationTypeLabel = (type: ApplicationType): string => {
    const labels = {
      ApplicationForLoan: "Loan Application",
      UnsecuredLoansApplication: "Unsecured Loans Application",
      SpecialLoansApplication: "Special Loans Application",
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getApplicantName = (application: Application): string => {
    const { formData, applicationType } = application;

    switch (applicationType) {
      case "ApplicationForLoan":
        return formData.applicantSignature || formData.applicantName || "N/A";
      case "UnsecuredLoansApplication":
        return formData.applicantName || formData.applicantPrintedName || "N/A";
      case "SpecialLoansApplication":
        return (
          `${formData.firstName || ""} ${formData.surname || ""}`.trim() ||
          "N/A"
        );
      default:
        return "N/A";
    }
  };

  const handleRowClick = (application: Application) => {
    setSelectedApplication(application);
    setEditFormData(application.formData);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
    setIsEditMode(false);
    setEditFormData({});
  };

  const handleToggleProcessed = async () => {
    if (!selectedApplication) return;

    setIsUpdating(true);
    try {
      const response = await fetch(
        `/api/applications/${selectedApplication.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            processed: !selectedApplication.processed,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchApplications();
        setSelectedApplication((prev) =>
          prev ? { ...prev, processed: !prev.processed } : null
        );
      } else {
        alert(`Failed to update: ${data.error}`);
      }
    } catch (err) {
      alert("Network error occurred");
      console.error("Error updating application:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateFormData = async () => {
    if (!selectedApplication) return;

    setIsUpdating(true);
    try {
      const response = await fetch(
        `/api/applications/${selectedApplication.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formData: editFormData,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchApplications();
        setSelectedApplication((prev) =>
          prev ? { ...prev, formData: editFormData } : null
        );
        setIsEditMode(false);
        alert("Application updated successfully");
      } else {
        alert(`Failed to update: ${data.error}`);
      }
    } catch (err) {
      alert("Network error occurred");
      console.error("Error updating application:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteApplication = async () => {
    if (!selectedApplication) return;

    if (
      !confirm(
        "Are you sure you want to delete this application? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(
        `/api/applications/${selectedApplication.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchApplications();
        handleCloseModal();
        alert("Application deleted successfully");
      } else {
        alert(`Failed to delete: ${data.error}`);
      }
    } catch (err) {
      alert("Network error occurred");
      console.error("Error deleting application:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFormDataChange = (key: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Helper function to get all possible fields for a form type
  const getAllFormFields = (applicationType: ApplicationType): string[] => {
    const fieldSets = {
      ApplicationForLoan: [
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
        "makerName",
        "makerShares",
        "makerLoanNumber",
        "makerLoanPrincipal",
        "makerLoanCoMaker",
        "comaker1Name",
        "comaker1Shares",
        "comaker1LoanNumber",
        "comaker1LoanPrincipal",
        "comaker1LoanCoMaker",
        "comaker2Name",
        "comaker2Shares",
        "comaker2LoanNumber",
        "comaker2LoanPrincipal",
        "comaker2LoanCoMaker",
        "certifyDate",
        "certifyTreasurer",
        "meetingHeldDay",
        "meetingHeldYear",
        "approvalExceptions",
        "minutesDatetime",
        "minutesYear",
        "committeeMember1",
        "committeeMember2",
        "committeeMember3",
      ],
      UnsecuredLoansApplication: [
        "loanAmount",
        "loanPeriodMonths",
        "installmentAmountWords",
        "installmentAmountNumeric",
        "firstInstallmentDue",
        "purchaseItem",
        "purchaseAmountWords",
        "purchaseAmountNumeric",
        "costItem",
        "applicationDate",
        "applicantName",
        "applicantAddressUnit",
        "payPeriod1",
        "payPeriod1Balance",
        "payPeriod2",
        "payPeriod2Balance",
        "semiMonthlyInstallment",
        "netTakeHomePay",
        "grossSemiMonthlyPay",
        "netToGrossPercentage",
        "payrollPersonnelName",
        "month1",
        "month1Gross",
        "month1Net",
        "month2",
        "month2Gross",
        "month2Net",
        "month3",
        "month3Gross",
        "month3Net",
        "month4",
        "month4Gross",
        "month4Net",
        "month5",
        "month5Gross",
        "month5Net",
        "month6",
        "month6Gross",
        "month6Net",
        "month7",
        "month7Gross",
        "month7Net",
        "totalGross",
        "totalNet",
        "average",
        "unsecuredCreditCommitteeDecision",
        "disapprovalReason",
        "creditCommittee1",
        "creditCommittee2",
        "managerTreasurer",
        "managerDate",
      ],
      SpecialLoansApplication: [
        "dateFiled",
        "surname",
        "firstName",
        "middleInitial",
        "memberSchool",
        "dateOfEmployment",
        "yearsOfService",
        "loanType",
        "specialLoanAmount",
        "coMakerSignature",
        "makerSignature",
        "certifiedEmployeeName",
        "certifiedSchoolName",
        "certifiedYearsOfService",
        "thirteenthMonthAmount",
        "longevityPayAmount",
        "certifierName",
        "specialCreditCommitteeDecision",
        "specialDisapprovalReason",
        "specialCreditCommittee1",
        "specialCreditCommittee2",
        "specialManagerTreasurer",
        "specialManagerDate",
      ],
    };

    return fieldSets[applicationType] || [];
  };

  // Get a complete form data object with all fields, filling missing ones with "N/A"
  const getCompleteFormData = (
    application: Application
  ): Record<string, string> => {
    const allFields = getAllFormFields(application.applicationType);
    const completeData: Record<string, string> = {};

    allFields.forEach((field) => {
      completeData[field] = application.formData[field] || "N/A";
    });

    return completeData;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Topbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <p className="text-gray-600 mt-2">{error}</p>
            <Button onClick={fetchApplications} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Applications Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and review submitted loan applications
          </p>
        </div>

        {/* Stats Cards */}
        {counts && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600">
                  {counts.total}
                </div>
                <p className="text-sm text-gray-600">Total Applications</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">
                  {counts.processed}
                </div>
                <p className="text-sm text-gray-600">Processed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-orange-600">
                  {counts.notProcessed}
                </div>
                <p className="text-sm text-gray-600">Not Processed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((counts.processed / counts.total) * 100) || 0}%
                </div>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Bar */}
              <div className="md:col-span-1">
                <Label htmlFor="search">Search by ID or Applicant Name</Label>
                <div className="relative mt-1">
                  <Input
                    id="search"
                    type="text"
                    placeholder="Enter application ID or applicant name..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      title="Clear search"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                {searchQuery && (
                  <p className="text-sm text-gray-600 mt-2">
                    {filteredApplications.length} result(s) found for &quot;
                    {searchQuery}&quot;
                  </p>
                )}
              </div>

              {/* Application Type Filter */}
              <div>
                <Label htmlFor="type-filter">Application Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Forms</SelectItem>
                    <SelectItem value="ApplicationForLoan">
                      Loan Applications
                    </SelectItem>
                    <SelectItem value="UnsecuredLoansApplication">
                      Unsecured Loan Applications
                    </SelectItem>
                    <SelectItem value="SpecialLoansApplication">
                      Special Loan Applications
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Processing Status Filter */}
              <div>
                <Label htmlFor="processed-filter">Processing Status</Label>
                <Select
                  value={processedFilter}
                  onValueChange={setProcessedFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="false">Not Processed</SelectItem>
                    <SelectItem value="true">Processed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  No applications found matching your filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Application Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr
                        key={application.id}
                        onClick={() => handleRowClick(application)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{application.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getApplicantName(application)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getApplicationTypeLabel(application.applicationType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              application.processed
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {application.processed
                              ? "Processed"
                              : "Not Processed"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(application.dateSubmitted)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Detail Modal */}
        {isModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Application Details - #{selectedApplication.id}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="px-6 py-4">
                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="font-semibold text-gray-700">
                      Application Type
                    </Label>
                    <p className="text-sm text-gray-900">
                      {getApplicationTypeLabel(
                        selectedApplication.applicationType
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold text-gray-700">
                      Processing Status
                    </Label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedApplication.processed
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {selectedApplication.processed
                        ? "Processed"
                        : "Not Processed"}
                    </span>
                  </div>
                  <div>
                    <Label className="font-semibold text-gray-700">
                      Date Submitted
                    </Label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedApplication.dateSubmitted)}
                    </p>
                  </div>
                </div>

                {/* Form Data */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-semibold text-gray-900">
                      Form Data
                    </h4>
                    {!isEditMode && (
                      <Button
                        onClick={() => {
                          setIsEditMode(true);
                          // Initialize edit form data with complete field set
                          setEditFormData(
                            getCompleteFormData(selectedApplication)
                          );
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Edit Fields
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {Object.entries(
                      isEditMode
                        ? editFormData
                        : getCompleteFormData(selectedApplication)
                    ).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-sm font-medium text-gray-700 capitalize">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </Label>
                        {isEditMode ? (
                          key.toLowerCase().includes("date") ? (
                            <Input
                              type="date"
                              value={value === "N/A" ? "" : value || ""}
                              onChange={(e) =>
                                handleFormDataChange(key, e.target.value)
                              }
                              className="mt-1"
                            />
                          ) : key.toLowerCase().includes("reason") ||
                            key.toLowerCase().includes("purpose") ? (
                            <Textarea
                              value={value === "N/A" ? "" : value || ""}
                              onChange={(e) =>
                                handleFormDataChange(key, e.target.value)
                              }
                              className="mt-1"
                              rows={3}
                            />
                          ) : (
                            <Input
                              type="text"
                              value={value === "N/A" ? "" : value || ""}
                              onChange={(e) =>
                                handleFormDataChange(key, e.target.value)
                              }
                              className="mt-1"
                            />
                          )
                        ) : (
                          <p
                            className={`text-sm mt-1 p-2 bg-gray-50 rounded ${
                              value === "N/A"
                                ? "text-gray-400 italic"
                                : "text-gray-900"
                            }`}
                          >
                            {value || "N/A"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  {isEditMode ? (
                    <>
                      <Button
                        onClick={handleUpdateFormData}
                        disabled={isUpdating}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditMode(false);
                          setEditFormData(selectedApplication.formData);
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleToggleProcessed}
                        disabled={isUpdating}
                        className={
                          selectedApplication.processed
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "bg-green-600 hover:bg-green-700"
                        }
                      >
                        {isUpdating
                          ? "Updating..."
                          : selectedApplication.processed
                          ? "Mark as Not Processed"
                          : "Mark as Processed"}
                      </Button>
                      <Button
                        onClick={handleDeleteApplication}
                        disabled={isUpdating}
                        variant="destructive"
                      >
                        {isUpdating ? "Deleting..." : "Delete Application"}
                      </Button>
                      <Button onClick={handleCloseModal} variant="outline">
                        Close
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
