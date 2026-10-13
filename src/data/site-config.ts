/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://mietcheck-rechner.de";
export const SITE_NAMES: Record<string, string> = {"de": "Mietspiegel-Rechner", "en": "German Rent Check"};
export const LANG_TAGS: Record<string, string> = {"de": "de-DE", "en": "en-DE"};
export const OG_LOCALES: Record<string, string> = {"de": "de_DE", "en": "en_GB"};
export const LOCALE_TAG = 'de-DE';
/** Une locale par langue (RECETTE §4) : « 1.234 € » en allemand, « €1,234 » en anglais. */
export const LOCALE_BY_LANG: Record<string, string> = { de: 'de-DE', en: 'en-GB' };
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-12';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"de": "Herausgeber von Mietrechtsrechnern für Deutschland", "en": "Publisher of German tenancy-law calculators"};
export const AUTHOR_DESC: Record<string, string> = {"de": "Radif Partners berechnet die ortsübliche Vergleichsmiete aus den frei veröffentlichten Mietspiegeln von Berlin, Hamburg und Dortmund und wendet für jede Gemeinde die Mieterschutzverordnung ihres Landes an: Mietpreisbremse, Kappungsgrenze, Fristen nach BGB. Jede Gemeindeliste ist im Gesetz- und Verordnungsblatt gelesen und datiert; Städte, die sich die Rechte an ihrem Mietspiegel vorbehalten, werden verlinkt, nicht kopiert.", "en": "Radif Partners works out the local reference rent from the freely published rent indexes of Berlin, Hamburg and Dortmund and applies each municipality's state tenant-protection ordinance: rent brake, increase cap and Civil Code deadlines. Every municipality list is read and dated in the official gazette; cities that reserve the rights to their index are linked, not copied."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"de": ["Mietspiegel", "Mietpreisbremse", "Kappungsgrenze", "Betriebskostenabrechnung", "Mietrecht (BGB §§ 535 ff.)"], "en": ["German rent indexes (Mietspiegel)", "Rent brake (Mietpreisbremse)", "Rent increase cap", "Service-charge statements", "German tenancy law"]};
export const CONTACT_EMAIL = "contact@mietcheck-rechner.de";
export const THEME_COLOR = '#2F4858';
export const LOGO_SYMBOL = 'maison';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau, aucun cookie, Clarity chargé en mode sans cookie (consentv2 denied).
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
export const INDEXNOW_KEY = '297d95c4a74d1fd6033dd21e0518e285';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',            // raison sociale ou nom commercial exploité
  legalForm: '',             // ex. entreprise individuelle, SASU, GmbH, eenmanszaak
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "Frankreich / France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "USt-IdNr.",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
