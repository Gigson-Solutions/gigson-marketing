import type { ConsultoriaIsoContent } from './types';

const OPTIONS: [string, string, string] = ['Sí', 'En parte', 'No'];

export const ISO27001: ConsultoriaIsoContent = {
  formId: 'consultoria-iso-27001',
  pill: 'ISO/IEC 27001:2022',
  title: 'Certificación ISO 27001 sin paralizar tu negocio.',
  subtitle:
    'Implantamos tu Sistema de Gestión de Seguridad de la Información sobre cómo trabajas de verdad, aplicamos los controles que faltan y coordinamos la auditoría con la entidad certificadora.',
  bullets: [
    'No solo papeles: documentamos el sistema y aplicamos los controles técnicos que falten.',
    'Consultoría, ciberseguridad e ingeniería en el mismo equipo.',
    'Coordinamos las auditorías de fase 1 y fase 2 con una entidad acreditada.',
  ],
  audience: [
    'Pymes tecnológicas',
    'Despachos',
    'Consultoras',
    'De 10 a 250 personas',
  ],

  form: {
    title: 'Pide tu diagnóstico ISO 27001 sin coste',
    puntoLegend: '¿En qué punto estás?',
    puntos: [
      { value: 'cero', label: 'Empezamos de cero' },
      { value: 'parcial', label: 'Tenemos medidas, pero sin documentar' },
      { value: 'certificados', label: 'Ya estamos certificados' },
    ],
    messageLabel: 'Por qué necesitas la ISO 27001',
    messagePlaceholder: 'Por ejemplo: un cliente nos la pide antes de renovar',
  },

  why: {
    eyebrow: 'Por qué ahora',
    title:
      'Casi nunca es una decisión en frío. Normalmente alguien te la pide.',
    description:
      'Estas son las situaciones que más empujan a una empresa a certificarse.',
    items: [
      {
        title: 'Tu cliente lo exige',
        description:
          'Cada vez más empresas piden ISO 27001 a sus proveedores como requisito de contrato. Sin ella, la renovación peligra.',
      },
      {
        title: 'Licitaciones públicas y privadas',
        description:
          'En muchos concursos suma puntos o es requisito de admisión. Competir sin ella es ceder terreno.',
      },
      {
        title: 'Cuestionarios de seguridad',
        description:
          'Los clientes regulados envían cuestionarios cada vez más largos. Con el certificado, una respuesta cubre la mayoría.',
      },
      {
        title: 'Tu competencia ya la tiene',
        description:
          'Más de 3.000 empresas españolas están certificadas. En muchos sectores ya es lo mínimo esperable.',
      },
    ],
  },

  approach: {
    eyebrow: 'Nuestro enfoque',
    title:
      'La diferencia entre una consultoría que redacta documentos y una que implanta controles reales.',
    items: [
      {
        title: 'Controles reales, no solo documentación',
        description:
          'Evaluamos cómo funciona tu empresa e implantamos los controles del Anexo A sobre lo que ya tienes: sistemas, accesos, datos y proveedores.',
      },
      {
        title: 'Sistema mínimo viable',
        description:
          'El SGSI más sencillo que pasa la auditoría. Sin burocracia de más, mantenible aunque la seguridad la lleve una sola persona.',
      },
      {
        title: 'Sabemos qué es certificable y qué no',
        description:
          'NIS2 es cumplimiento, no una certificación. ISO 27001 sí lo es. Te decimos qué necesitas en tu caso, sin sobreingeniería.',
      },
      {
        title: 'Ingeniería y ciberseguridad en casa',
        description:
          'Si un control exige configurar algo, lo hace nuestro equipo técnico. No te dejamos una lista de tareas para tu departamento de IT.',
      },
    ],
  },

  scope: {
    eyebrow: 'Qué incluye',
    title: 'Los 93 controles del Anexo A, en cuatro grupos',
    lead: 'La versión 2022 de la norma los ordena así. Revisamos cada uno y justificamos cuáles aplican a tu empresa.',
    blocks: [
      {
        figure: '37',
        title: 'Organizacionales',
        description: 'Políticas, roles, proveedores, continuidad e incidentes.',
      },
      {
        figure: '8',
        title: 'Personas',
        description: 'Selección, formación, teletrabajo y salida de empleados.',
      },
      {
        figure: '14',
        title: 'Físicos',
        description: 'Oficinas, equipos, soportes y puestos de trabajo.',
      },
      {
        figure: '34',
        title: 'Tecnológicos',
        description: 'Accesos, cifrado, copias, registros, desarrollo y redes.',
      },
    ],
    deliverables: [
      'Análisis de brechas',
      'Alcance del SGSI',
      'Análisis y tratamiento de riesgos',
      'Declaración de aplicabilidad',
      'Políticas y procedimientos',
      'Controles técnicos implantados',
      'Formación al equipo',
      'Auditoría interna',
      'Revisión por la dirección',
    ],
    panel: {
      title: 'Preparación ISO 27001',
      caption:
        'Así te enseñamos tu punto de partida en el diagnóstico: qué cumples ya sin saberlo y qué falta de verdad.',
      summary: { figure: '64%', text: 'de los 93 controles cubiertos' },
      bars: [
        { label: 'Organizacionales', value: '24 / 37', percent: 65 },
        { label: 'Personas', value: '5 / 8', percent: 62 },
        { label: 'Físicos', value: '11 / 14', percent: 79 },
        { label: 'Tecnológicos', value: '20 / 34', percent: 59 },
      ],
    },
  },

  selfAssessment: {
    eyebrow: 'Autodiagnóstico · 2 minutos',
    title: '¿Cuánto le falta a tu empresa para la ISO 27001?',
    lead: 'Diez preguntas sobre lo que el auditor va a revisar. Contesta con sinceridad: el resultado es solo para ti.',
    options: OPTIONS,
    items: [
      {
        question:
          '¿Tenéis un inventario actualizado de sistemas, datos y proveedores?',
        gap: 'Inventario de activos y proveedores',
      },
      {
        question:
          '¿Existe una política de seguridad aprobada por la dirección?',
        gap: 'Política de seguridad aprobada',
      },
      {
        question:
          '¿Habéis hecho un análisis de riesgos documentado en el último año?',
        gap: 'Análisis de riesgos documentado',
      },
      {
        question:
          '¿El correo y las herramientas críticas exigen doble factor (MFA)?',
        gap: 'Doble factor en accesos críticos',
      },
      {
        question:
          '¿Las altas y bajas de personas siguen un procedimiento que da y retira accesos?',
        gap: 'Gestión de altas, bajas y accesos',
      },
      {
        question:
          '¿Hacéis copias de seguridad y habéis probado a restaurarlas?',
        gap: 'Copias de seguridad probadas',
      },
      {
        question:
          '¿Aplicáis parches y revisáis vulnerabilidades de forma periódica?',
        gap: 'Gestión de parches y vulnerabilidades',
      },
      {
        question: '¿Registráis y gestionáis los incidentes de seguridad?',
        gap: 'Gestión de incidentes',
      },
      {
        question:
          '¿Revisáis la seguridad de los proveedores que tratan vuestros datos?',
        gap: 'Seguridad de proveedores',
      },
      {
        question:
          '¿El equipo ha recibido formación en seguridad en el último año?',
        gap: 'Formación y concienciación',
      },
    ],
    count: '{done} de {total} respondidas',
    empty: 'Responde las preguntas para ver tu resultado.',
    low: 'Punto de partida inicial. Hay trabajo, pero es un proyecto habitual para nosotros.',
    mid: 'Buena base. Gran parte del trabajo es ordenar y documentar lo que ya hacéis.',
    high: 'Estáis cerca. Probablemente baste con cerrar huecos concretos y preparar la auditoría.',
    gapsTitle: 'Puntos a reforzar',
    cta: 'Quiero el diagnóstico completo',
    note: 'Resultado orientativo. Al pedir el diagnóstico gratuito, lo adjuntamos a tu solicitud.',
  },

  process: {
    eyebrow: 'Cómo trabajamos',
    h2a: 'Cuatro fases,',
    h2b: 'un certificado.',
    lead: 'Un proceso pensado para pymes: diagnóstico de tu operativa real, implantación sobre lo que ya tienes y coordinación de la certificadora.',
    steps: [
      {
        title: 'Diagnóstico',
        description:
          'Análisis de brechas de tu situación actual. Vemos qué controles ya cumples sin saberlo y qué falta realmente. Sin coste.',
      },
      {
        title: 'Implantación',
        description:
          'Análisis de riesgos, documentación, controles operativos sobre lo que ya tienes y formación al equipo implicado.',
      },
      {
        title: 'Auditoría interna',
        description:
          'Verificación previa para llegar a la auditoría externa sin no conformidades por sorpresa.',
      },
      {
        title: 'Certificación',
        description:
          'Coordinamos las auditorías de fase 1 y fase 2 con la entidad certificadora y te acompañamos en ellas.',
      },
    ],
  },

  costs: {
    title: 'Certificación ISO 27001: costes y plazos',
    lead: 'Las dos preguntas que todo el mundo hace. Esto es lo que las determina en la práctica.',
    cards: [
      {
        eyebrow: 'Coste',
        title: 'Qué hace variar el presupuesto',
        items: [
          'Número de personas y sedes dentro del alcance',
          'Cuántos sistemas, datos y proveedores entran en el certificado',
          'Lo que ya tengáis implantado y documentado',
          'Cuántos controles técnicos hay que poner en marcha',
          'Si queréis que llevemos el mantenimiento después',
        ],
        note: 'Tras el diagnóstico recibes un presupuesto cerrado de consultoría. Los honorarios de la entidad certificadora van aparte y te ayudamos a pedir ofertas.',
        cta: { label: 'Calcular con el estimador', href: '/project-estimator' },
      },
      {
        eyebrow: 'Plazos',
        title: 'Qué hace variar el calendario',
        items: [
          'Tu punto de partida en seguridad',
          'El tiempo que pueda dedicar tu equipo cada semana',
          'Si hay que implantar controles técnicos nuevos',
          'La disponibilidad de fechas de la certificadora',
        ],
        note: 'En el diagnóstico fijamos un calendario por fases con fecha objetivo de auditoría.',
        cta: { label: 'Pedir calendario para mi caso', href: '#contacto' },
      },
    ],
  },

  faqs: [
    {
      question: '¿Cuánto tiempo lleva obtener la certificación ISO 27001?',
      answer:
        'Depende de tu punto de partida, del alcance y del tiempo que pueda dedicar tu equipo. En el diagnóstico gratuito te damos un calendario por fases con una fecha objetivo para la auditoría.',
    },
    {
      question: '¿Qué diferencia hay entre implantación y certificación?',
      answer:
        'La implantación es montar y poner en marcha el sistema de gestión, y es lo que hacemos nosotros. La certificación es la auditoría externa que realiza una entidad acreditada e independiente, que es quien emite el certificado.',
    },
    {
      question: '¿NIS2 me obliga a certificarme en ISO 27001?',
      answer:
        'No. NIS2 impone obligaciones de ciberseguridad a ciertos sectores, pero no exige ninguna certificación concreta. ISO 27001 cubre buena parte de las medidas que pide y es la forma más reconocida de demostrarlas.',
    },
    {
      question: '¿Cuánto cuesta la certificación ISO 27001?',
      answer:
        'Tiene dos partes: la consultoría de implantación y los honorarios de la entidad certificadora. La primera depende del tamaño, el alcance y lo que ya tengas hecho, y te la damos cerrada tras el diagnóstico.',
    },
    {
      question:
        '¿Necesito un responsable de seguridad interno para mantener la certificación?',
      answer:
        'Necesitas a una persona que lo coordine, pero no a jornada completa. Diseñamos el sistema para que lo pueda sostener una sola persona, y si lo prefieres podemos llevar nosotros el mantenimiento.',
    },
    {
      question: '¿Cuánto dura el certificado?',
      answer:
        'Tres años, con auditorías de seguimiento anuales. Al tercer año se hace la auditoría de renovación.',
    },
  ],

  final: {
    title: 'Descubre cuánto te falta para la ISO 27001.',
    text: 'Sin coste ni compromiso. Sales de la llamada sabiendo por dónde empezar.',
  },
  disclaimer:
    'Gigson Solutions presta servicios de consultoría e implantación y no es una entidad de certificación. Las auditorías de certificación las realiza una entidad acreditada e independiente.',
};
