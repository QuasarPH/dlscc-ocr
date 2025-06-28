"use client";

import { useState, useEffect } from "react";
import { TEMPLATES } from "@/utils/templates";
import { generatePdfBlob } from "@/utils/pdf";
import { FormSelector } from "@/components/FormSelector";
import { FormRenderer } from "@/components/FormRenderer";
import { PdfViewer } from "@/components/PdfViewer";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Topbar } from "@/components/index/Topbar";

export default function FormsPage() {
  const [formType, setFormType] =
    useState<keyof typeof TEMPLATES>("ApplicationForLoan");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [pdfUrl, setPdfUrl] = useState("");
  const [formBgs, setFormBgs] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load all form backgrounds
  useEffect(() => {
    const loadBackgrounds = async () => {
      const backgrounds: Record<string, string> = {};

      const forms = [
        { key: "ApplicationForLoan", path: "/images/loan_application.png" },
        {
          key: "UnsecuredLoansApplication",
          path: "/images/unsecured_loan_application.png",
        },
        {
          key: "SpecialLoansApplication",
          path: "/images/special_loan_application.png",
        },
      ];

      for (const form of forms) {
        try {
          const response = await fetch(form.path);
          const blob = await response.blob();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          backgrounds[form.key] = dataUrl;
        } catch (error) {
          console.error(`Failed to load background for ${form.key}:`, error);
        }
      }

      setFormBgs(backgrounds);
    };

    loadBackgrounds();
  }, []);

  // Clear form data when switching forms
  useEffect(() => {
    setFormData({});
    setPdfUrl("");
  }, [formType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGenerate = async () => {
    const formBg = formBgs[formType];
    if (!formBg) {
      alert("Form background not ready. Please wait a moment and try again.");
      return;
    }

    const blob = await generatePdfBlob(formType, formBg, formData);
    setPdfUrl(URL.createObjectURL(blob));
  };

  // Helper function to normalize form data before submission
  const normalizeFormDataForSubmission = (
    data: Record<string, string>
  ): Record<string, string> => {
    const normalized: Record<string, string> = {};

    // Get all possible fields for the current form type
    const template = TEMPLATES[formType];
    const allFieldNames = template.fields.map((field) => field.name);

    // Initialize all fields
    allFieldNames.forEach((fieldName) => {
      const value = data[fieldName];
      // Convert empty strings to "N/A", but keep actual values
      normalized[fieldName] =
        value && value.trim() !== "" ? value.trim() : "N/A";
    });

    return normalized;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Normalize the form data before submission
      const normalizedFormData = normalizeFormDataForSubmission(formData);

      const res = await fetch("/api/submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType,
          formData: normalizedFormData,
        }),
      });

      const body = await res.json();

      if (body.success) {
        alert(
          `Application submitted successfully! Application ID: ${body.applicationId}`
        );
        // Clear form data after successful submission
        setFormData({});
        setPdfUrl("");
      } else {
        console.error(body.error);
        alert(`Submission failed: ${body.error}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-3 space-y-6">
            <FormSelector
              options={
                Object.fromEntries(
                  Object.entries(TEMPLATES).map(([k, v]) => [k, v.title])
                ) as Record<keyof typeof TEMPLATES, string>
              }
              value={formType}
              onChange={setFormType}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {TEMPLATES[formType].title}
                </CardTitle>
              </CardHeader>
              <FormRenderer
                formType={formType}
                formData={formData}
                onChange={handleChange}
              />
            </Card>

            {/* Responsive button container */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleGenerate} className="w-full sm:w-auto">
                Generate PDF
              </Button>
              <Button
                onClick={handleSubmit}
                variant="secondary"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>

          {/* Right Column: PDF Viewer */}
          <div className="lg:col-span-2">
            <div className="hidden lg:block sticky top-24">
              {pdfUrl ? (
                <PdfViewer url={pdfUrl} />
              ) : (
                <div className="flex h-[70vh] max-h-[800px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50">
                  <p className="text-center text-gray-500 font-medium">
                    PDF preview will appear here.
                  </p>
                </div>
              )}
            </div>

            <div className="block lg:hidden mt-8">
              {pdfUrl && <PdfViewer url={pdfUrl} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
