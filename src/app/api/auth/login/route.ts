import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/login
 * Server-side login endpoint using Supabase
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    if (!data.user) {
      return NextResponse.json(
        { message: "Login failed. Please try again." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "",
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
