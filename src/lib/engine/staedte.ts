/**
 * Registre des villes : édition du Mietspiegel, droits de reprise, schéma de calcul.
 * 'berlin' et 'hamburg' : la Vergleichsmiete est calculée ici (reprise autorisée) ;
 * 'eingabe' : la ville réserve ses droits, l'utilisateur saisit la valeur lue dans l'outil officiel.
 * Données : src/data/staedte.json (scripts/build-staedte.py).
 */
import RAW from '../../data/staedte.json';
import { status } from './gebiet';
export interface Stadt {
  id: string; name: string; land: string; gemeinde: string; schema: 'berlin' | 'hamburg' | 'eingabe';
  ausgabe: string; gueltigAb: string; gueltigBis: string | null; qualifiziert: boolean; herausgeber: string;
  url: string; pdf: string | null; rechner: string | null; rechte: 'A' | 'B' | 'C'; rechteZitat: string; rechteUrl: string;
  kennzahl: number | null; kennzahlText: string | null; kennzahlQuelle: string | null;
}
export const STAEDTE = RAW as unknown as Stadt[];
export const stadt = (id: string) => STAEDTE.find((s) => s.id === id);
export const stadtStatus = (s: Stadt, datum: string) => status(s.land, s.gemeinde, datum);
