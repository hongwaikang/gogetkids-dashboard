// @/app/api/dashboard/test/route.ts:
import { getSchoolNameFromToken } from "@/app/helpers/getSchoolNameFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const schoolName = await getSchoolNameFromToken(request);
    return NextResponse.json({
      message: "School found",
      data: { schoolName },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
