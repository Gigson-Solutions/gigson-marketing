import './AiAgents.css';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { SeoHelmet } from '../../../seo/seoHelmet';
import Brand from 'shared/Brand.jsx';

const AiAgents = () => {
  const { t } = useTranslation();
  const {
    title,
    metadescription,
    heroH1,
    heroSubhead,
    whatIsTitle,
    whatIsBody,
    whatWeDeliverTitle,
    useCases,
    whyClaudeTitle,
    whyClaudeBody,
    howWeEngageTitle,
    engageSteps,
    cta,
  } = t('aiAgents');

  const bookLink = t('hero_link');

  return (
    <>
      <SeoHelmet title={title} description={metadescription} />

      {/* Hero */}
      <div className="ai-agents-hero">
        <p className="ai-agents-hero__eyebrow">Certified Anthropic Claude Partner</p>
        <h1 className="ai-agents-hero__h1">{heroH1}</h1>
        <p className="ai-agents-hero__subhead">{heroSubhead}</p>
      </div>

      {/* What is an AI agent */}
      <div className="ai-agents-section">
        <h2 className="ai-agents-section__title">{whatIsTitle}</h2>
        <p className="ai-agents-what__body">{whatIsBody}</p>
      </div>

      {/* What we deliver */}
      <div className="ai-agents-section">
        <h2 className="ai-agents-section__title">{whatWeDeliverTitle}</h2>
        <table className="ai-agents-table">
          <thead>
            <tr>
              <th>Use case</th>
              <th>What the agent does</th>
            </tr>
          </thead>
          <tbody>
            {useCases.map(({ case: useCase, description }, i) => (
              <tr key={i}>
                <td>{useCase}</td>
                <td>{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Why Claude */}
      <div className="ai-agents-section">
        <h2 className="ai-agents-section__title">{whyClaudeTitle}</h2>
        <p className="ai-agents-why__body">{whyClaudeBody}</p>
      </div>

      {/* How we engage */}
      <div className="ai-agents-section">
        <h2 className="ai-agents-section__title">{howWeEngageTitle}</h2>
        <div className="ai-agents-engage__steps">
          {engageSteps.map(({ num, title: stepTitle, description }, i) => (
            <div key={i} className="ai-agents-engage__step">
              <p className="ai-agents-engage__step-num">{num}</p>
              <p className="ai-agents-engage__step-title">{stepTitle}</p>
              <p className="ai-agents-engage__step-desc">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="ai-agents-cta">
        <Link to={bookLink} className="ai-agents-cta__link">{cta}</Link>
      </div>

      <Brand />
    </>
  );
};

export default AiAgents;
