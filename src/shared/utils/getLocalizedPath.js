import { ROUTE_SLUGS } from '../../router/routerSlugs';

export const getLocalizedPath = (lang, page) => `/${lang}/${ROUTE_SLUGS[lang][page]}`;