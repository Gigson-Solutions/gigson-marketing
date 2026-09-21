/**
 * Única fuente de verdad de la identidad de la empresa: la marca comercial, la
 * sociedad que hay detrás y los perfiles de terceros que corroboran ambas.
 *
 * Existe porque la empresa opera con tres nombres — la marca `Gigson
 * Solutions`, la sociedad `Awesomely SL` y el dominio legado
 * `somosgigson.com` — y hasta ahora nada los relacionaba. Los datos legales
 * vivían solo como prosa dentro de `messages/*.json`, así que el JSON-LD no
 * podía declarar `legalName` ni `vatID` y las citas institucionales (que usan
 * el nombre de la sociedad, no el de la marca) no llegaban a esta entidad.
 *
 * Aquí no hay nada localizado: son hechos, no copy. Todo lo que se lee
 * distinto en ES y EN sigue en `messages/*.json` e interpola un valor de aquí.
 *
 * Sin imports a propósito: `app/layout.tsx` necesita el origin y no debe
 * arrastrar `i18n/routing.ts`, que es lo que pasaría importándolo desde
 * `lib/schema.ts`. Ser un módulo hoja también evita ciclos con `schema.ts`.
 */
export const COMPANY = {
  /** Marca comercial: lo que usan la UI, los títulos y `Organization.name`. */
  brandName: 'Gigson Solutions',
  shortName: 'Gigson',

  /** La sociedad titular, inscrita en el Registro Mercantil de Barcelona. */
  legalName: 'Awesomely, Sociedad Limitada',
  legalNameShort: 'Awesomely SL',

  /**
   * `taxId` es el CIF tal cual; `vatID` de schema.org lo quiere con prefijo
   * nacional. No son redundantes: llevan formato distinto y los consume
   * software distinto.
   */
  taxId: 'B22482137',
  vatId: 'ESB22482137',
  /** ISO 6523, donde el ICD 9920 identifica a la AEAT. */
  iso6523: '9920:ESB22482137',
  /** Identificador Único Europeo (BRIS), el que usan los registros mercantiles. */
  euid: 'ES08005.000727022',
  cnae: ['7112', '5829'] as const,

  registry: {
    name: 'Registro Mercantil de Barcelona',
    /**
     * El aviso legal publica hoy "Tomo 1000450453145", que no puede ser
     * correcto (Barcelona usa ~5 dígitos). Hasta sacar el valor real de la
     * nota simple, `notice.pc_2_5` se queda literal sin interpolar y este
     * campo no lo consume nadie.
     */
    volume: 'PENDIENTE-VERIFICAR',
    folio: '1',
    sheet: 'B-635472',
  },

  address: {
    streetAddress: 'C/ Lepant 270',
    postalCode: '08013',
    locality: 'Barcelona',
    region: 'Barcelona',
    country: 'ES',
  },
  /**
   * Forma de una línea, para la prosa legal y el pie. Debe coincidir carácter
   * a carácter con lo que se dé de alta en directorios: el par
   * nombre-dirección-teléfono solo "cuadra" como cita si no varía.
   *
   * Sin país a propósito: es la única parte de una dirección que se traduce
   * ("España" / "Spain"), así que esa palabra se queda en `messages/*.json`
   * y aquí solo va lo que no cambia entre idiomas.
   */
  addressLine: 'C/ Lepant 270, 08013 Barcelona',

  /** Un único formato en todo el sitio y en todas las citas externas. */
  phone: '+34 630 840 225',

  email: {
    /**
     * Dirección pública canónica: todo lo que el sitio *muestra* o publica
     * (schema, FAQ, chatbot, llms.txt) sale de aquí. Llegó a haber seis
     * direcciones en tres dominios, dos de ellas dentro del JSON-LD de la
     * misma entidad (`hola@` en el `Organization` de `/`, `info@` en el
     * `FAQPage` de `/faqs`).
     *
     * No confundir con los destinos de los formularios: a dónde *llegan* los
     * leads es otra cosa y sigue en sus propios env vars, porque FormSubmit
     * exige activar cada dirección antes de entregarle nada.
     */
    general: 'hola@gigsonsolutions.com',
    /**
     * Responsable del tratamiento, ya publicado en la política de privacidad.
     * No se cambia sin cambiar ese compromiso RGPD.
     */
    legal: 'legal@awesomelygroup.com',
  },

  site: {
    origin: 'https://gigsonsolutions.com',
    domain: 'gigsonsolutions.com',
  },

  /**
   * Logo de la entidad. Tiene que ser una ruta de `public/` y no un import de
   * `src/assets/`: esos los sirve el bundler bajo `/_next/static/media/` con
   * un hash que cambia en cada build, así que no valen como URL estable de
   * schema. Las dimensiones se declaran para que Google no tenga que
   * descargar el fichero para saber el ratio.
   */
  logo: {
    path: '/img/gigson-solutions-logo.png',
    width: 437,
    height: 122,
  },

  /**
   * Páginas de terceros que corroboran la entidad. Cada una debe ser absoluta,
   * canónica y rastreable: un `sameAs` que da 404 o que redirige a otra
   * canónica resta en vez de sumar.
   *
   * No incluye `somosgigson.com` — es nuestro propio dominio con un 308 a
   * `/es`, no la referencia de un tercero.
   *
   * Tampoco incluye la ficha de Northdata (`/Awesomely SL, Barcelona/NIF
   * B22482137`): corroboraría la sociedad en un registro, pero devuelve 404 a
   * cualquier cliente HTTP con el que se ha podido probar, así que no es una
   * URL estable que declarar. Los datos registrales ya viajan en `vatID`,
   * `taxID` e `identifier`, que no dependen de que un tercero siga sirviendo
   * la misma ruta.
   *
   * La URL de Holded es la canónica que declara su propia página: el slug
   * `/solution-partners-directory/` redirige a `/directorio-solution-partners/`.
   */
  profiles: [
    'https://www.linkedin.com/company/gigson-solutions',
    'https://theorg.com/org/gigson-solutions',
    'https://clutch.co/profile/gigson-solutions',
    'https://www.holded.com/es/directorio-solution-partners/gigson-solutions',
    'https://www.odoo.com/es_ES/partners/awesomely-s-l-34346319',
  ],
} as const;

/**
 * Valores para interpolar en las cadenas legales de `messages/*.json`.
 *
 * Se pasa la bolsa entera a cada `t()`: ICU ignora en silencio los valores que
 * el mensaje no referencia, así que no hace falta mantener una lista por clave
 * — ni acordarse de ampliarla al añadir un `{placeholder}` nuevo.
 */
export const legalValues = {
  brandName: COMPANY.brandName,
  shortName: COMPANY.shortName,
  legalName: COMPANY.legalName,
  legalNameShort: COMPANY.legalNameShort,
  taxId: COMPANY.taxId,
  vatId: COMPANY.vatId,
  address: COMPANY.addressLine,
  phone: COMPANY.phone,
  legalEmail: COMPANY.email.legal,
  domain: COMPANY.site.domain,
} as const;
