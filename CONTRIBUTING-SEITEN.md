# Ajouter ou étoffer une page du Mietspiegel-Rechner

Notice pour les agents qui prolongent le site. À lire en entier, avec `~/Documents/GitHub/RECETTE-SITE.md` §0, §3, §6, §7, §9.3, §11, §21, §26.

## Principe : une page = un fichier

- `src/content/outils/<id>.ts` : page outil (`tool:`), au-dessus de laquelle s'affiche un calculateur complet ; ≥ 450 mots au total (corps + résumé + FAQ), 3 à 8 questions.
- `src/content/guides/<id>.ts` : guide, avec un mini-simulateur (`mini:`, fichier `src/lib/minis/<kind>.ts`) ; ≥ 1 100 mots au total, 4 à 8 questions.
- Le fichier porte les deux langues (`de`, `en`) : slug, nav, card, title (50–60 caractères, terme-clé en tête, « 2026 » dedans), description (150–160, « 2026 » dedans), h1, intro (une phrase), resume (UN paragraphe ≥ 120 mots, avec chiffres), faqs (réponses de 40 à 90 mots), body(h).
- Le cœur (routes, menus, sitemap, hreflang, schémas, cartes « pages associées ») lit ces fichiers seul : **ne modifiez aucun fichier du cœur pour ajouter une page.** Modèles : `src/content/outils/mietpreisbremse-rechner.ts` (outil), `src/content/outils/mietspiegel-berlin.ts` (ville). Copiez la structure, jamais les phrases.
- Liste fermée des pages : `tests/planned-ids.json`. Un lien `h.a(id, texte)` vers une page prévue est valide.

## Les données (jamais de chiffre en dur dans le texte)

| Fichier | Contenu | Origine |
|---|---|---|
| `src/data/params-2026.json` | Valeurs du BGB, BetrKV, HeizkostenV, CO2KostAufG, WoFlV, VPI Destatis, Berliner Betriebskostenübersicht, **sources** | à la main, chaque valeur relue sur gesetze-im-internet.de, destatis.de, berlin.de le 2026-10-12 |
| `src/data/mietspiegel/berlin.json` | Berliner Mietspiegel 2026, 189 lignes | `python3 scripts/mietspiegel/build-berlin.py` depuis `data-src/mietspiegel/berlin-2026-tabelle.txt` (PDF officiel) |
| `src/data/mietspiegel/hamburg.json` | Hamburger Mietenspiegel 2025, 88 champs | `build-hamburg.py` (données ouvertes DL-DE-BY-2.0, recoupées avec le PDF) |
| `src/data/mietspiegel/dortmund.json` | Mietspiegel Dortmund 2025/2026, base + Zu-/Abschläge | `build-dortmund.py` (Amtsblatt Nr. 53 du 20.12.2024, DL-DE-Zero-2.0) |
| `src/data/staedte.json` | 14 villes : édition, validité, éditeur, **clause de droits lue**, schéma | `scripts/build-staedte.py` depuis `data-src/mietspiegel/<id>-quelle.json` |
| `src/data/laender.json` | Verordnungen des 16 Länder (Mietpreisbremse, Kappungsgrenze) : titre, Fundstelle, dates, communes | `scripts/build-laender.py` depuis `data-src/laender/laender-quelle.json` (extraits dans `data-src/laender/auszuege/`) |

