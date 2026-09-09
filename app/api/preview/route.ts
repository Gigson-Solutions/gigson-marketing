import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Payload "Preview" button target (see `admin.preview` in `collections/Posts.ts`).
 * Enables Next.js Draft Mode and redirects to the real blog post page, which
 * makes `lib/posts.ts` bypass the `status: published` filter for the current
 * request only — lets an editor see an unpublished draft rendered with the
 * real design (images, CTA/highlight blocks), without publishing anything.
 */
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');

  if (!process.env.PAYLOAD_PREVIEW_SECRET || secret !== process.env.PAYLOAD_PREVIEW_SECRET) {
    return NextResponse.json({ message: 'Invalid preview secret' }, { status: 401 });
  }

  if (!path || !path.startsWith('/')) {
    return NextResponse.json({ message: 'Missing or invalid path' }, { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(path);
}
