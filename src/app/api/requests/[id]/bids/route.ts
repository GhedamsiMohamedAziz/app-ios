import { NextResponse } from "next/server";
import { createBid, getRequest, listBidsForRequest } from "@/lib/store";
import { rankBids } from "@/lib/ranking";
import { ValidationError, parseNewBid } from "@/lib/validation";

export const dynamic = "force-dynamic";

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  const request = getRequest(params.id);
  if (!request) {
    return NextResponse.json(
      { data: null, error: "Request not found." },
      { status: 404 },
    );
  }
  const ranked = rankBids(listBidsForRequest(params.id), request.buyer);
  return NextResponse.json({ data: ranked, error: null });
}

export async function POST(req: Request, { params }: Params) {
  const request = getRequest(params.id);
  if (!request) {
    return NextResponse.json(
      { data: null, error: "Request not found." },
      { status: 404 },
    );
  }
  if (request.status !== "open") {
    return NextResponse.json(
      { data: null, error: "This request is no longer accepting bids." },
      { status: 409 },
    );
  }
  try {
    const body = await req.json();
    const input = parseNewBid(body);
    const bid = createBid(params.id, input);
    return NextResponse.json({ data: bid, error: null }, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ data: null, error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { data: null, error: "Invalid bid body." },
      { status: 400 },
    );
  }
}
