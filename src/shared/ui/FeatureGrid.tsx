import useCasesBgGradient from '../../assets/casos-de-uso-bg-gradient-1.svg';

const bgSrc =
  typeof useCasesBgGradient === 'string' ? useCasesBgGradient : (useCasesBgGradient as { src: string }).src;

const bgStyle = {
  backgroundImage: `url(${bgSrc})`,
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

type Feature = { title: string; description: string };

type FeatureGridProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Short reference tags — protocols, carriers, platforms — shown as pills. */
  tags?: string[];
  features: Feature[];
  id?: string;
};

/**
 * A themed content block: eyebrow + title + intro paragraph, an optional row
 * of reference pills (protocols/carriers/platforms), and a 3-4 card grid of
 * short features. Generalises the ad hoc `cp-grid`/`cp-card` pattern used in
 * ClaudePartner.tsx and the pill style already used for the integrations
 * hero badge, so it can be reused for any "deep dive" topic block.
 */
const FeatureGrid = ({ eyebrow, title, description, tags, features, id }: FeatureGridProps) => (
  <section id={id} className="px-landing py-14 lg:py-20" style={bgStyle}>
    <div className="max-w-[88.875rem] mx-auto">
      <div className="max-w-[45rem] mb-10 lg:mb-14">
        {eyebrow && (
          <p className="text-purple-accents text-body1 uppercase tracking-widest mb-4">
            {eyebrow}
          </p>
        )}
        <h2 className="text-h2 text-dark-primary mb-4">{title}</h2>
        {description && <p className="text-subtitle text-dark-medium mb-6">{description}</p>}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="inline-block text-smallTag uppercase tracking-widest border border-purple-accents text-purple-accents rounded-full px-4 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ title: featureTitle, description: featureDescription }, i) => (
          <div
            key={i}
            className="bg-white rounded-[30px] border border-transparent hover:border-purple-accents transition duration-200 p-6 flex flex-col gap-3"
          >
            <h3 className="text-h4 text-dark-primary">{featureTitle}</h3>
            <p className="text-body text-dark-medium">{featureDescription}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureGrid;
