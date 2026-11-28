# Kit de refonte éditoriale

La refonte conserve Astro, les contenus et les adresses existantes. Elle applique une même identité aux pages tout en adaptant leur composition à leur fonction.

## Familles de pages

- **Accueil** : ouverture photographique animée au défilement, puis accès au dispositif, aux chiffres, tableaux, contenus récents et questions fréquentes. La page garde son contenu HTML même sans JavaScript.
- **Rubriques et listes** : titres identifiables, cartes et listes éditoriales reliées aux guides ou aux actualités. Les liens restent des liens HTML classiques.
- **Guides** : en-tête illustré, dates, sommaire, contenu complet, questions fréquentes, sources et prolongements. Le guide d’éligibilité comprend aussi un résumé et un tableau de repères.
- **Actualités** : titre, image, signature et dates, puis texte, questions et sources lorsqu’elles existent.
- **Pages de référence et outils** : même typographie et mêmes couleurs, avec priorité à la lecture et aux formulaires. Le simulateur et le test d’éligibilité conservent leurs calculs et messages.

## Composants

Le socle visuel se trouve dans `src/styles/refonte.css`, chargé par `BaseLayout.astro`. Les composants existants `Header`, `Footer`, `Cover`, `Callout`, `Faq`, `Sources`, `RateTable` et `Breadcrumbs` sont réutilisés. Les gabarits de lecture sont `src/pages/guides/[slug].astro` et `src/pages/actualites/[...slug].astro`.

Pour un tableau, utiliser un véritable élément `table`, des en-têtes `th` et, si nécessaire, un conteneur `.table-wrap` pour permettre le défilement horizontal. Employer des listes HTML, des liens descriptifs et des sources réelles ; ne pas créer de contenu ou de chiffres décoratifs.

## Points à préserver avant publication

- Conserver les URL, les balises title, les titres H1, les canoniques, les liens internes, les contenus et les sources lors des évolutions graphiques.
- Les animations sont décoratives, désactivées si la réduction des mouvements est demandée et ne conditionnent pas l’apparition du contenu.
- Vérifier au clavier et sur mobile les menus, tableaux, FAQ, simulateur et test d’éligibilité ; vérifier les performances sur la version publiée.
- Les données structurées doivent correspondre au contenu visible. Aucun format spécial ne garantit une présence dans les réponses des moteurs ou des IA.
