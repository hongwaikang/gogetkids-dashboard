import { NextResponse } from "next/server";
import Session from "@/app/models/sessionModel";  // Import Session model

export async function GET() {
  try {
    // Delete session document from 'sessions' collection
    await Session.deleteOne({ sessionName: 'currentSession' });

    // Clear token cookie
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    // Redirect to '/login'
    return NextResponse.redirect("/login");

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
