import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEFAULT_LANG, ROUTE_SLUGS, SUPPORTED_LANGS } from '../../router/routerSlugs';
import './LanguageSelector.css'

const LanguageSelector = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const { i18n } = useTranslation();

   const currentPath = location.pathname;
   const segments = currentPath.split('/').filter(Boolean);

   const currentLang = SUPPORTED_LANGS.includes(segments[0])
      ? segments[0]
      : DEFAULT_LANG;

   const targetLang = currentLang === 'en' ? 'es' : 'en';

   const pathSegments = SUPPORTED_LANGS.includes(segments[0])
      ? segments.slice(1)
      : segments;

   const sourceSlugs = ROUTE_SLUGS[currentLang];
   const targetSlugs = ROUTE_SLUGS[targetLang];

   const invertedSource = Object.entries(sourceSlugs).reduce((acc, [key, val]) => {
      acc[val] = key;
      return acc;
   }, {});

   const translatedSegments = pathSegments.map((seg) => {
      const key = invertedSource[seg];
      return key ? targetSlugs[key] : seg;
   });

   const newPath =
      targetLang === DEFAULT_LANG
         ? `/${translatedSegments.join('/')}`
         : translatedSegments.join('/') === ''
            ? `/${targetLang}`
            :
            `/${targetLang}/${translatedSegments.join('/')}`;

   const switchLanguage = () => {
      i18n.changeLanguage(targetLang);
      document.documentElement.lang = i18n.language;
      navigate(newPath);
   };
   
   const active = "short-underline";
   const noactive = "spam-lng";

   return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
         {SUPPORTED_LANGS.map((lang, index) => (
            <div key={lang} className="flex items-center">
               <button
                  onClick={switchLanguage}
                  className={`cursor-pointer uppercase ${lang === currentLang ? active : noactive }`}
               >{lang}</button>
               {index < SUPPORTED_LANGS.length - 1 && <span className="mx-1">/</span>}
            </div>
         ))}
      </div>
   );
};
export default LanguageSelector;
