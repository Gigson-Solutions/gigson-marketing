import { useTranslation } from 'react-i18next';

const IntegrationUseCases = () => {
  const { t } = useTranslation();
  const { label, items } = t('integrations-holded.useCases');
  const formCta = t('integrations-holded.hero.cta');

  return (
    <section id="casos" className="px-landing py-14 lg:py-20 bg-white">
      <div className="max-w-[88.875rem] mx-auto">
        <p className="text-purple-accents text-body1 uppercase mb-10 tracking-widest">
          {label}
        </p>
        <div className="flex flex-col gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E0DFDF] pb-6 last:border-0 last:pb-0"
            >
              <div className="flex gap-5 items-start flex-1">
                <span className="text-purple-accents text-bigTag font-medium min-w-[2rem]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-h4 text-dark-primary">{item.title}</h3>
                  <p className="text-body text-dark-medium">{item.description}</p>
                </div>
              </div>
              <a
                href="#contacto"
                className="flex-shrink-0 inline-block border border-purple-accents text-purple-accents text-button rounded-full py-2 px-6 hover:bg-purple-light-b transition duration-200 ease-linear uppercase whitespace-nowrap"
              >
                {item.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationUseCases;
