# Gestion-conges
Free leave manager via Google Sheets. Track vacation/RTT, interactive calendar, and smart optimization of long weekends. Web App installable on mobile.

📅 Gestionnaire de Congés & RTT
Application web gratuite et open-source pour gérer ses congés, RTT et optimiser ses ponts via Google Sheets.

Aperçu de l'application(Conseil : Remplace ce lien par une capture d'écran réelle de ton application hébergée sur un site d'image comme Imgur)

✨ Fonctionnalités
📊 Tableau de bord visuel : Suivi en temps réel des soldes CP et RTT avec des graphiques circulaires (Donuts).

🗓️ Calendrier interactif : Vue mensuelle et annuelle avec affichage des jours fériés, weekends et congés posés.

🚀 Optimisation intelligente :
Détection automatique des "Ponts" (ex: férié un jeudi -> poser le vendredi).
Calcul des meilleures périodes pour poser N jours et maximiser le temps de repos.

⚡ Ultra Rapide : Les calculs d'optimisation se font localement dans le navigateur (pas de temps de chargement).

📱 Mode Application (PWA) : Installe-le sur ton smartphone (iOS/Android) pour l'utiliser comme une vraie appli hors-ligne.

🔒 100% Privé : Toutes les données sont stockées dans ton propre Google Drive (Google Sheets). Aucun serveur externe.

🛠️ Technologies utilisées
Backend : Google Apps Script (serveur gratuit intégré à Google).
Base de données : Google Sheets.
Frontend : HTML5, CSS3 (Vanilla), JavaScript (ES6).
Graphiques : SVG natif (pas de librairie lourde).

🚀 Installation (Guide détaillé)
Comme l'application utilise ton Google Drive comme base de données, tu dois en créer une copie pour toi.

Étape 1 : Préparer le Google Sheet
Va sur Google Sheets et crée un nouveau tableau vide.
Nomme-le Gestion Congés (ou comme tu préfères).

Étape 2 : Ouvrir l'éditeur de script
Dans ton tableau, va dans le menu Extensions > Apps Script.
Un nouvel onglet s'ouvre. C'est l'éditeur de code.

Étape 3 : Copier le code
Dans l'éditeur, tu verras un fichier nommé Code.gs. Remplace tout son contenu par le code du fichier Code.gs présent dans ce dépôt GitHub.
Clique sur le + (à gauche, près de "Fichiers") > HTML. Nomme le fichier Index (sans le .html).
Remplace tout le contenu de ce fichier par le code du fichier Index.html présent dans ce dépôt.

Étape 4 : Déployer l'application
Dans l'éditeur Apps Script, clique sur Déployer (en haut à droite) > Nouveau déploiement.
Clique sur l'icône ⚙️ > Application Web.
Description : Version 1.
Exécuter en tant que : Moi.
Qui a accès : Tout le monde (si tu veux y accéder depuis n'importe où) ou Moi uniquement.
Clique sur Déployer.

Étape 5 : Autoriser l'accès
Google va te demander d'autoriser le script.
Clique sur "Autoriser".
Si Google te dit que l'application n'est pas vérifiée (c'est normal, c'est ton propre code), clique sur Avancé > Accéder à Gestion Congés (non sécurisé) > Autoriser.

Étape 6 : C'est prêt !
Tu obtiendras une URL. Copie-la et ouvre-la dans ton navigateur. L'application va initialiser les feuilles automatiquement.

📱 Installation sur Smartphone
Pour utiliser l'appli comme une vraie application native :

Ouvre l'URL de ton application sur ton téléphone.
Sur iPhone (Safari) : Appuie sur le bouton Partager > "Sur l'écran d'accueil".

Sur Android (Chrome) : Appuie sur le menu (3 points) > "Ajouter à l'écran d'accueil".

⚙️ Configuration
Tu peux ajuster les constantes dans le fichier Code.gs :

const CONFIG = {  ANNEE_BASE_CP: 25, // Nombre de CP de base par an  FORFAIT_JOURS: 218 // Nombre de jours travaillés dans l'année};
