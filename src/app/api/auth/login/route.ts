import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/login
 * Login endpoint - Replace with your actual authentication logic
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // TODO: Replace with actual authentication logic
    // Example: Check credentials against database
    // const user = await db.user.findUnique({ where: { email } });
    // const isValid = await bcrypt.compare(password, user.password);

    // Mock successful response for development
    if (email && password) {
      return NextResponse.json({
        user: {
          id: "1",
          name: "John Doe",
          email: email,
        },
        token: "mock-jwt-token",
      });
    }

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

