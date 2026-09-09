'use client';

import { useState } from 'react';

import { build2D, Collage, type MeshName, Scene2Din3D, type ScenePreset, Shape2D, type Shape2DName, type Shape2DParams, Wireframe3D } from '../../../src/design-system/shapes';
import { COVERS, EDITORIAL, MONO, type Palette } from './covers';

type FlatSpec = { name: Shape2DName; label: string; note: string; params?: Shape2DParams };
type SolidSpec = { name: MeshName; label: string; note: string; speed?: number };
type SceneSpec = { name: ScenePreset; label: string; note: string; speed?: number };

const FLAT: FlatSpec[] = [
  { name: 'polygon', label: 'polygon', note: 'sides: 5 — generaliza pentagon.svg', params: { sides: 5 } },
  { name: 'polygon', label: 'polygon', note: 'sides: 8 — misma función, otro parámetro', params: { sides: 8, rotation: 22 } },
  { name: 'orbit', label: 'orbit', note: 'rings: 3 — equivale a circunferencia1.svg', params: { rings: 3, rotation: 20 } },
  { name: 'concentric', label: 'concentric', note: 'rings: 6', params: { rings: 6 } },
  { name: 'spiral', label: 'spiral', note: 'turns: 5', params: { turns: 5 } },
  { name: 'lissajous', label: 'lissajous', note: 'ratio: 3', params: { ratio: 3 } },
  { name: 'wave', label: 'wave', note: 'sides: 7 líneas, turns: 2', params: { sides: 7, turns: 2 } },
  { name: 'radial', label: 'radial', note: 'sides: 24 radios', params: { sides: 24 } },
  { name: 'grid', label: 'grid', note: 'sides: 8 celdas', params: { sides: 8 } },
];

const SOLIDS: SolidSpec[] = [
  { name: 'cube', label: 'cube', note: '8 vértices · 12 aristas' },
  { name: 'cone', label: 'cone', note: 'sustituye a cone.svg, ahora gira' },
  { name: 'pyramid', label: 'pyramid', note: 'base 4 + ápice' },
  { name: 'octahedron', label: 'octahedron', note: 'aristas por proximidad' },
  { name: 'icosahedron', label: 'icosahedron', note: '12 vértices · 30 aristas' },
  { name: 'cylinder', label: 'cylinder', note: '2 anillos + generatrices' },
  { name: 'torus', label: 'torus', note: '20 × 10 — el más denso', speed: 0.06 },
  { name: 'helix', label: 'helix', note: 'polilínea 3D, 3 vueltas' },
];

const SCENES: SceneSpec[] = [
  { name: 'gyroscope', label: 'gyroscope', note: '3 círculos planos en planos ortogonales' },
  { name: 'tumble', label: 'tumble', note: 'un hexágono plano volteando en 2 ejes' },
  { name: 'carousel', label: 'carousel', note: 'pentágonos orbitando, siempre de cara' },
  { name: 'tunnel', label: 'tunnel', note: 'cuadrados avanzando hacia el espectador' },
  { name: 'constellation', label: 'constellation', note: '5 triángulos dispersos en profundidad' },
];

/** Bytes of the emitted path data — the honest comparison against an asset file. */
function pathBytes(name: Shape2DName, params?: Shape2DParams) {
  return new Blob(build2D(name, 220, params)).size;
}

const card: React.CSSProperties = {
  border: '0.5px solid var(--gs-stroke-soft)',
  borderRadius: 'var(--gs-radius-md)',
  padding: 'var(--gs-space-5)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--gs-space-3)',
  background: 'var(--gs-white)',
};

const mono: React.CSSProperties = {
  fontFamily: 'var(--gs-font-mono)',
  fontSize: 12,
  color: 'var(--gs-graphite)',
  textAlign: 'center',
};

