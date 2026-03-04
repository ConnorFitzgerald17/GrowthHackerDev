import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-start justify-center px-4 sm:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#754f17]">404</p>
      <h1 className="mt-2 text-4xl text-[#19140d]">Article not found</h1>
      <p className="mt-3 max-w-xl text-[#4b4338]">
        The post you requested is missing or no longer published.
      </p>
      <Link
        href="/blog"
        className="mt-6 rounded-md border border-[#2d2214] bg-[#1f170f] px-4 py-2 text-sm font-semibold text-[#f9efe3]"
      >
        Back to blog
      </Link>
    </main>
  );
}
