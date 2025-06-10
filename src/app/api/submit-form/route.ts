// src/app/api/submit-form/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { TEMPLATES } from "@/utils/templates";

export async function POST(request: Request) {
  try {
    const { formType, formData } = (await request.json()) as {
      formType: keyof typeof TEMPLATES;
      formData: Record<string, string>;
    };

    // 1) Auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env
          .GOOGLE_PRIVATE_KEY!
          .replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
    const sheetName = "Sheet1";

    // 2) Build header + data row in template order
    const template = TEMPLATES[formType];
    if (!template) {
      return NextResponse.json(
        { success: false, error: "Unknown form type" },
        { status: 400 }
      );
    }
    const fieldNames = template.fields.map((f) => f.name);
    const headerRow = ["Timestamp", "FormType", ...fieldNames];
    const dataRow = [
      new Date().toISOString(),
      formType,
      ...fieldNames.map((n) => formData[n] ?? ""),
    ];

    // 3) Check/write header if missing or incomplete
    const headerCheck = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!1:1`,
    });
    const existingHeader = headerCheck.data.values?.[0] || [];
    if (existingHeader.length < headerRow.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!1:1`,
        valueInputOption: "RAW",
        requestBody: { values: [headerRow] },
      });
    }

    // 4) Append the new row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: "RAW",
      requestBody: { values: [dataRow] },
    });

    return NextResponse.json({ success: true });
  }catch (e: unknown) {
    console.error("Sheets append error:", e);

    const errorMessage = e instanceof Error
      ? e.message
      : typeof e === "string"
      ? e
      : JSON.stringify(e);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
