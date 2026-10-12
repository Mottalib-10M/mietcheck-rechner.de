import { route, type Locale } from './routes';
import { PAGES, pageById } from '../lib/guides';
import type { Group } from '../lib/guide-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  de: { home: 'Mietspiegel', method: 'Methodik', about: 'Über uns', widget: 'Rechner einbinden', contact: 'Kontakt', editorial: 'Redaktionsrichtlinien', privacy: 'Datenschutz', terms: 'Impressum', cookies: 'Cookies' },
  en: { home: 'Rent index', method: 'Method', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' },
};
const GROUP_LABEL: Record<Locale, Record<Group, string>> = {
  de: { rechner: 'Rechner', staedte: 'Mietspiegel der Städte', laender: 'Mietpreisbremse nach Land', erhoehung: 'Miete und Erhöhung', nebenkosten: 'Nebenkosten', vertrag: 'Mietvertrag' },
  en: { rechner: 'Calculators', staedte: 'City rent indexes', laender: 'Rent brake by state', erhoehung: 'Rent and increases', nebenkosten: 'Service charges', vertrag: 'Tenancy' },
};
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? pageById(id)?.[lang].nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
const inGroup = (g: Group, lang: Locale) => PAGES.filter((p) => p.group === g).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return (['rechner', 'staedte', 'laender', 'erhoehung', 'nebenkosten', 'vertrag'] as Group[]).map((g) => ({ label: GROUP_LABEL[lang][g], links: inGroup(g, lang) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [...navCategories(lang), { label: lang === 'de' ? 'Über diese Seite' : 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) }];
export const popularLinks = (_lang: Locale): NavLink[] => [];
