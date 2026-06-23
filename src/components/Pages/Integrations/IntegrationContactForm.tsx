'use client';

import '../../Form.css';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import Button from '../../../shared/ui/Button';

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
    <section id="contacto" className="px-landing bg-white">
      <div className="max-w-[88.875rem] mx-auto">
        <section className="form-section">
          <h2 className="form-h2">{title}</h2>
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

              <div className="input-container">
                <label className="label-budget">{fields.dataTypes.label}</label>
                <div className="form-budget">
                  {fields.dataTypes.options.map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        name={`data_${option.toLowerCase()}`}
                        value={option}
                        className="input-radio"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-container">
                <label className="label-budget">{fields.flow.label}</label>
                <div className="form-budget">
                  {fields.flow.options.map((option) => (
                    <>
                      <input
                        key={`input_${option.value}`}
                        type="radio"
                        id={`flow_${option.value}`}
                        name="data_flow"
                        value={option.value}
                      />
                      <label
                        key={`label_${option.value}`}
                        htmlFor={`flow_${option.value}`}
                        className="form-btn-budget"
                      >
                        {option.label}
                      </label>
                    </>
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

            <Button type="submit" name={send} classStyle="form-btn-send" />
          </form>
        </section>

        {legalNotice && (
          <p className="text-smallTag text-dark-medium pb-14 lg:pb-20">{legalNotice}</p>
        )}
      </div>
    </section>
  );
};

export default IntegrationContactForm;
