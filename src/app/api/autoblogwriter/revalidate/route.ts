import { handleRevalidateWebhook } from "@/lib/revalidate";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  return handleRevalidateWebhook(request);
}
