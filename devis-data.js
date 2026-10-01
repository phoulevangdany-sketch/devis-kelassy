/* Devis n° 2026-003 — Kelassy Academy. Contenu de la page et de l'assistant.
   Les parcours de financement sont dans dispositifs.json (même source que la démonstration Odoo).
   Montants en euros TTC sauf mention HT. */
window.DEVIS = {
  meta: {
    numero: '2026-003',
    emis: '1er octobre 2026',
    validite: '31 octobre 2026',
    remplace: '2026-002',
    client: 'Kelassy Academy',
    prestataire: 'CPL CONSULTING SAS, exploitée sous la marque Otomeo',
    adresse: '28 Avenue du Général de Gaulle, 94190 Villeneuve-Saint-Georges',
    contact: 'contact@otomeo.com',
    interlocuteur: 'Dany Phoulevang',
    legal: 'SAS au capital de 1 000 € · RCS Créteil 992 212 324 · SIRET 99221232400014 · TVA FR21 992 212 324',
  },

  prix: {
    ttc: 6000, ht: 5000,
    resume: 'Votre logiciel Odoo clé en main, pour toutes vos activités : six parcours de financement, dossiers et pièces, échéances légales, planning, émargement, prospection, suivi pédagogique, espaces en ligne, pilotage, tests et formation de l’équipe.',
    compris: [
      ['Un seul Odoo, sécurisé, à votre nom', 'Hébergé dans l’Union européenne, double authentification, un accès par personne avec des droits adaptés, sauvegardes automatiques.'],
      ['Prospection des entreprises', 'De l’appel au partenariat, besoins en alternants, relances, origine de chaque contact.'],
      ['Dossiers pour tous vos financements', 'Apprentissage, contrat pro, CPF, France Travail, entreprises, particuliers : étapes, pièces, échéances légales et suivi des paiements.'],
      ['Formations et planning', 'Catalogue avec les financements possibles par certification, sessions, salles, formateurs, planning.'],
      ['Émargement et assiduité', 'Présences, absences, retards, justificatifs, employeur prévenu.'],
      ['Suivi pédagogique et qualité', 'Suivi en entreprise, handicap (confidentiel), signalements, 14 missions du CFA, preuves pour Qualiopi.'],
      ['Espaces en ligne', 'Pour les apprenants, les entreprises et les formateurs, sur téléphone.'],
      ['Pilotage', 'Tableaux de bord direction, commercial et pédagogique.'],
      ['Mise en service', 'Tests de sécurité, recette avec vous, formation de l’équipe (6 heures) et tutoriel intégré.'],
    ],
    nonCompris: ['L’émission des factures (votre outil comptable ou un devis complémentaire)', 'La signature électronique', 'Les bulletins et conseils de classe', 'Le matching et les agents IA (en option ci-dessous)'],
    annexes: [
      { id: 'site', titre: 'Logo et site internet', ttc: 500, ht: 416.67 },
      { id: 'domaine', titre: 'Nom de domaine et adresses e-mail', ttc: 200, ht: 166.67 },
    ],
  },
  echeancier: [
    { etape: 'À la signature', part: 50, ttc: 3000, ht: 2500 },
    { etape: 'À la livraison', part: 50, ttc: 3000, ht: 2500 },
  ],
  paiementAnnexes: 'Logo, site, domaine et e-mails : 700 € TTC, réglés en totalité à la signature.',
  paiementOptions: 'Options : 50 % à la commande, 50 % à la mise en service. Abonnements : chaque mois, à partir de leur mise en service.',

  delai: {
    titre: '1 mois à 45 jours',
    sous: 'Le cycle complet, de l’analyse à la recette. Pas 45 jours de programmation.',
    phases: [
      ['Semaine 1', 'Analyse et cadrage', 'Vos règles, vos documents, vos choix sur les points à trancher.'],
      ['Semaine 2', 'Architecture et conception', 'Les écrans validés avec vous avant d’être construits.'],
      ['Semaines 3 à 5', 'Développement et automatisations', 'Les six parcours, les échéances, l’émargement, les alertes.'],
      ['Semaines 5 et 6', 'Tests, corrections et recette', 'Vous essayez avec de vrais cas, nous corrigeons.'],
      ['Ensuite', 'Mise en service et formation', 'Prise en main par l’équipe et tutoriel intégré.'],
    ],
    condition: 'Le délai court à partir de la signature et de la réception de vos documents. Documents reçus avant le 10 octobre : l’outil peut être prêt pour les dépôts OPCO de début décembre.',
  },

  besoins: [
    { qui: 'Ahmed', role: 'Pôle commercial', initiales: 'AH', points: ['Suivre chaque entreprise, du premier appel au partenariat.', 'Ne rater aucune relance : CV, rendez-vous, personnes qui ne répondent pas.', 'Trouver vite le bon candidat pour chaque entreprise.'] },
    { qui: 'Aïcha', role: 'Responsable pédagogique', initiales: 'AÏ', points: ['Des dossiers complets, avec les pièces qui manquent en un coup d’œil.', 'Suivre les apprentis : absences, points en entreprise, handicap, signalements.', 'Les 14 missions du CFA et les preuves qualité, sans surcharger l’écran.'] },
    { qui: 'Ensemble', role: 'Réunion du 29 septembre', initiales: '29/09', points: ['Déposer les dossiers des apprentis aux OPCO début décembre.', 'Noter l’origine de chaque contact pour savoir ce qui fonctionne.', 'Développer aussi la POEI, la formation des entreprises et les financements publics.'] },
  ],
  besoinsNote: '498 demandes rassemblées dans le cahier des charges du 30 septembre (192 d’Ahmed, 282 d’Aïcha, 24 de la réunion). Aucune n’a été oubliée.',

  outil: {
    phrase: 'Odoo est un logiciel de gestion utilisé par des entreprises du monde entier. Nous utilisons son édition Community, sans licence à payer, et nous l’adaptons entièrement à Kelassy.',
    apps: [
      ['Prospection', 'Les entreprises et leurs besoins en alternants.'],
      ['Dossiers', 'Une fiche par personne et par financement.'],
      ['Formation', 'Catalogue, sessions, planning, émargement.'],
      ['Discussion', 'Les échanges de l’équipe.'],
      ['Calendrier', 'Les rendez-vous.'],
      ['Contacts', 'Personnes, entreprises, financeurs.'],
    ],
  },

  /* Visite guidée : vraies captures d'Odoo (base de démonstration, données fictives). x et y en % de l'image bureau. */
  tour: [
    { id: 'kanban', nav: 'Dossiers', titre: 'Vos dossiers, en colonnes', phrase: 'Chaque colonne est une étape, chaque carte une personne. Un dossier avance ? Vous le faites glisser.', img: 'dossiers-apprentissage', audio: 's_kanban',
      points: [{ x: 15, y: 14.5, t: 'Une colonne = une étape du parcours.' }, { x: 60.3, y: 22.4, t: 'Une carte = une personne, avec son financeur.' }, { x: 28.8, y: 34.3, t: 'Les tâches à faire : rouge si en retard.' }] },
    { id: 'fiche', nav: 'Fiche', titre: 'La fiche d’un dossier', phrase: 'La personne, l’entreprise, le financeur, les pièces et l’historique, au même endroit.', img: 'fiche-pieces', audio: 's_fiche',
      points: [{ x: 31, y: 9.6, t: 'L’étape du dossier, en un clic.' }, { x: 62, y: 33.6, t: 'Qui est l’employeur, qui paie.' }, { x: 8, y: 79, t: 'Les pièces : validées, à vérifier, manquantes.' }, { x: 96.5, y: 27.5, t: 'L’historique et les tâches du jour.' }] },
    { id: 'echeances', nav: 'Échéances', titre: 'Les échéances légales', phrase: 'Les délais fixés par la loi, calculés pour chaque dossier, avec l’article correspondant.', img: 'fiche-echeances', audio: 's_echeances',
      points: [{ x: 17, y: 63.5, t: 'Un onglet par sujet.' }, { x: 9.5, y: 81.6, t: 'La date limite, calculée pour vous.' }, { x: 57.5, y: 81.6, t: 'L’article de loi qui fixe le délai.' }] },
    { id: 'financement', nav: 'Paiements', titre: 'Qui paie, et quand', phrase: 'L’échéancier de chaque financeur, avec ce qui est facturé et ce qui est payé.', img: 'fiche-financement', audio: 's_financement',
      points: [{ x: 14.5, y: 77, t: 'Les versements de l’OPCO : 40, 30, 20 % puis le solde.' }, { x: 61.5, y: 77, t: 'Prévu, facturé, payé ou en retard.' }] },
    { id: 'planning', nav: 'Planning', titre: 'Le planning de la semaine', phrase: 'Toutes vos sessions, matin et après-midi, avec les formateurs.', img: 'planning', audio: 's_planning',
      points: [{ x: 13.5, y: 48.5, t: 'Les cours du matin (ici, le FLE).' }, { x: 44, y: 71, t: 'Les cours de l’après-midi (ici, une POEI).' }, { x: 96, y: 21.6, t: 'Un mini-calendrier pour naviguer.' }] },
    { id: 'emargement', nav: 'Émargement', titre: 'L’émargement', phrase: 'Présents, absents, retards : la preuve qui déclenche les paiements.', img: 'assiduite', audio: 's_emargement',
      points: [{ x: 23, y: 18, t: 'Un cours, avec sa liste.' }, { x: 44, y: 84.5, t: 'Une absence : le justificatif est demandé.' }] },
    { id: 'prospection', nav: 'Prospection', titre: 'La prospection des entreprises', phrase: 'De l’appel au partenariat, avec le nombre d’alternants recherchés.', img: 'prospection', audio: 's_prospection',
      points: [{ x: 21, y: 17, t: 'Alternants recherchés à cette étape.' }, { x: 66, y: 21.5, t: 'Une entreprise et son besoin.' }] },
    { id: 'pilotage', nav: 'Pilotage', titre: 'Le pilotage', phrase: 'Vos dossiers par activité, en un coup d’œil, sans saisie en plus.', img: 'pilotage', audio: 's_pilotage',
      points: [{ x: 12, y: 60, t: 'Le nombre de dossiers par activité.' }, { x: 49, y: 7.7, t: 'Filtrer par formation, période, commercial.' }] },
  ],

  films: [
    { src: 'media/videos/v1.mp4', poster: 'media/videos/v1.jpg', titre: 'Un dossier d’apprentissage, de A à Z', sous: 'Ouvrir un dossier, valider une pièce, passer à l’étape suivante.' },
    { src: 'media/videos/v2.mp4', poster: 'media/videos/v2.jpg', titre: 'La semaine d’Aïcha', sous: 'Le planning, l’émargement, une déclaration CPF à faire.' },
    { src: 'media/videos/v3.mp4', poster: 'media/videos/v3.jpg', titre: 'La prospection d’Ahmed', sous: 'Faire avancer une entreprise, puis voir le pilotage.' },
  ],

  parcoursAudio: { apprentissage: 'au_apprentissage', cpf: 'au_cpf', france_travail: 'au_france_travail', entreprise: 'au_entreprise', particulier: 'au_particulier' },
  parcoursImg: { apprentissage: 'dossiers-apprentissage', contrat_pro: 'dossiers-contrat-pro', cpf: 'dossiers-cpf', france_travail: 'dossiers-france-travail', entreprise: 'dossiers-entreprise', particulier: 'dossiers-particulier' },

  regles: 'Chaque agent travaille dans Odoo avec trois règles : ce qu’il fait seul (trier, calculer, rappeler), ce qu’il prépare pour que vous validiez en un clic, et ce qu’il ne fait jamais (décider à votre place). Il s’annonce comme assistant IA, son fournisseur est hébergé dans l’Union européenne et n’utilise pas vos données pour s’entraîner. Les agents se mettent en service une fois l’outil alimenté par vos données réelles.',

  options: [
    { id: 'matching', type: 'unique', famille: 'matching', titre: 'Matching candidats ↔ entreprises', court: 'Matching', prix: 800, ht: 666.67, audio: 'o_matching', media: 'matching',
      accroche: 'Il rapproche vos candidats et les besoins des entreprises, avec une note sur 100 et le temps de trajet réel.',
      fait: ['Note sur 100, avec 2 ou 3 raisons et les points de vigilance.', 'Trajet en transports, en voiture et en kilomètres.', 'Utile en apprentissage (3 mois pour trouver une entreprise) et en POEI.'],
      jamais: 'Envoyer un CV ou un message tout seul.', origine: 'Demandé par Ahmed dans son cahier des charges.' },
    { id: 'agent-commercial', type: 'unique', famille: 'agent', titre: 'Agent commercial', court: 'Agent commercial', prix: 800, ht: 666.67, audio: 'o_agent_commercial', media: 'agent-commercial', pour: 'Ahmed',
      accroche: 'Il prépare la journée de prospection : appels, relances, e-mails.',
      fait: ['Liste des appels du matin, par priorité.', 'Relances de CV et des personnes qui ne répondent pas, programmées.', 'E-mails rédigés, que vous relisez avant envoi.'],
      jamais: 'Appeler un particulier sans son accord, ou prospecter pour le CPF.' },
    { id: 'agent-dossiers', type: 'unique', famille: 'agent', titre: 'Agent dossiers et pièces', court: 'Agent dossiers', prix: 900, ht: 750, audio: 'o_agent_dossiers', pour: 'Aïcha et l’équipe', media: 'agent-dossiers',
      accroche: 'Il repère les pièces manquantes et lit les documents déposés, pour tous les financements.',
      fait: ['Pièces manquantes calculées pour chaque dossier.', 'Documents déposés lus : type, lisibilité, date de validité.', 'Relances préparées, à valider.'],
      jamais: 'Valider une pièce ou décider d’une admission.' },
    { id: 'agent-financements', type: 'unique', famille: 'agent', titre: 'Agent financements et délais', court: 'Agent financements', prix: 1000, ht: 833.33, audio: 'o_agent_financements', media: 'agent-financements', pour: 'Aïcha et la direction',
      accroche: 'Il surveille les échéances qui coûtent de l’argent quand on les oublie : OPCO, CPF, Kairos, solde.',
      fait: ['Alertes avant chaque délai légal, pour chaque financeur.', 'CERFA, conventions et déclarations préparés.', 'Soldes à réclamer et paiements en retard repérés.'],
      jamais: 'Déposer ou signer à votre place.' },
    { id: 'agent-suivi', type: 'unique', famille: 'agent', titre: 'Agent suivi des apprenants', court: 'Agent suivi', prix: 900, ht: 750, audio: 'o_agent_suivi', media: 'agent-suivi', pour: 'Aïcha',
      accroche: 'Il suit l’assiduité, repère le décrochage et rappelle les points avec les entreprises.',
      fait: ['Seuils d’assiduité qui changent les paiements, surveillés.', 'Signes de décrochage repérés.', 'Message à l’employeur ou entretien proposé.'],
      jamais: 'Décider à la place d’Aïcha, ou lire les dossiers de handicap et de signalement.' },
    { id: 'assistant-portails', type: 'unique', famille: 'agent', titre: 'Assistant des espaces en ligne', court: 'Assistant des portails', prix: 1000, ht: 833.33, audio: 'o_assistant_portails', media: 'assistant-portails', pour: 'les apprenants et les entreprises',
      accroche: 'Il répond à toute heure aux apprenants et aux entreprises, sur leur propre dossier.',
      fait: ['Prochaine étape, pièce à déposer, horaire.', 'Demande transmise à votre équipe avec un résumé.', 'S’annonce toujours comme assistant.'],
      jamais: 'Voir le dossier d’une autre personne, ou inventer une date ou un montant.' },
    { id: 'telegram', type: 'unique', famille: 'agent', titre: 'Agent Telegram', court: 'Agent Telegram', prix: 1100, ht: 916.67, audio: 'o_telegram', media: 'telegram', pour: 'la direction',
      accroche: 'Votre copilote dans le téléphone : synthèse le matin, bilan le soir, réponses chiffrées.',
      fait: ['Synthèse à 8 h 30 et bilan à 19 h.', 'Questions en langage courant, chiffres exacts.', 'Notes dictées après un rendez-vous, rangées après accord.'],
      jamais: 'Modifier une donnée ou envoyer un message sans votre validation.' },
    { id: 'documents', type: 'unique', famille: 'documents', titre: 'Documents à votre image', court: 'Documents', prix: 800, ht: 666.67, audio: 'o_documents', media: 'documents',
      accroche: 'Convocations, conventions, contrats, certificats de réalisation, émargements : remplis tout seuls, à vos couleurs.',
      fait: ['Générés à partir du dossier, sans ressaisie.', 'Mise en forme avec votre logo, trois modifications comprises.'],
      jamais: '' },
    { id: 'abo-technique', type: 'mensuel', famille: 'abonnement', groupe: 'support', titre: 'Suivi technique', court: 'Suivi technique', prixHT: 190, prix: 228, base: 'HT', audio: 'o_abonnements',
      accroche: 'Sauvegardes vérifiées chaque mois, mises à jour de sécurité, une heure d’aide par mois.' },
    { id: 'abo-accompagnement', type: 'mensuel', famille: 'abonnement', groupe: 'support', titre: 'Accompagnement', court: 'Accompagnement', prixHT: 390, prix: 468, base: 'HT', audio: 'o_abonnements',
      accroche: 'Le suivi technique, plus quatre heures par mois d’évolutions ou d’aide, et une visio pour faire le point.' },
    { id: 'abo-agents', type: 'mensuel', famille: 'abonnement', titre: 'Maintenance des agents IA', court: 'Maintenance des agents', prix: 250, ht: 208.33, base: 'TTC', audio: 'o_abonnements',
      accroche: 'Tous vos agents entretenus, crédits d’IA compris sans limite.' },
  ],
  reglesCourtes: [['Fait seul', 'Trier, calculer, rappeler.'], ['Prépare, vous validez', 'En un clic, quand c’est prêt.'], ['Ne fait jamais', 'Décider à votre place.']],
  reglesNote: 'Il s’annonce toujours comme assistant IA. Son fournisseur est hébergé dans l’Union européenne et n’utilise pas vos données pour s’entraîner. Les agents se mettent en service une fois l’outil alimenté par vos données réelles.',
  abonnementsNote: 'Sans engagement, préavis de 30 jours. Sans abonnement : 100 € TTC de l’heure (83,33 € HT), au quart d’heure.',

  garanties: [
    ['Vos données vous appartiennent', 'Hébergées dans l’Union européenne, sauvegardes chiffrées, accord de sous-traitance signé avant la mise en service.'],
    ['Tout est à votre nom', 'Hébergement, domaine, messagerie et comptes ouverts à votre nom.'],
    ['Aucune décision automatique', 'Le logiciel prépare et rappelle ; une personne de votre équipe décide.'],
    ['Pas de promesse en l’air', 'L’outil vous aide à structurer, tracer et prouver. Il ne garantit pas à lui seul votre conformité.'],
  ],

  conditions: [
    ['Ce que couvre le devis', 'L’environnement Odoo décrit ci-dessus, le logo, le site, le domaine et les e-mails, et les options cochées. Toute demande en plus est chiffrée et acceptée avant d’être réalisée. Une option peut être ajoutée plus tard au même prix pendant la validité du devis.'],
    ['Vos validations', 'Vous validez chaque étape sous cinq jours ouvrés. Un retard de votre côté décale d’autant le délai.'],
    ['Les règles réglementaires', 'Les délais et règles paramétrés sont ceux en vigueur lors du cadrage, datés et modifiables. Ils sont validés avec vous et votre conseil avant d’être activés. Nous ne donnons pas de conseil juridique et ne garantissons pas l’obtention d’une certification comme Qualiopi.'],
    ['Données personnelles', 'Vous êtes responsable des données de vos candidats et apprenants ; nous les traitons pour votre compte, dans l’Union européenne, avec des sauvegardes chiffrées. Un accord de sous-traitance est signé avant la mise en service.'],
    ['Agents IA', 'Ils préparent et proposent ; une personne valide. Ils s’annoncent comme assistants IA. Aucune donnée de handicap, de signalement ou d’aide sociale ne leur est transmise. La consommation d’IA est comprise dans l’abonnement de maintenance des agents ; sans lui, elle est refacturée au coût réel.'],
    ['Comptes et frais extérieurs', 'Hébergement, domaine, messagerie et Telegram sont à votre nom et à votre charge (l’hébergement coûte en général de quelques euros à une quinzaine d’euros par mois).'],
    ['Propriété', 'Vos données vous appartiennent. Le logo et le site deviennent les vôtres une fois le devis payé. Nos outils de base restent à CPL CONSULTING, que vous pouvez utiliser pour votre activité sans limite de durée.'],
    ['Paiement', 'Par virement, 30 jours après la date de chaque facture. Pénalités de retard : trois fois le taux d’intérêt légal et 40 € d’indemnité de recouvrement. Pas d’escompte pour paiement anticipé.'],
    ['Conditions générales', 'Conditions générales de vente de CPL CONSULTING SAS sur otomeo.com. En cas de différence, ce devis prévaut. Tout litige relève du Tribunal de commerce de Créteil.'],
  ],

  aConfirmer: [
    'L’intitulé exact de la formation RNCP40990 (transport routier de marchandises, et non géomètre-topographe, qui est le RNCP37100).',
    'Le répertoire du DCLEP FLE (RNCP ou Répertoire spécifique), qui fixe son plafond CPF.',
    'L’habilitation de Kelassy par chaque certificateur, le numéro UAI et les OPCO visés.',
    'Les règles propres à chaque OPCO, la signature électronique du CERFA et le mandat du CFA pour le transmettre.',
    'Les durées de conservation propres au CFA et les mentions de TVA, avec votre expert-comptable.',
    'L’éligibilité aux programmes régionaux (par exemple Recrut’up) et le calendrier des marchés publics.',
  ],
};

window.DEVIS_SITE = { static: true, form: "https://formsubmit.co/ajax/direction@otomeo.com", api: "https://devis-kelassy-api-production.up.railway.app" };
