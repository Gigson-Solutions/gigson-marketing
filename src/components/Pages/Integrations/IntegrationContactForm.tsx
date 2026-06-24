'use client';

import '../../Form.css';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import Button from '../../../shared/ui/Button';
import Bgcont from '../../../assets/Group 33770.svg';

/* ── Tool list (mirrors the logos grid) ─────────────────────────── */
const TOOL_OPTIONS = [
  'Shopify', 'WooCommerce', 'Printify', 'Square', 'PrestaShop',
  'Gestor Vet', 'Provetcloud', 'QVET', 'Wakyma Vets', 'WinVet',
  'Dentalink', 'Gesden', 'Orisdent', 'Dendoo', 'DasieClinic',
  'Presto', 'Revit', 'BuildingMe', 'Construdata', 'PlanHopper',
  'Kajabi', 'Teachable', 'Moodle', 'Thinkific', 'Classlife',
  'Cliniko', 'Timp', 'Flow', 'Doctoralia', 'AgendaPro',
  'CoverManager', 'Revo', 'LastApp', 'FrontRest', 'MissTipsi',
  'SAP', 'Odoo', 'Sage', 'NetSuite', 'Microsoft Dynamics',
  'Sendcloud', 'ShipStation', 'EasyPost', 'Saloodo', 'Amazon Seller',
  'HubSpot', 'Harvest', 'Pipedrive', 'FreshBooks', 'TemaLeader',
  'Fotocasa', 'Witei', 'Tokko', 'InmoVilla', 'Idealista',
  'Sesame', 'Personio', 'PayFit', 'Factorial', 'Bizneo',
];

