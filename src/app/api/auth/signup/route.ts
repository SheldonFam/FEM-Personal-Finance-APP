import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/signup
 * Sign up endpoint - Replace with your actual user creation logic
 */
export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // TODO: Replace with actual user creation logic
    // Example:
    // 1. Check if user already exists
    // const existingUser = await db.user.findUnique({ where: { email } });
    // if (existingUser) return error
    //
    // 2. Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);
    //
    // 3. Create user
    // const user = await db.user.create({ data: { name, email, password: hashedPassword } });
    //
    // 4. Generate JWT token
    // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    // Mock successful response for development
    if (name && email && password) {
      return NextResponse.json({
        user: {
          id: "1",
          name: name,
          email: email,
        },
        token: "mock-jwt-token",
      });
    }

    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
