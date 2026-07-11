import type { CollectionConfig } from 'payload';

const ALLOWED_DOMAIN = '@somosgigson.com';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,            // Habilita API keys por usuario (para acceso de Claude vía REST)
    disableLocalStrategy: true, // Solo Google SSO — sin email/contraseña
    tokenExpiration: 7200,      // 2h, alineado con la sesión de Google
  },
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
