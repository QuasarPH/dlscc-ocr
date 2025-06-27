import jsPDF from "jspdf";
import { TEMPLATES } from "./templates";
import { FIELD_POSITIONS } from "./fieldPositions";

export async function generatePdfBlob(
  formType: keyof typeof TEMPLATES,
  formBgDataUrl: string,
  formData: Record<string,string>
): Promise<Blob> {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  
  // Map form types to their respective background images
  const backgroundImageMap: Record<keyof typeof TEMPLATES, string> = {
    ApplicationForLoan: "/images/loan_application.png",
    UnsecuredLoansApplication: "/images/unsecured_loan_application.png",
    SpecialLoansApplication: "/images/special_loan_application.png"
  };

  // Load the appropriate background image
  let bgImageUrl = formBgDataUrl; // Default to passed URL
  
  // If formType is not ApplicationForLoan, load the correct background
  if (formType !== "ApplicationForLoan") {
    try {
      const response = await fetch(backgroundImageMap[formType]);
      const blob = await response.blob();
      bgImageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(`Failed to load background for ${formType}:`, error);
    }
  }

  doc.addImage(
    bgImageUrl, "PNG",
    0, 0,
    doc.internal.pageSize.getWidth(),
    doc.internal.pageSize.getHeight()
  );
  
  doc.setFont("Helvetica", "normal").setFontSize(11);

  TEMPLATES[formType].fields.forEach(f => {
    const pos = FIELD_POSITIONS[f.name];
    if (!pos) return;
    const text = formData[f.name] || "";
    
    // Handle different field types and special cases
    if (f.type === "textarea") {
      const wrapWidth = getWrapWidth(f.name);
      doc.text(doc.splitTextToSize(text, wrapWidth), pos.x, pos.y);
    } else if (formType === "UnsecuredLoansApplication" && isMonthlyTableField(f.name)) {
      // Special handling for monthly table fields - smaller font
      doc.setFontSize(9);
      doc.text(text, pos.x, pos.y);
      doc.setFontSize(11);
    } else {
      doc.text(text, pos.x, pos.y);
    }
  });

  return doc.output("blob");
}

function getWrapWidth(fieldName: string): number {
  // Define wrap widths for textarea fields
  const wrapWidths: Record<string, number> = {
    purpose: 480,
    approvalExceptions: 480,
    disapprovalReason: 450,
  };
  
  return wrapWidths[fieldName] || 400; // Default wrap width
}

function isMonthlyTableField(fieldName: string): boolean {
  // Check if field is part of the monthly gross/net table
  return /^month\d+(Gross|Net)?$/.test(fieldName) || 
         fieldName === "totalGross" || 
         fieldName === "totalNet" || 
         fieldName === "average";
}