import jsPDF from "jspdf";
import { TEMPLATES } from "./templates";
import { FIELD_POSITIONS } from "./fieldPositions";

export async function generatePdfBlob(
  formType: keyof typeof TEMPLATES,
  formBgDataUrl: string,
  formData: Record<string,string>
): Promise<Blob> {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  doc.addImage(
    formBgDataUrl, "PNG",
    0, 0,
    doc.internal.pageSize.getWidth(),
    doc.internal.pageSize.getHeight()
  );
  doc.setFont("Helvetica", "normal").setFontSize(11);

  TEMPLATES[formType].fields.forEach(f => {
    const pos = FIELD_POSITIONS[f.name];
    if (!pos) return;
    const text = formData[f.name] || "";
    if (f.type === "textarea") {
      const wrapWidth = (f.name === "purpose" || f.name === "approvalExceptions") ? 480 : 180;
      doc.text(doc.splitTextToSize(text, wrapWidth), pos.x, pos.y);
    } else {
      doc.text(text, pos.x, pos.y);
    }
  });

  return doc.output("blob");
}
