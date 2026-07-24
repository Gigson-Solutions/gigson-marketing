import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { postgresAdapter } from '@payloadcms/db-postgres';
// @ts-ignore — sharp types incompatible with moduleResolution:bundler; safe at runtime
import sharp from 'sharp';
import { OAuth2Plugin } from 'payload-oauth2';

import { ChatbotLeads } from './collections/ChatbotLeads';
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
  collections: [Posts, Users, ChatbotLeads],
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
  ],
});
