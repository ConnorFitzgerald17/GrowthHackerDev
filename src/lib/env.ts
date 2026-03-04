import { z } from "zod";

const envSchema = z.object({
  AUTOBLOGWRITER_API_KEY: z.string().min(1),
  AUTOBLOGWRITER_WORKSPACE_SLUG: z.string().min(1),
  AUTOBLOGWRITER_REVALIDATE_SECRET: z.string().min(1),
  SITE_URL: z.string().url(),
  AUTOBLOGWRITER_API_URL: z.string().url().optional(),
  AUTOBLOGWRITER_WORKSPACE_ID: z.string().optional(),
  AUTOBLOGWRITER_DEBUG: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(): AppEnv {
  return envSchema.parse(process.env);
}

export function getSiteUrl(): string {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) {
    return "http://localhost:3000";
  }

  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}
