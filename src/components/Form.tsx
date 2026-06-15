'use client';

import './Form.css';

import { useTranslations } from 'next-intl';

import NextLink from 'next/link';

import Button from '../shared/ui/Button';

type FormProps = {
  customClass?: string;
};

const Form = ({ customClass }: FormProps) => {
  const t = useTranslations('form');
  const title = t('title');
  const name = t.raw('name') as { label: string; placeholder: string };
  const service = t.raw('service') as { label: string; placeholder: string; services: string[] };
  const budget = t.raw('budget') as { label: string; placeholder: string };
  const email = t.raw('email') as { label: string; placeholder: string };
  const details = t.raw('details') as { label: string; placeholder: string };
  const send = t('send');
  const checkbox = t.raw('checkbox') as { first: string; second: string; third: string };

  return (
    <section className={`${customClass ?? ''} form-section`}>
      <h2 className="form-h2">{title}</h2>
      <form
        className="form"
        action="https://formsubmit.co/jaume@somosgigson.com"
        method="POST"
      >
        <div className="form-container">
          <div className="input-container first">
            <label className="input-container-label">{name.label}</label>
            <input type="text" name="name" required placeholder={name.placeholder} />
          </div>
          <div className="input-container second">
            <label className="input-container-label">{service.label}</label>
            <select name="service" required>
              <option value="">{service.placeholder}</option>
              {service.services.map((s: string, i: number) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <label className="label-budget">{budget.label}</label>
            <div className="form-budget">
              <input type="radio" id="budgetLess10K" name="budget" value="<10K" />
              <label htmlFor="budgetLess10K" className="form-btn-budget">&lt;10k€</label>
              <input type="radio" id="budgetLess25K" name="budget" value="<25K" />
              <label htmlFor="budgetLess25K" className="form-btn-budget">&lt;25k€</label>
              <input type="radio" id="budgetLess50K" name="budget" value="<50K" />
              <label htmlFor="budgetLess50K" className="form-btn-budget">&lt;50k€</label>
              <input type="radio" id="noIdea" name="budget" value="noIdea" />
              <label htmlFor="noIdea" className="form-btn-budget">{budget.placeholder}</label>
            </div>
          </div>
          <div className="input-container">
            <label className="input-container-label">{email.label}</label>
            <input type="email" name="email" required placeholder={email.placeholder} />
          </div>
          <div className="input-container input-container-text">
            <label htmlFor="input-description" className="input-container-label">
              {details.label}
            </label>
            <input
              id="input-description"
              type="text"
              name="description"
              placeholder={details.placeholder}
            />
          </div>
          <div className="input-container form-check">
            <input type="checkbox" required className="input-radio" />
            <label>
              {checkbox.first}
              <NextLink
                className="legal-policity-form"
                href="/policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                {checkbox.second}
              </NextLink>
              {checkbox.third}
            </label>
          </div>
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="box" />
          <input type="hidden" name="_cc" value="alfonso.ojeda@gigsonsolutions.com" />
        </div>
        <Button type="submit" name={send} classStyle="form-btn-send" />
      </form>
    </section>
  );
};

export default Form;
