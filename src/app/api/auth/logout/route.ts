import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Logout endpoint - Clear session/cookies
 */
export async function POST() {
  try {
    // TODO: Replace with actual logout logic
    // Example:
    // 1. Clear session cookie ✅ (implemented below)
    // 2. Invalidate token in database (add when you have real auth)
    // 3. Clear any server-side session data (add when you have sessions)

    const response = NextResponse.json({ message: "Logged out successfully" });

    // Clear the auth_token cookie
    response.cookies.set({
      name: "auth_token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
