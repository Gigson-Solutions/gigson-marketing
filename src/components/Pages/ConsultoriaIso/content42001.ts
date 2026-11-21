import type { ConsultoriaIsoContent } from './types';

const OPTIONS: [string, string, string] = ['Sí', 'En parte', 'No'];

export const ISO42001: ConsultoriaIsoContent = {
  formId: 'consultoria-iso-42001',
  pill: 'ISO/IEC 42001:2023',
  title: 'Certificación ISO 42001 para demostrar que gobiernas tu IA.',
  subtitle:
    'Clientes, inversores y administraciones ya preguntan cómo usas la inteligencia artificial, y la Ley de IA europea lo convierte en exigencia. Montamos tu sistema de gestión de IA con el criterio de un equipo que construye agentes y es Claude Partner.',
  bullets: [
    'Sabemos cómo funciona la IA por dentro: construimos agentes para clientes.',
    'Integramos la 42001 con tu ISO 27001 en un único sistema.',
    'Coordinamos las auditorías de fase 1 y fase 2 con una entidad acreditada.',
  ],
  audience: [
    'Empresas que usan IA',
    'SaaS y producto con IA',
    'Con o sin ISO 27001',
  ],

  form: {
    title: 'Pide tu diagnóstico ISO 42001 sin coste',
    puntoLegend: '¿Cómo usáis la IA?',
    puntos: [
      { value: 'uso', label: 'Usamos herramientas de IA' },
      { value: 'producto', label: 'Desarrollamos productos con IA' },
      { value: 'iso27001', label: 'Ya tenemos ISO 27001' },
    ],
    messageLabel: 'Qué necesitas resolver',
    messagePlaceholder:
      'Por ejemplo: un cliente nos pregunta qué hace nuestra IA con sus datos',
  },

  why: {
    eyebrow: 'Por qué ahora',
    title: 'La IA entra en las empresas más rápido que las reglas para usarla.',
    description:
      'Estas son las situaciones que más vemos en la primera llamada.',
    items: [
      {
        title: 'Tus clientes preguntan',
        description:
          'Qué hace tu IA con sus datos, quién la supervisa y qué pasa si se equivoca. Cada vez aparece más en contratos y homologaciones.',
      },
      {
        title: 'La Ley de IA ya está en marcha',
        description:
          'El Reglamento (UE) 2024/1689 se aplica por fases según el riesgo de cada sistema. La formación del personal en IA ya es obligatoria.',
      },
      {
        title: 'Inversores y due diligence',
        description:
          'Cada vez más procesos de inversión y compra piden una política de IA y un inventario de sistemas.',
      },
      {
        title: 'IA en la sombra',
        description:
          'Cada departamento usa su herramienta y nadie sabe qué datos salen de la empresa. Es el riesgo más común y el más fácil de corregir.',
      },
    ],
  },

  approach: {
    eyebrow: 'Nuestro enfoque',
    title: 'Gestión de la IA hecha por gente que construye IA.',
    items: [
      {
        title: 'Sabemos cómo funciona por dentro',
        description:
          'Diseñamos y desplegamos agentes de IA para clientes. Evaluamos modelos, datos y proveedores con criterio técnico, no solo con una plantilla.',
      },
      {
        title: 'Integrada con tu ISO 27001',
        description:
          'Las dos normas comparten estructura. Si ya tienes la 27001, la 42001 se monta encima, con un único sistema y un único calendario de auditorías.',
      },
      {
        title: 'Sistema mínimo viable',
        description:
          'El sistema más sencillo que pasa la auditoría y que tu equipo puede mantener cuando entren nuevos modelos o herramientas.',
      },
      {
        title: 'Preparado para la Ley de IA',
        description:
          'Clasificamos cada sistema por nivel de riesgo y te decimos qué obligaciones concretas te tocan, sin alarmismo.',
      },
    ],
  },

  scope: {
    eyebrow: 'Qué incluye',
    title: 'Lo que pide la norma, en cuatro bloques',
    lead: 'El Anexo A de la ISO 42001 tiene 38 controles. Así los convertimos en trabajo concreto, empezando por saber qué IA hay en la empresa.',
    blocks: [
      {
        figure: '01',
        title: 'Gobierno',
        description: 'Política de IA, roles, responsabilidades y recursos.',
      },
      {
        figure: '02',
        title: 'Riesgo e impacto',
        description:
          'Evaluación de riesgos y del impacto de cada sistema en las personas.',
      },
      {
        figure: '03',
        title: 'Datos y ciclo de vida',
        description:
          'Procedencia y calidad de datos, pruebas, despliegue y monitorización.',
      },
      {
        figure: '04',
        title: 'Terceros y personas',
        description:
          'Proveedores de IA, transparencia, supervisión humana y formación.',
      },
    ],
    deliverables: [
      'Inventario de sistemas de IA',
      'Clasificación según la Ley de IA',
      'Política de IA',
      'Evaluación de riesgos',
      'Evaluación de impacto',
      'Declaración de aplicabilidad',
      'Proveedores de IA revisados',
      'Formación en IA',
      'Auditoría interna',
    ],
    panel: {
      title: 'Inventario de sistemas de IA',
      caption:
        'El primer entregable: todo lo que usáis o construís con IA, con su responsable y su nivel de riesgo según la Ley de IA.',
      systems: [
        {
          name: 'Asistente de atención al cliente',
          risk: 'Riesgo limitado',
          level: 'mid',
        },
        {
          name: 'Copiloto de redacción interno',
          risk: 'Riesgo mínimo',
          level: 'lo',
        },
        {
          name: 'Filtrado automático de candidatos',
          risk: 'Alto riesgo',
          level: 'hi',
        },
        {
          name: 'Resumen de contratos con IA',
          risk: 'Riesgo mínimo',
          level: 'lo',
        },
      ],
    },
  },

  selfAssessment: {
    eyebrow: 'Autodiagnóstico · 2 minutos',
    title: '¿Cuánto le falta a tu empresa para la ISO 42001?',
    lead: 'Diez preguntas sobre cómo usáis y gestionáis la IA. El resultado es orientativo y solo lo ves tú.',
    options: OPTIONS,
    items: [
      {
        question:
          '¿Sabéis qué herramientas y sistemas de IA se usan en la empresa?',
        gap: 'Inventario de sistemas de IA',
      },
      {
        question:
          '¿Hay una política de uso de IA aprobada y comunicada al equipo?',
        gap: 'Política de uso de IA',
      },
      {
        question:
          '¿Está claro qué datos se pueden introducir en herramientas de IA y cuáles no?',
        gap: 'Reglas sobre datos en la IA',
      },
      {
        question:
          '¿Habéis revisado las condiciones de uso de datos de vuestros proveedores de IA?',
        gap: 'Evaluación de proveedores de IA',
      },
      {
        question:
          '¿Habéis evaluado los riesgos de cada uso de IA (errores, sesgos, filtraciones)?',
        gap: 'Evaluación de riesgos de IA',
      },
      {
        question:
          '¿Sabéis en qué nivel de riesgo de la Ley de IA cae cada sistema?',
        gap: 'Clasificación según la Ley de IA',
      },
      {
        question:
          '¿Hay una persona que revisa los resultados de la IA antes de decisiones relevantes?',
        gap: 'Supervisión humana',
      },
      {
        question: '¿Informáis a clientes o usuarios cuando interactúan con IA?',
        gap: 'Transparencia ante usuarios',
      },
      {
        question:
          '¿El equipo ha recibido formación sobre el uso responsable de la IA?',
        gap: 'Formación en IA del equipo',
      },
      {
        question:
          '¿Tenéis un sistema de gestión ya implantado, como ISO 27001?',
        gap: 'Base de sistema de gestión',
      },
    ],
    count: '{done} de {total} respondidas',
    empty: 'Responde las preguntas para ver tu resultado.',
    low: 'Punto de partida inicial. Lo habitual: mucha IA en uso y pocas reglas. Se ordena rápido.',
    mid: 'Buena base. Falta formalizar y documentar parte de lo que ya hacéis.',
    high: 'Estáis cerca. Probablemente baste con cerrar huecos y preparar la auditoría.',
    gapsTitle: 'Puntos a reforzar',
    cta: 'Quiero el diagnóstico completo',
    note: 'Resultado orientativo. Al pedir el diagnóstico gratuito, lo adjuntamos a tu solicitud.',
  },

  process: {
    eyebrow: 'Cómo trabajamos',
    h2a: 'Cuatro fases,',
    h2b: 'un certificado.',
    lead: 'Si ya tienes ISO 27001, reutilizamos su estructura y el camino se acorta.',
    steps: [
      {
        title: 'Diagnóstico',
        description:
          'Mapeamos qué IA usáis o desarrolláis, con qué datos y qué falta para la norma. Sin coste.',
      },
      {
        title: 'Implantación',
        description:
          'Política de IA, riesgos e impacto, controles de datos y proveedores, y formación del equipo.',
      },
      {
        title: 'Auditoría interna',
        description:
          'Revisamos el sistema como lo hará el auditor y corregimos antes.',
      },
      {
        title: 'Certificación',
        description:
          'Coordinamos las auditorías de fase 1 y fase 2 con la entidad certificadora y te acompañamos.',
      },
    ],
  },

  costs: {
    title: 'Certificación ISO 42001: costes y plazos',
    lead: 'Depende sobre todo de cuánta IA tienes y de lo crítica que es.',
    cards: [
      {
        eyebrow: 'Coste',
        title: 'Qué hace variar el presupuesto',
        items: [
          'Número de sistemas de IA dentro del alcance',
          'Si solo usáis IA de terceros o también la desarrolláis',
          'El nivel de riesgo de esos sistemas',
          'Si ya tenéis ISO 27001 u otro sistema de gestión',
          'Tamaño de la empresa y procesos implicados',
        ],
        note: 'Tras el diagnóstico recibes un presupuesto cerrado de consultoría. Los honorarios de la entidad certificadora van aparte.',
        cta: { label: 'Calcular con el estimador', href: '/project-estimator' },
      },
      {
        eyebrow: 'Plazos',
        title: 'Qué hace variar el calendario',
        items: [
          'Lo ordenado que esté hoy el uso de la IA',
          'Si se integra con una ISO 27001 existente',
          'El tiempo que pueda dedicar tu equipo',
          'La disponibilidad de la certificadora',
        ],
        note: 'En el diagnóstico fijamos un calendario por fases con fecha objetivo de auditoría.',
        cta: { label: 'Pedir calendario para mi caso', href: '#contacto' },
      },
    ],
    aside: {
      title: '¿Ya tienes ISO 27001? Partes con buena parte del sistema hecho.',
      text: 'Alcance, riesgos, auditoría interna y revisión por la dirección se comparten. Montamos un único sistema integrado.',
      cta: {
        label: 'Ver consultoría ISO 27001',
        href: '/iso-27001-certification',
      },
    },
  },

  faqs: [
    {
      question: '¿Qué es la ISO 42001?',
      answer:
        'Es la norma internacional para gestionar la inteligencia artificial de forma responsable. Certifica que tu empresa conoce los sistemas de IA que usa o desarrolla, evalúa sus riesgos y los controla.',
    },
    {
      question: '¿Es obligatoria?',
      answer:
        'No, es voluntaria. Lo obligatorio es la Ley de IA europea, y la ISO 42001 es una de las formas más ordenadas de prepararse para ella y demostrarlo ante clientes e inversores.',
    },
    {
      question: '¿Con la ISO 42001 ya cumplo la Ley de IA?',
      answer:
        'No automáticamente. Cubre buena parte de la gestión de riesgos, documentación y supervisión que pide la ley, y en el diagnóstico te decimos qué obligaciones concretas te quedarían por cubrir.',
    },
    {
      question: 'Solo usamos ChatGPT, Copilot o Claude. ¿Nos aplica?',
      answer:
        'Sí. La norma cubre tanto a quien desarrolla IA como a quien la usa. En vuestro caso el trabajo se centra en política de uso, datos, proveedores y formación.',
    },
    {
      question: '¿Necesito tener antes la ISO 27001?',
      answer:
        'No es un requisito, pero si la tienes el proyecto es más corto porque se reutiliza buena parte del sistema. También podemos plantear las dos a la vez.',
    },
    {
      question: '¿Quién emite el certificado?',
      answer:
        'Una entidad de certificación acreditada e independiente. Nosotros implantamos el sistema y te acompañamos, pero quien audita y certifica es siempre un tercero.',
    },
  ],

  final: {
    title: 'Descubre cuánto te falta para la ISO 42001.',
    text: 'Sin coste ni compromiso. Sales de la llamada con un mapa de tu IA y los siguientes pasos.',
  },
  disclaimer:
    'Gigson Solutions presta servicios de consultoría e implantación y no es una entidad de certificación. Las auditorías de certificación las realiza una entidad acreditada e independiente.',
};
