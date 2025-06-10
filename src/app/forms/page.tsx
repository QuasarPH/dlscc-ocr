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
  const [formBg, setFormBg] = useState("");

  // load background once
  useEffect(() => {
    fetch("/images/loan_application.png")
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise<string>((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result as string);
            r.onerror = rej;
            r.readAsDataURL(blob);
          })
      )
      .then(setFormBg)
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGenerate = async () => {
    if (!formBg) return alert("Background not ready");
    const blob = await generatePdfBlob(formType, formBg, formData);
    setPdfUrl(URL.createObjectURL(blob));
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formType, formData }),
    });
    const body = await res.json();
    if (body.success) {
      alert("Submitted to Google Sheet!");
    } else {
      console.error(body.message);
      alert("Submission failed. See console.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      {/* 
        Main content wrapper.
        - `max-w-7xl`: Sets a max-width for large screens.
        - `mx-auto`: Centers the content.
        - `px-4 sm:px-6 lg:px-8`: Responsive horizontal padding.
        - `py-8 lg:py-12`: Vertical padding.
      */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/*
          Grid container for the layout.
          - `grid-cols-1`: A single column layout on mobile (default).
          - `lg:grid-cols-5`: On large screens, it becomes a 5-column grid for more flexible distribution.
          - `gap-8`: Sets the space between grid items.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Form Controls (spans 3 of 5 columns on large screens) */}
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
              >
                Submit to Sheet
              </Button>
            </div>
          </div>

          {/* Right Column: PDF Viewer (spans 2 of 5 columns on large screens) */}
          <div className="lg:col-span-2">
            {/* 
              This container is STICKY on large screens, so it stays in view on scroll.
              It is HIDDEN on mobile, as the mobile viewer is rendered below.
              `top-24` provides space for the Topbar.
            */}
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

            {/* 
              This is the PDF viewer for MOBILE screens only.
              It's a normal block element shown only if a pdfUrl exists.
              `lg:hidden` ensures it disappears when the sticky version appears.
            */}
            <div className="block lg:hidden mt-8">
              {pdfUrl && <PdfViewer url={pdfUrl} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
