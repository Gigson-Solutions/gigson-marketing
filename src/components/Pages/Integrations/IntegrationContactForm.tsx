'use client';

import '../../Form.css';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

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

const IntegrationContactForm = () => {
  const t = useTranslations('integrations-holded');
  const form = t.raw('form') as FormData;
  const { sectionTitle, sectionDescription, title, fields, send, checkbox, legalNotice } = form;

  return (
    <section id="contacto" className="px-landing py-14 lg:py-20 bg-white">
      <div className="max-w-[88.875rem] mx-auto">
        <div className="mb-10 lg:mb-14">
          <h2 className="text-h2 text-dark-primary mb-4">{sectionTitle}</h2>
          <p className="text-subtitle text-dark-medium max-w-[600px]">{sectionDescription}</p>
        </div>

        <section className="form-section" style={{ margin: 0 }}>
          <h3 className="form-h2" style={{ fontSize: '1.75rem' }}>{title}</h3>
          <form
            className="form"
            action="https://formsubmit.co/jaume@somosgigson.com"
            method="POST"
          >
            <input type="hidden" name="_subject" value="Nueva consulta de integraciones Holded" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="box" />

            <div className="form-container">
              <div className="input-container">
                <label className="input-container-label">{fields.name.label}</label>
                <input type="text" name="name" required placeholder={fields.name.placeholder} />
              </div>
              <div className="input-container">
                <label className="input-container-label">{fields.email.label}</label>
                <input type="email" name="email" required placeholder={fields.email.placeholder} />
              </div>
              <div className="input-container input-container-text">
                <label className="input-container-label">{fields.tool.label}</label>
                <input type="text" name="tool" placeholder={fields.tool.placeholder} />
              </div>
              <div className="input-container">
                <label className="input-container-label">{fields.phone.label}</label>
                <input type="tel" name="phone" required placeholder={fields.phone.placeholder} />
              </div>
              <div className="input-container">
                <label className="input-container-label">{fields.company.label}</label>
                <input type="text" name="company" required placeholder={fields.company.placeholder} />
              </div>

              <div className="input-container" style={{ flexDirection: 'column' }}>
                <label className="label-budget">{fields.dataTypes.label}</label>
                <div className="form-budget" style={{ marginTop: '0.5rem' }}>
                  {fields.dataTypes.options.map((option) => (
                    <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name={`data_${option.toLowerCase()}`}
                        value={option}
                        className="input-radio"
                        style={{ width: 'auto', all: 'revert', accentColor: '#7874F4' } as React.CSSProperties}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-container" style={{ flexDirection: 'column' }}>
                <label className="label-budget">{fields.flow.label}</label>
                <div className="form-budget" style={{ marginTop: '0.5rem', flexDirection: 'column', gap: '0.5rem' }}>
                  {fields.flow.options.map((option) => (
                    <div key={option.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="radio" id={`flow_${option.value}`} name="data_flow" value={option.value} style={{ position: 'absolute', width: 0 }} />
                      <label htmlFor={`flow_${option.value}`} className="form-btn-budget">{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="input-container input-container-text">
                <label className="input-container-label">{fields.problem.label}</label>
                <input type="text" name="problem" placeholder={fields.problem.placeholder} />
              </div>

              <div className="input-container form-check">
                <input type="checkbox" required className="input-radio" />
                <label>
                  {checkbox.first}
                  <Link className="legal-policity-form" href="/policy" target="_blank" rel="noopener noreferrer">
                    {checkbox.second}
                  </Link>
                  {checkbox.third}
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="form-btn-send mt-8 text-white bg-purple-accents text-center cursor-pointer text-button rounded-full py-3 px-6 hover:opacity-80"
            >
              {send}
            </button>
          </form>
        </section>
      </div>

      {legalNotice && (
        <div className="max-w-[88.875rem] mx-auto mt-12 pt-8 border-t border-[#E0DFDF]">
          <p className="text-smallTag text-dark-medium">{legalNotice}</p>
        </div>
      )}
    </section>
  );
};

export default IntegrationContactForm;
