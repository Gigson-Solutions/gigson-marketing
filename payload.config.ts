import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
// @ts-ignore — sharp types incompatible with moduleResolution:bundler; safe at runtime
import sharp from 'sharp';
import { OAuth2Plugin } from 'payload-oauth2';

import { ChatbotLeads } from './collections/ChatbotLeads';
import { EstimatorSessions } from './collections/EstimatorSessions';
import { Media } from './collections/Media';
import { Posts } from './collections/Posts';
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      // Botón "Continue with Google" sobre el formulario de login
      beforeLogin: ['@/components/GoogleLoginButton#default'],
    },
  },
  collections: [Posts, Media, Users, ChatbotLeads, EstimatorSessions],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
    },
  }),
  sharp,
  plugins: [
    OAuth2Plugin({
      enabled: true,
      strategyName: 'google',
      useEmailAsIdentity: true,  // usa email como clave de búsqueda (identidad estable)
      serverURL,
      authCollection: 'users',
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      providerAuthorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      scopes: [
        'openid',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      prompt: 'select_account',  // muestra selector de cuenta (útil con múltiples cuentas)
      getUserInfo: async (accessToken: string) => {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) {
          throw new Error(`Google userinfo error: ${res.status}`);
        }
        const data = await res.json() as { sub: string; email: string; name?: string };
        return {
          sub: data.sub,
          email: data.email,
          name: data.name ?? '',
        };
      },
      successRedirect: () => `${serverURL}/admin`,
      failureRedirect: (_req: unknown, err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Login failed';
        return `${serverURL}/admin/login?error=${encodeURIComponent(msg)}`;
      },
    }),
    // Vercel's filesystem is ephemeral/read-only in production, so uploads
    // for the `media` collection are stored in Vercel Blob instead of disk.
    // Requires a Blob store created in the Vercel project + BLOB_READ_WRITE_TOKEN.
    // Only enabled when the token is present — without it, Payload falls back
    // to local disk storage for `media`, so `next dev` still works locally
    // before the Blob store is provisioned in Vercel.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN ?? '',
    }),
  ],
});
