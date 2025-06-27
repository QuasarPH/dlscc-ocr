import { NextResponse } from "next/server";
import { submitApplication, type ApplicationType } from "@/db";

export async function POST(request: Request) {
  try {
    const { formType, formData } = await request.json();

    // Validate input
    if (!formType || !formData) {
      return NextResponse.json(
        { success: false, error: "Form type and form data are required" },
        { status: 400 }
      );
    }

    // Validate form type
    const validTypes: ApplicationType[] = [
      'ApplicationForLoan',
      'UnsecuredLoansApplication', 
      'SpecialLoansApplication'
    ];

    if (!validTypes.includes(formType)) {
      return NextResponse.json(
        { success: false, error: "Invalid form type" },
        { status: 400 }
      );
    }

    // Submit application to database
    const applicationId = await submitApplication(formType, formData);

    return NextResponse.json({ 
      success: true, 
      applicationId,
      message: "Application submitted successfully"
    });
  } catch (error: unknown) {
    console.error("Application submission error:", error);

    const errorMessage = error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Unknown error occurred";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}