import { NextRequest, NextResponse } from "next/server";
import { 
  getApplications, 
  getApplicationCounts,
  type ApplicationFilter,
  type ApplicationType 
} from "@/db";

// GET - Fetch applications with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filter: ApplicationFilter = {};

    // Parse application type filter
    const appType = searchParams.get('type');
    if (appType && appType !== 'ALL') {
      const validTypes: ApplicationType[] = ['ApplicationForLoan', 'UnsecuredLoansApplication', 'SpecialLoansApplication'];
      if (validTypes.includes(appType as ApplicationType)) {
        filter.applicationType = appType as ApplicationType;
      }
    }

    // Parse processed filter
    const processedParam = searchParams.get('processed');
    if (processedParam && processedParam !== 'ALL') {
      filter.processed = processedParam === 'true';
    }

    // Parse pagination
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    
    if (limit) filter.limit = parseInt(limit);
    if (offset) filter.offset = parseInt(offset);

    const applications = await getApplications(filter);
    const counts = await getApplicationCounts();

    return NextResponse.json({ 
      success: true, 
      applications,
      counts
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch applications" 
      },
      { status: 500 }
    );
  }
}