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
      const token = "mock-jwt-token-" + Date.now(); // Mock token

      const response = NextResponse.json({
        user: {
          id: "1",
          name: "John Doe",
          email: email,
        },
        token: token,
      });

      // Set httpOnly cookie for middleware authentication
      response.cookies.set({
        name: "auth_token",
        value: token,
        httpOnly: true, // Prevents JavaScript access (XSS protection)
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "lax", // CSRF protection
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/", // Available across entire site
      });

      return response;
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

