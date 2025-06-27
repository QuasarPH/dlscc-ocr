import { NextRequest, NextResponse } from "next/server";
import { 
  getApplicationById, 
  updateApplication, 
  deleteApplication 
} from "@/db";

// GET - Fetch single application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const application = await getApplicationById(id);
    
    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      application 
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch application" 
      },
      { status: 500 }
    );
  }
}

// PUT - Update application
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { formData, processed } = body;

    const updates: { formData?: Record<string, string>; processed?: boolean } = {};
    
    if (formData !== undefined) updates.formData = formData;
    if (processed !== undefined) updates.processed = processed;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No updates provided" },
        { status: 400 }
      );
    }

    await updateApplication(id, updates);

    return NextResponse.json({ 
      success: true,
      message: "Application updated successfully"
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update application" 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteApplication(id);

    return NextResponse.json({ 
      success: true,
      message: "Application deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to delete application" 
      },
      { status: 500 }
    );
  }
}