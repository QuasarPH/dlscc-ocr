import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { DocumentCategory, ExtractedData } from '../types';
import { 
    GEMINI_API_KEY, 
    GEMINI_MODEL_NAME, 
    CATEGORY_KEYWORDS_PROMPT_PART, 
    API_KEY_ERROR_MESSAGE,
    DATA_EXTRACTION_PROMPT_TEMPLATES
} from '../constants';

if (!GEMINI_API_KEY) {
  console.error(API_KEY_ERROR_MESSAGE);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || "MISSING_API_KEY" });

export const classifyDocument = async (
  base64ImageData: string,
  mimeType: string
): Promise<DocumentCategory> => {
  if (!GEMINI_API_KEY) {
    console.error(API_KEY_ERROR_MESSAGE);
    return DocumentCategory.ERROR;
  }

  const imagePart: Part = {
    inlineData: {
      mimeType: mimeType,
      data: base64ImageData,
    },
  };

  const textPart: Part = {
    text: `Analyze the provided document image. Based on text visible, particularly near the top, classify this document into one of the following categories: ${CATEGORY_KEYWORDS_PROMPT_PART} Respond with *only* the category name string (e.g., "Loan Application", "Unsecured Loans Application", "Special Loans", or "Others"). Do not add any other explanatory text.`,
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: { parts: [imagePart, textPart] },
    });
    
    const classificationText = response.text.trim();
    const validCategories = Object.values(DocumentCategory) as string[];
    if (validCategories.includes(classificationText)) {
      return classificationText as DocumentCategory;
    } else {
      console.warn(`Gemini returned an unrecognized category: "${classificationText}". Defaulting to Others.`);
      return DocumentCategory.OTHERS;
    }
  } catch (error) {
    console.error("Error classifying document with Gemini:", error);
    return DocumentCategory.ERROR;
  }
};

export const extractDataFromDocument = async (
  base64ImageData: string,
  mimeType: string,
  category: DocumentCategory
): Promise<ExtractedData | null> => {
  if (!GEMINI_API_KEY) {
    console.error(API_KEY_ERROR_MESSAGE);
    return null;
  }

  const promptTemplate = DATA_EXTRACTION_PROMPT_TEMPLATES[category];
  if (!promptTemplate) {
    console.error(`No data extraction prompt template for category: ${category}`);
    return null;
  }

  const imagePart: Part = {
    inlineData: {
      mimeType: mimeType,
      data: base64ImageData,
    },
  };

  const textPart: Part = { text: promptTemplate };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        // Consider adjusting temperature for structured data extraction if needed
        // temperature: 0.2 
      },
    });

    let jsonStr = response.text.trim();
    
    // Remove markdown fences if present
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr);
      // Basic validation: check if it's an object
      if (typeof parsedData === 'object' && parsedData !== null) {
        return parsedData as ExtractedData;
      } else {
        console.error("Parsed JSON is not an object:", parsedData);
        return null;
      }
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", e, "\nRaw response:", jsonStr);
      return null;
    }
  } catch (error) {
    console.error(`Error extracting data for category ${category} with Gemini:`, error);
    // if (error instanceof GoogleGenAIError) { // or relevant error type from SDK
    //   console.error("Gemini API Error details:", error.message);
    // }
    return null;
  }
};
