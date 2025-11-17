import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { key } = body;

  if (key === process.env.ADMIN_KEY) {
    return NextResponse.json({ authorized: true });
  } else {
    return NextResponse.json({ authorized: false }, { status: 401 });
  }
}
