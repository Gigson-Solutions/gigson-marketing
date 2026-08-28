import type { CollectionConfig } from 'payload';

const ALLOWED_DOMAIN = '@somosgigson.com';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,            // Habilita API keys por usuario (para acceso de Claude vía REST)
    disableLocalStrategy: true, // Solo Google SSO — sin email/contraseña
    tokenExpiration: 7200,      // 2h, alineado con la sesión de Google
  },
  // The auth collection is *always* also the target of `payload-locked-documents`'
  // `user` relationship (who currently holds a lock). Leaving `lockDocuments` at its
  // default (true) here additionally lists `users` in that same collection's
  // polymorphic `document.relationTo` — both relationships then collide on the same
  // `users_id` join-table column, producing a malformed (parameter-count-mismatched)
  // SQL query the moment Payload tries to check locks after login. Confirmed by
  // reading `node_modules/payload/dist/locked-documents/config.js`: this broke every
  // admin login on staging with a raw Postgres query error post-auth.
  lockDocuments: false,
  admin: {
    useAsTitle: 'email',
  },
  hooks: {
    beforeLogin: [
      ({ user }) => {
        // Domain allowlist — se ejecuta server-side antes de emitir el JWT
        if (!user.email?.endsWith(ALLOWED_DOMAIN)) {
          throw new Error(`Acceso denegado: solo cuentas ${ALLOWED_DOMAIN} pueden iniciar sesión.`);
        }
        return user;
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    // Nota: el campo `sub` (Google user ID) lo añade automáticamente el plugin payload-oauth2.
  ],
};
