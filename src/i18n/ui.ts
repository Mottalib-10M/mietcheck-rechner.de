import type { Locale } from './routes';
const de = {
  updatedOn: 'Aktualisiert am', editorialPolicy: 'Redaktionsrichtlinien', contactLabel: 'Kontakt', reviewedBy: 'Geprüft von',
  skipToContent: 'Zum Inhalt springen', mainNav: 'Hauptnavigation', breadcrumbLabel: 'Brotkrumennavigation', breadcrumbHome: 'Start', menuOpen: 'Menü öffnen',
  faqTitle: 'Häufige Fragen', relatedCalculators: 'Passende Seiten und Rechner', sourcesTitle: 'Quellen', writtenBy: 'Verfasst von',
  asOf: 'Rechtsstand', lastUpdated: 'geprüft am', footerValidated: 'Grundlage: BGB §§ 535 ff., BetrKV, HeizkostenV, CO2KostAufG, Mietspiegel der Städte, Verordnungen der Länder', footerBrowser: 'Rechnet nur in Ihrem Browser · keine Datenübertragung · kostenlos',
  footerDisclaimer: 'Unabhängige Website von Radif Partners, ohne Verbindung zu Städten, Mietervereinen, Eigentümerverbänden, Kanzleien oder Legal-Tech-Anbietern. Wir berechnen Vergleichsmiete und Grenzen aus den veröffentlichten Mietspiegeln und Verordnungen; das Ergebnis ist eine Orientierung und keine Rechtsberatung im Einzelfall. Wir behalten keinen Anteil an zurückgeforderter Miete und geben keine Daten weiter.', footerPopular: '', notFound: 'Diese Seite gibt es nicht.',
  readMore: 'Weiterlesen',
};
const en: typeof de = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Frequently asked questions', relatedCalculators: 'Related pages and calculators', sourcesTitle: 'Sources', writtenBy: 'Written by',
  asOf: 'Legal status', lastUpdated: 'checked on', footerValidated: 'Based on the Civil Code (BGB), BetrKV, HeizkostenV, CO2KostAufG, city rent indexes and state ordinances', footerBrowser: 'Runs only in your browser · no data sent · free',
  footerDisclaimer: 'Independent website published by Radif Partners, not linked to any city, tenant association, landlord association, law firm or legal-tech company. We calculate reference rents and limits from published rent indexes and state ordinances; results are guidance, not legal advice on an individual case. We take no share of any rent you recover and pass on no data.', footerPopular: '', notFound: 'This page does not exist.',
  readMore: 'Read more',
};
export function t(lang: Locale) { return lang === 'en' ? en : de; }