export default function ShapesLabPage() {
  const [size, setSize] = useState(200);
  const [stroke, setStroke] = useState(1);
  const [run, setRun] = useState(0);

  return (
    <main
      style={{
        background: 'var(--gs-cream)',
        color: 'var(--gs-fg-1)',
        fontFamily: 'var(--gs-font-sans)',
        minHeight: '100vh',
        padding: 'var(--gs-space-8) var(--gs-padding-inline) var(--gs-space-9)',
      }}
    >
      <div style={{ maxWidth: 'var(--gs-content-w)', marginInline: 'auto' }}>
        <p style={{ ...mono, textAlign: 'left', textTransform: 'uppercase', letterSpacing: 'var(--gs-tracking-eyebrow)', color: 'var(--gs-purple)' }}>
          Design System · Lab interno
        </p>
        <h1 style={{ fontSize: 'var(--gs-text-3xl)', lineHeight: 'var(--gs-lh-display)', fontWeight: 'var(--gs-weight-light)', margin: 'var(--gs-space-3) 0 var(--gs-space-4)' }}>
          Universo de figuras paramétricas
        </h1>
        <p style={{ fontSize: 'var(--gs-text-base)', lineHeight: 'var(--gs-lh-body)', color: 'var(--gs-fg-2)', maxWidth: '62ch' }}>
          Ninguna figura de esta página es un archivo. Todas se generan con la misma
          función de geometría, heredan <code style={{ color: 'var(--gs-purple)' }}>--gs-purple</code> del
          design system y se animan porque son trazos reales.
        </p>

        {/* Controls — para validar el sistema sin tocar código */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--gs-space-6)',
            alignItems: 'center',
            margin: 'var(--gs-space-7) 0',
            padding: 'var(--gs-space-5)',
            border: '0.5px solid var(--gs-stroke-soft)',
            borderRadius: 'var(--gs-radius-pill)',
          }}
        >
          <label style={mono}>
            size {size}px{' '}
            <input type="range" min={120} max={320} value={size} onChange={(event) => setSize(Number(event.target.value))} />
          </label>
          <label style={mono}>
            stroke {stroke}px{' '}
            <input type="range" min={0.5} max={4} step={0.5} value={stroke} onChange={(event) => setStroke(Number(event.target.value))} />
          </label>
          <button
            type="button"
            onClick={() => setRun((value) => value + 1)}
            style={{
              fontFamily: 'var(--gs-font-sans)',
              fontSize: 'var(--gs-text-xs)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--gs-tracking-button)',
              padding: '10px 22px',
              borderRadius: 'var(--gs-radius-pill)',
              border: '1px solid var(--gs-purple)',
              color: 'var(--gs-purple)',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Repetir animación
          </button>
        </div>

        {/* ── NIVEL 1 — 2D paramétrico ───────────────────────── */}
        <Section
          n="01"
          title="Plano — SVG paramétrico + GSAP"
          description="Se dibujan solas al entrar en viewport (stroke-dashoffset). Debajo de cada una, el peso real de su geometría."
        />
        <Grid>
          {FLAT.map((spec, index) => (
            <div key={`${spec.name}-${index}`} style={card}>
              <div style={{ height: size, display: 'grid', placeItems: 'center' }}>
                <Shape2D key={run} name={spec.name} size={size} strokeWidth={stroke} params={spec.params} />
              </div>
              <div>
                <p style={{ ...mono, color: 'var(--gs-purple)' }}>{spec.label}</p>
                <p style={mono}>{spec.note}</p>
                <p style={{ ...mono, opacity: 0.6 }}>{pathBytes(spec.name, spec.params)} B</p>
              </div>
            </div>
          ))}
        </Grid>

        {/* ── NIVEL 2 — wireframe con volumen ────────────────── */}
        <Section
          n="02"
          title="Volumen — wireframe en canvas"
          description="Lo que creíamos que necesitaba Spline. Misma proyección que HeroScene.tsx: rotateY + perspectiva. Cero dependencias nuevas, reacciona al ratón y se pausa fuera de pantalla."
        />
        <Grid>
          {SOLIDS.map((spec) => (
            <div key={spec.name} style={card}>
              <div style={{ height: size, display: 'grid', placeItems: 'center' }}>
                <Wireframe3D name={spec.name} size={size} lineWidth={stroke} speed={spec.speed} />
              </div>
              <div>
                <p style={{ ...mono, color: 'var(--gs-purple)' }}>{spec.label}</p>
                <p style={mono}>{spec.note}</p>
              </div>
            </div>
          ))}
        </Grid>

        {/* ── NIVEL 3 — 2D viajando en 3D ────────────────────── */}
        <Section
          n="03"
          title="Figuras 2D moviéndose en un espacio 3D"
          description="Aquí no hay ningún sólido: son contornos planos: círculos, polígonos, que o bien se orientan sobre un plano del espacio, o bien viajan en profundidad mirando siempre a cámara. Se ordenan por profundidad para que las cercanas tapen a las lejanas."
        />
        <Grid>
          {SCENES.map((spec) => (
            <div key={spec.name} style={card}>
              <div style={{ height: size, display: 'grid', placeItems: 'center' }}>
                <Scene2Din3D preset={spec.name} size={size} lineWidth={stroke} speed={spec.speed} />
              </div>
              <div>
                <p style={{ ...mono, color: 'var(--gs-purple)' }}>{spec.label}</p>
                <p style={mono}>{spec.note}</p>
              </div>
            </div>
          ))}
        </Grid>

        {/* ── NIVEL 4 — collage editorial ────────────────────── */}
        <Section
          n="04"
          title="Portadas de blog — opción A, monocromo"
          description="La receta de Atlassian aplicada solo con la escala de morados que ya existe: masas rellenas grandes, mezcla multiply para que los solapes generen un tercer color, patrón recortado dentro de una forma y un trazo suelto a mano. Cero decisiones de marca nuevas."
        />
        <CoverGallery palette={MONO} />

        <Section
          n="05"
          title="Portadas de blog — opción B, paleta ampliada"
          description="Las mismas composiciones, capa por capa: solo cambia el color. Tres acentos derivados de las relaciones cromáticas del morado — ámbar claro (#F2C879) y ámbar medio (#E9A23B) como complementario partido, y verde azulado (#3AA79B) de puente frío para que morado + ámbar no lea a Halloween. Todos desaturados hacia el crema del fondo para que convivan con la marca."
        />
        <CoverGallery palette={EDITORIAL} />

        {/* ── Comparativa ────────────────────────────────────── */}
        <Section n="06" title="Por qué importa" description="Peso de los assets actuales frente a su equivalente generado." />
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--gs-text-sm)' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--gs-ink)' }}>
              <th style={{ padding: 'var(--gs-space-3)' }}>Asset actual</th>
              <th style={{ padding: 'var(--gs-space-3)' }}>Peso</th>
              <th style={{ padding: 'var(--gs-space-3)' }}>Equivalente paramétrico</th>
              <th style={{ padding: 'var(--gs-space-3)' }}>Animable</th>
            </tr>
          </thead>
          <tbody style={{ color: 'var(--gs-fg-2)' }}>
            {[
              ['Cubo-3d.svg (PNG incrustado)', '2.404 KB', 'Wireframe3D name="cube"', 'Sí'],
              ['HeroServices.svg', '5.544 KB', 'composición de figuras', 'Sí'],
              ['cone.svg', '0,3 KB', 'build2D / mesh cone', 'Sí'],
              ['pentagon.svg', '0,25 KB', 'build2D("polygon", { sides: 5 })', 'Sí'],
              ['mesh-gradient.svg ×4 duplicados', '383 KB c/u', 'pendiente de revisar', '—'],
            ].map(([asset, weight, equivalent, animatable]) => (
              <tr key={asset} style={{ borderBottom: '0.5px solid var(--gs-stroke-soft)' }}>
                <td style={{ padding: 'var(--gs-space-3)', fontFamily: 'var(--gs-font-mono)', fontSize: 12 }}>{asset}</td>
                <td style={{ padding: 'var(--gs-space-3)' }}>{weight}</td>
                <td style={{ padding: 'var(--gs-space-3)', fontFamily: 'var(--gs-font-mono)', fontSize: 12 }}>{equivalent}</td>
                <td style={{ padding: 'var(--gs-space-3)', color: 'var(--gs-purple)' }}>{animatable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Section({ n, title, description }: { n: string; title: string; description: string }) {
  return (
    <header style={{ margin: 'var(--gs-space-9) 0 var(--gs-space-6)', borderTop: '1px solid var(--gs-ink)', paddingTop: 'var(--gs-space-5)' }}>
      <span style={{ ...mono, textAlign: 'left', color: 'var(--gs-purple)', display: 'block' }}>{n}</span>
      <h2 style={{ fontSize: 'var(--gs-text-xl)', fontWeight: 'var(--gs-weight-light)', lineHeight: 'var(--gs-lh-heading)', margin: '4px 0 var(--gs-space-3)' }}>{title}</h2>
      <p style={{ color: 'var(--gs-fg-2)', fontSize: 'var(--gs-text-sm)', lineHeight: 'var(--gs-lh-body)', maxWidth: '70ch' }}>{description}</p>
    </header>
  );
}

function CoverGallery({ palette }: { palette: Palette }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 'var(--gs-space-5)' }}>
      {COVERS.map((cover) => (
        <figure key={cover.title} style={{ margin: 0 }}>
          <div style={{ borderRadius: 'var(--gs-radius-md)', overflow: 'hidden', border: '0.5px solid var(--gs-stroke-soft)' }}>
            <Collage layers={cover.build(palette)} background={palette.bg} />
          </div>
          <figcaption style={{ marginTop: 'var(--gs-space-3)' }}>
            <p style={{ fontSize: 'var(--gs-text-base)', lineHeight: 'var(--gs-lh-heading)', margin: 0 }}>{cover.title}</p>
            <p style={{ ...mono, textAlign: 'left', marginTop: 4 }}>{cover.note}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--gs-space-5)' }}>
      {children}
    </div>
  );
}
