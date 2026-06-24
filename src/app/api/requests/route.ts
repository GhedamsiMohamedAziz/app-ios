import { NextResponse } from "next/server";
import { createRequest, listRequests } from "@/lib/store";
import { ValidationError, parseNewRequest } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ data: listRequests(), error: null });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = parseNewRequest(body);
    const request = createRequest(input);
    return NextResponse.json({ data: request, error: null }, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ data: null, error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { data: null, error: "Invalid request body." },
      { status: 400 },
    );
  }
}
