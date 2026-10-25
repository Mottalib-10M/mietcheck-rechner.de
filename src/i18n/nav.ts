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
function categoriesCompletes(lang: Locale): NavCategory[] {
  return (['rechner', 'staedte', 'laender', 'erhoehung', 'nebenkosten', 'vertrag'] as Group[]).map((g) => ({ label: GROUP_LABEL[lang][g], links: inGroup(g, lang) })).filter((c) => c.links.length);
}
// Intitules du menu du haut : courts, jamais sur deux lignes (les intitules complets restent en bas de page).
const COURT: Record<string, string> = {"Mietspiegel der Städte": "Städte", "Mietpreisbremse nach Land": "Länder", "Miete und Erhöhung": "Erhöhung", "City rent indexes": "Cities", "Rent brake by state": "States", "Rent and increases": "Increases", "Service charges": "Charges"};
export const navCategories = (lang: Locale, court = true): NavCategory[] =>
  categoriesCompletes(lang).map((c) => (court ? { ...c, label: COURT[c.label] ?? c.label } : c));
// Methode : liee en bas de page, hors du menu du haut pour qu'il tienne sur une ligne.
export const navDirect = (_lang: Locale): NavLink[] => [];
export const footerColumns = (lang: Locale): NavCategory[] => [...navCategories(lang, false), { label: lang === 'de' ? 'Über diese Seite' : 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) }];
export const popularLinks = (_lang: Locale): NavLink[] => [];