/* ── Multi-select dropdown ───────────────────────────────────────── */
const ToolMultiSelect = ({ placeholder }: { placeholder: string }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const toggle = (tool: string) => {
    setSelected(prev =>
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  // Main list filtered by search; "Otra" always pinned at the bottom
  const filtered = TOOL_OPTIONS.filter(t =>
    t.toLowerCase().includes(search.toLowerCase())
  );

  const displayText = selected.length > 0 ? selected.join(', ') : placeholder;
  const isPlaceholder = selected.length === 0;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Hidden field for form submission */}
      <input type="hidden" name="tool" value={selected.join(', ')} />

      {/* Trigger — visually matches the other text inputs */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          fontSize: '1rem',
          color: isPlaceholder ? 'var(--gs-graphite)' : 'var(--gs-ink)',
          background: 'none',
          border: 'none',
          borderBottom: '0.0625rem solid',
          padding: '0.3rem 0 0.07rem',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
          gap: '0.5rem',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
          {displayText}
        </span>
        {/* Chevron */}
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'white',
          border: '1px solid var(--gs-purple)',
          borderRadius: '0.9375rem',
          boxShadow: '0 8px 24px rgba(120,116,244,0.15)',
          overflow: 'hidden',
        }}>
          {/* Search input */}
          <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #E0DFDF' }}>
            <input
              type="text"
              placeholder="Buscar herramienta..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              autoFocus
              style={{
                display: 'block',
                width: '100%',
                fontSize: '1rem',
                color: 'var(--gs-ink)',
                background: 'transparent',
                border: 'none',
                borderBottom: 'none',
                outline: 'none',
                padding: 0,
                margin: 0,
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Options list */}
          <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {filtered.map(tool => {
              const checked = selected.includes(tool);
              return (
                <label
                  key={tool}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 1rem',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    color: 'var(--gs-ink)',
                    backgroundColor: checked ? 'var(--gs-lavender)' : 'transparent',
                    transition: 'background 0.12s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(tool)}
                    onClick={e => e.stopPropagation()}
                    style={{
                      flexShrink: 0,
                      width: '1rem',
                      height: '1rem',
                      padding: 0,
                      borderRadius: '3px',
                      appearance: 'auto' as React.CSSProperties['appearance'],
                      accentColor: 'var(--gs-purple)',
                      cursor: 'pointer',
                    }}
                  />
                  {tool}
                </label>
              );
            })}

            {/* "Otra" always pinned at the bottom */}
            {(() => {
              const checked = selected.includes('Otra');
              return (
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 1rem',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    color: 'var(--gs-graphite)',
                    fontStyle: 'italic',
                    borderTop: filtered.length > 0 ? '1px solid #E0DFDF' : 'none',
                    backgroundColor: checked ? 'var(--gs-lavender)' : 'transparent',
                    transition: 'background 0.12s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle('Otra')}
                    onClick={e => e.stopPropagation()}
                    style={{
                      flexShrink: 0,
                      width: '1rem',
                      height: '1rem',
                      padding: 0,
                      borderRadius: '3px',
                      appearance: 'auto' as React.CSSProperties['appearance'],
                      accentColor: 'var(--gs-purple)',
                      cursor: 'pointer',
                    }}
                  />
                  Otra
                </label>
              );
            })()}

            {filtered.length === 0 && (
              <p style={{ padding: '0.6rem 1rem', color: 'var(--gs-graphite)', fontSize: '0.9rem' }}>
                Sin resultados
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Types ───────────────────────────────────────────────────────── */
type FlowOption = { value: string; label: string };
type FormData = {
  sectionTitle: string;
  sectionDescription: string;
  title: string;
  send: string;
  legalNotice?: string;
  checkbox: { first: string; second: string; third: string };
  fields: {
    name: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    tool: { label: string; placeholder: string };
    phone: { label: string; placeholder: string };
    company: { label: string; placeholder: string };
    dataTypes: { label: string; options: string[] };
    flow: { label: string; options: FlowOption[] };
    problem: { label: string; placeholder: string };
  };
};

/* ── Form component ──────────────────────────────────────────────── */
const IntegrationContactForm = () => {
  const t = useTranslations('integrations-holded');
  const form = t.raw('form') as FormData;
  const { title, fields, send, checkbox, legalNotice } = form;

  const bgSrc = typeof Bgcont === 'string' ? Bgcont : (Bgcont as { src: string }).src;

  return (
    <section id="contacto" className="px-landing bg-white overflow-hidden" style={{ scrollMarginTop: '91px' }}>
      <div className="max-w-[88.875rem] mx-auto relative">
        {/* Decorative element */}
        <div
          className="absolute right-0 top-0 pointer-events-none select-none"
          aria-hidden="true"
          style={{ width: '18.375rem', height: '18.375rem', marginRight: '-1.3rem', zIndex: 0 }}
        >
          <img
            src={bgSrc}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', top: '3rem' }}
          />
        </div>

        <section className="form-section" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="form-h2">{title}</h2>
          <form
            className="form"
            action="https://formsubmit.co/jaume@somosgigson.com"
            method="POST"
          >
            <input type="hidden" name="_subject" value="Nueva consulta de integraciones Holded" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="box" />
            <input type="hidden" name="_cc" value="alfonso.ojeda@gigsonsolutions.com" />

            <div className="form-container">
              <div className="input-container">
                <label className="input-container-label">{fields.name.label}</label>
                <input type="text" name="name" required placeholder={fields.name.placeholder} />
              </div>

              <div className="input-container">
                <label className="input-container-label">{fields.email.label}</label>
                <input type="email" name="email" required placeholder={fields.email.placeholder} />
              </div>

              {/* Tool multi-select */}
              <div className="input-container input-container-text">
                <label className="input-container-label">{fields.tool.label}</label>
                <ToolMultiSelect placeholder={fields.tool.placeholder} />
              </div>

              <div className="input-container">
                <label className="input-container-label">{fields.phone.label}</label>
                <input type="tel" name="phone" required placeholder={fields.phone.placeholder} />
              </div>

              <div className="input-container">
                <label className="input-container-label">{fields.company.label}</label>
                <input type="text" name="company" required placeholder={fields.company.placeholder} />
              </div>

              <div className="input-container">
                <label className="label-budget">{fields.dataTypes.label}</label>
                <div className="form-budget">
                  {fields.dataTypes.options.map((option) => (
                    <label
                      key={option}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        name={`data_${option.toLowerCase()}`}
                        value={option}
                        className="input-radio"
                        style={{ flexShrink: 0 }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

<div className="input-container input-container-text">
                <label className="input-container-label">{fields.problem.label}</label>
                <input type="text" name="problem" placeholder={fields.problem.placeholder} />
              </div>

              <div className="input-container form-check">
                <input type="checkbox" required className="input-radio" style={{ flexShrink: 0 }} />
                <label>
                  {checkbox.first}
                  <Link className="legal-policity-form" href="/policy" target="_blank" rel="noopener noreferrer">
                    {checkbox.second}
                  </Link>
                  {checkbox.third}
                </label>
              </div>
            </div>

            <Button type="submit" name={send} classStyle="form-btn-send" />
          </form>
        </section>

        {legalNotice && (
          <p className="text-smallTag text-dark-medium pb-14 lg:pb-20" style={{ position: 'relative', zIndex: 1 }}>
            {legalNotice}
          </p>
        )}
      </div>
    </section>
  );
};

export default IntegrationContactForm;
