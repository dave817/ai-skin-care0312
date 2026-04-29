import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createAuthToken, AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from "@/lib/admin-auth";
import { checkLoginLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = await checkLoginLimit(ip);
    if (!limit.success) {
      return NextResponse.json(
        { error: "登入嘗試過多，請 15 分鐘後再試" },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const password = typeof body?.password === "string" ? body.password : "";

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD 未設定，請檢查 .env.local" },
        { status: 500 }
      );
    }

    if (!checkPassword(password)) {
      return NextResponse.json(
        { error: "密碼不正確" },
        { status: 401 }
      );
    }

    const token = await createAuthToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_COOKIE_MAX_AGE,
    });
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
