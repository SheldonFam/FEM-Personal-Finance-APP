import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/signup
 * Server-side signup endpoint using Supabase
 */
export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json(
        { message: "Sign up failed. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        name: name,
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