Moteurs (testés, `tests/*.test.ts`) : `src/lib/engine/miete.ts` (Mietpreisbremse, Rückforderung, Mieterhöhung, Modernisierung, Kaution, Index, Staffel, Minderung, Betriebskosten, Heizkosten, CO2, Kündigung, Wohnfläche), `berlin.ts`, `hamburg.ts`, `dortmund.ts`, `gebiet.ts` (statut d'une commune à une date), `staedte.ts`. Dans un fichier de page, calculez les exemples avec ces fonctions et écrivez-les avec `formatMoney`/`displayDate` ou les helpers `h.eur`, `h.num`, `h.date`, `h.table`, `h.src(clé)`, `h.ext(url, texte)`, `h.a(id, texte)`.

## Règles propres à ce site

- **Droits des Mietspiegel.** On reprend des faits datés (le champ qui correspond à un cas, avec édition, ligne et lien), jamais un tableau entier. Pour les villes `schema: 'eingabe'` (München, Köln, Frankfurt, Stuttgart, Düsseldorf, Leipzig, Dresden, Hannover, Nürnberg, Bremen, Essen) : **aucun chiffre tiré de leur Mietspiegel**, ni Spanne, ni Basismiete, ni Zu-/Abschlag. Seule la `kennzahl` publiée par la ville dans un communiqué ou sur sa page (München, Dresden, Nürnberg) peut être citée, avec sa source. On décrit la méthode avec ses propres mots et on renvoie au lien officiel.
- **Pas de taux de Mietminderung.** Aucune table officielle : on n'en publie pas (pas de « Schimmel 20 % »). Le calculateur fait saisir la quote.
- **Pas de jurisprudence non vérifiée.** Seules décisions citables : BGH XII ZR 225/03 (base = loyer brut), BGH VIII ZR 206/04 (samedi = Werktag pour la Karenzzeit). Toute autre affirmation se fonde sur le texte de la loi.
- **Pas de conseil individuel ni de renvoi commercial** : ni Conny, ni wenigermiete, ni avocat nommé. On peut citer le Mieterverein local et les services publics de conseil sans lien commercial.
- **Anglais** : pour un expatrié vivant en Allemagne ; chaque terme allemand expliqué à sa première apparition, entre parenthèses. Jamais une traduction mot à mot : même faits, autre texte.
- **Allemand** : pas de numéro pointé (« 9.4 ») dans titre, description, intro, résumé, FAQ ; décimales à virgule via les formateurs. Pas de tiret cadratin nulle part.
- **Unicité** : aucune question de FAQ partagée entre deux pages ; pas deux pages à plus de 30 % de texte commun (`check-unique.py`). Les pages villes et Länder sont une famille : chaque page tire sa matière de son propre cas (dates de sa Verordnung, nombre de communes, particularités de son Mietspiegel), pas d'un gabarit de phrases.

## Contrôles (tous à 0)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/de-mietrecht
export NODE_PATH=$(npm root -g):$PWD/node_modules
npm run build                          # inclut typo-nbsp et check-snippets (bloquant)
npx vitest run
python3 scripts/check-seo.py . ; python3 scripts/check-trame.py . ; python3 scripts/check-unique.py dist
python3 scripts/check-simulateurs.py . ; python3 scripts/check-hreflang.py . ; python3 scripts/check-anglais.py .
python3 scripts/check-regles.py . ; python3 scripts/check-portefeuille.py . ; python3 scripts/check-cookies.py . ; python3 scripts/check-snippets.py .
node scripts/check-legal.mjs . ; node scripts/check-sources.mjs . ; node scripts/check-contraste.mjs dist ; node scripts/check-saisie.mjs dist --max=60
node scripts/check-nombres.mjs dist ; node scripts/typo-nbsp.mjs dist --check ; node scripts/check-url-propre.mjs dist ; node scripts/check-premier-ecran.mjs .
node scripts/check-layout.mjs dist > /tmp/layout-de-mietrecht.log 2>&1 &
```

Serveur local : port 4502 (`npm run preview`). Arrêt : `lsof -ti tcp:4502 | xargs kill`.

## Mise à jour

1. **Mietspiegel** : nouvelle édition = nouveau relevé `data-src/mietspiegel/<id>-quelle.json` (avec la clause de droits lue), puis le script de la ville et `build-staedte.py`. Prochaines échéances : Stuttgart et Dortmund fin 2026, Leipzig mi-2027, Bremen fin 2027.
2. **Verordnungen** : Hessen expire le 25.11.2026 (projet pour 71 communes en consultation), Baden-Württemberg le 31.12.2026 (projets 2027), Sachsen le 30.06.2027, Thüringen le 31.12.2027. Ajoutez la nouvelle Verordnung comme `teile` supplémentaire dans `laender-quelle.json`, relancez `build-laender.py`, `npx vitest run`.
3. **VPI** : ajouter les mois publiés par Destatis dans `params-2026.json > vpi.werte`.
4. Relire `params-2026.json` sur chaque source et mettre `retrieved_at` à jour.

## Ce qu'on ne fait pas

Pas de dépôt GitHub, pas de push, pas de DNS sans validation de l'éditeur. Ne pas toucher `_trame` ni la RECETTE. Aucune identité personnelle (éditeur : Radif Partners). Aucun lien vers un autre site du portefeuille.
