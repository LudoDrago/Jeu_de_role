let nomJoueur ='';
let skin_ennemi = "";
let cout_hp_max = 20;  // cout dans le magasin des hp max du joueur
let cout_atk_max = 20;  // cout dans le magasin de l'atk max du joueur
let cout_mini_atk = 20;  // cout dans le magasin de l'atk mini du joueur
let cout_coffre = 1;  // cout dans le magasin du coffre
let logs = [];
let mini_atk_ennemi = 5;
let max_atk_ennemi = 8;
let vie_ennemi = 50;
const liste_race = ["👺", "😾", "🦍", "🐵", "🦄", "🦌", "🦇", "🐘", "🤯", "🐍", "🕷️", "🧙‍", "💩", "🧟‍"];
let incre_atk_ennemi = 0;  // permet d'augmenter à chq kill l'atk de l'ennemi
let gain = '';
let gain1 = '';
let gain2 = '';
let gain3 = '';
let gain4 = '';
let bonusOr = 0;
let bonusHp = 0;
let bonusAtk = 0;
let bonusEssence = 0;
let musiqueActuelle = null; // Variable pour garder une trace de la musique actuelle
let forward = true;
let max_atk_ennemi_base = 0;
let mini_atk_ennemi_base = 0;
let Sorts = {};
let Joueur = {};
const video = document.querySelector('.background-video video');
//const { enregistrerScore } = require('./scoreManager');

jouerBoucleVideo();

function jouerSonVillage() {
    const sonVillage = document.getElementById("sonVillage");
    sonVillage.volume = 0.1;
    sonVillage.currentTime = 0; // Remet à zéro pour rejouer
    sonVillage.play();
    musiqueActuelle = sonVillage;
}

function choisirRace(race) {
    let message;
    switch (race) {
        case 'humain':
        case 'humaine':
            message = `Vous avez choisi la race : ${race}, vous obtiendrez de gros bonus d'attaque ⚔️ !`;
            break;
        case 'dinosaure':
            message = `Vous avez choisi la race : ${race}, vous obtiendrez de gros bonus de vie ❤️ !`;
            break;
        case 'dragon':
            message = `Vous avez choisi la race : ${race}, vous gagnerez beaucoup plus d'argent 💸 !`;
            break;
        case 'sorcier':
        case 'sorciere':
            message = `Vous avez choisi la race : ${race}, vous gagnerez beaucoup plus d'essences 🌺 et les sorts sont moins chers à lancer !`;
            break;
        default:
            message = "Vous n'avez rien choisi, bizarre";
    }
    document.getElementById('messages').innerText = message;
    messagesElement.innerText = message;
    messagesElement.style.display = 'block';  // Assure que le message est visible

}

function InitialiseValeur() {
    skin_ennemi = "";
    cout_hp_max = 20;  // cout dans le magasin des hp max du joueur
    cout_atk_max = 20;  // cout dans le magasin de l'atk max du joueur
    cout_mini_atk = 20;  // cout dans le magasin de l'atk mini du joueur
    cout_coffre = 1;  // cout dans le magasin du coffre
    logs = [];
    mini_atk_ennemi = 5;
    max_atk_ennemi = 8;
    vie_ennemi = 50;
    incre_atk_ennemi = 0;  // permet d'augmenter à chq kill l'atk de l'ennemi
    gain = '';
    gain1 = '';
    gain2 = '';
    gain3 = '';
    gain4 = '';
    bonusOr = 0;
    bonusHp = 0;
    bonusAtk = 0;
    bonusEssence = 0;
    musiqueActuelle = null;

    //cout pour améliorer le sort, amelioration pour savoir si tu as atteint le max d'amélioration,
    //resultat du sort, coutMana cout du lancement du sort
    Sorts = {
    1: {
        Cout: 2,
        Amelioration: 0,
        Resultat: 50,
        CoutMana: 5,
        Nom: 'REGEN',
        Animation: '💖',
        Effet1: 'Tu récupères ', Effet2: ' de vie ❤️',
        getEffet: function(){
            const valeurArrondie = Math.ceil(Joueur.hpmax * this.Resultat / 100);
            return `${this.Effet1} ${valeurArrondie} ${this.Effet2}`;},
        getResult: function() {Joueur.hp += Math.ceil(Joueur.hpmax * this.Resultat / 100);},
        Son: jouerRegen
    },
    2: { Cout: 10, Amelioration: 0, Resultat: 1, CoutMana: 10, Nom: 'INVINCIBLE', Animation: '✨', Effet1: 'Tu deviens invincible pendant', Effet2: ' tours',
        getEffet: function() {return `${this.Effet1} ${this.Resultat} ${this.Effet2}`;},
        getResult: function() {Joueur.Invincible = this.Resultat},
        Son: jouerInvincible
    },
    3: { Cout: 5, Amelioration: 0, Resultat: 1, CoutMana: 6, Nom: 'FLECHE', Animation: '💥', Effet1: 'Ton sort fait ', Effet2: ' de dégâts',
        getEffet: function() {return `${this.Effet1} ${Joueur.max_atk_joueur * this.Resultat} ${this.Effet2}`;},
        getResult: function() {vie_ennemi -= (Joueur.max_atk_joueur * this.Resultat)},
        Son: jouerFleche
    },
    4: { Cout: 2, Amelioration: 0, Resultat: 50, CoutMana: 10, Nom: 'MALEDICTION', Animation: '👁️‍🗨️', Effet1: 'Tu réduis les dégâts de ', Effet2: ' %',
        getEffet: function() {return `${this.Effet1} ${this.Resultat} ${this.Effet2}`;},
        getResult: function() {max_atk_ennemi = Math.ceil(max_atk_ennemi / 2); mini_atk_ennemi = Math.ceil(mini_atk_ennemi / 2);},
        Son: jouerMalediction
    },
    };
    Joueur = {
        nom: '', //fait
        urlscreen: '',
        skin: '',
        race: '',
        lvl: 1,
        hpmax: 100, // fait
        max_atk_joueur: 10, //fait
        mini_atk_joueur: 5, //fait
        Mana: 0, //fait
        manamax: 10, //fait
        hp: 100, //fait
        nb_de_potion: 5, //fait
        nb_de_kill: 0, //fait
        or: 100, // fait
        montantEssence: 0, //fait
        min_hp_potion: 30,
        Invincible: 0
    };
}

function mettreAJourMana() {
    if (Joueur.Mana > Joueur.manamax) {Joueur.Mana = Joueur.manamax;}
    document.getElementById("Joueur.Mana").textContent = `${Joueur.Mana}/${Joueur.manamax} 💧 `;}

function jouerBoucleVideo() {
    video.play();
    video.addEventListener('timeupdate', () => {
    if (forward && video.currentTime >= video.duration - 0.1) {
      forward = false; // Inverser la direction à la fin
    } else if (!forward && video.currentTime <= 0.1) {
      forward = true; // Revenir en avant au début
    }

    // Met à jour la position de lecture en fonction de la direction
    video.currentTime += forward ? 0.05 : -0.05;
  });
}

function jouerRegen() {
    const SonRegen = document.getElementById("SonRegen");
    SonRegen.volume = 1;
    SonRegen.currentTime = 0; // Remet à zéro pour rejouer
    SonRegen.play();
}

function jouerInvincible() {
    const SonInvincible = document.getElementById("SonInvincible");
    SonInvincible.volume = 1;
    SonMortJoueur.playbackRate = 2;
    SonInvincible.currentTime = 2; // Remet à zéro pour rejouer
    SonInvincible.play();
}

function jouerFleche() {
    const SonFleche = document.getElementById("SonFleche");
    SonFleche.volume = 1;
    SonFleche.currentTime = 0; // Remet à zéro pour rejouer
    SonFleche.play();
}

function jouerMalediction() {
    const SonMalediction = document.getElementById("SonMalediction");
    SonMalediction.volume = 1;
    SonMalediction.currentTime = 0; // Remet à zéro pour rejouer
    SonMalediction.play();
}

function jouerSonBossEntree1() {
    const SonBossEntree1 = document.getElementById("SonBossEntree1");
    SonBossEntree1.volume = 1;
    SonBossEntree1.currentTime = 0; // Remet à zéro pour rejouer
    SonBossEntree1.play();
    musiqueActuelle = SonBossEntree1;
}

function jouerSonPotion() {
    const SonPotion = document.getElementById("SonPotion");
    SonPotion.volume = 1;
    SonPotion.currentTime = 0; // Remet à zéro pour rejouer
    SonPotion.playbackRate = 2;
    SonPotion.play();
}

function jouerSonBossEntree2() {
    const SonBossEntree2 = document.getElementById("SonBossEntree2");
    SonBossEntree2.volume = 0.3;
    SonBossEntree2.currentTime = 0; // Remet à zéro pour rejouer
    SonBossEntree2.play();
}

function jouerSonCoins() {
    const SonCoins = document.getElementById("SonCoins");
    SonCoins.volume = 1;
    SonCoins.currentTime = 0; // Remet à zéro pour rejouer
    SonCoins.play();
}

function jouerSonEchec() {
    const SonEchec = document.getElementById("SonEchec");
    SonEchec.volume = 0.3;
    SonEchec.currentTime = 0; // Remet à zéro pour rejouer
    SonEchec.play();
}

function jouerSonYes() {
    const SonYes = document.getElementById("SonYes");
    SonYes.volume = 0.3;
    SonYes.currentTime = 0; // Remet à zéro pour rejouer
    SonYes.play();
}

function jouerSonBoss() {
    const SonBoss = document.getElementById("SonBoss");
    SonBoss.currentTime = 0; // Remet à zéro pour rejouer
    SonBoss.play();
}

function jouerSonOsCasse() {
    const SonOsCasse = document.getElementById("SonOsCasse");
    SonOsCasse.volume = 0.3;
    SonOsCasse.currentTime = 0; // Remet à zéro pour rejouer
    SonOsCasse.play();
}

function jouerSonCoupVentre() {
    const SonCoupVentre = document.getElementById("SonCoupVentre");
    SonCoupVentre.currentTime = 0; // Remet à zéro pour rejouer
    SonCoupVentre.play();
}

function jouerFrappeJoueur() {
    console.log(Joueur.race)
    if (Joueur.race === 'humain'  || Joueur.race === 'humaine') {
        const sonEpee = document.getElementById("sonEpee");
        sonEpee.currentTime = 0; // Remet à zéro pour rejouer
        sonEpee.play();
    }
    if (Joueur.race === 'dragon') {
        const sonDragon = document.getElementById("sonDragon");
        sonDragon.playbackRate = 5;
        sonDragon.currentTime = 0; // Remet à zéro pour rejouer
        sonDragon.play();
    }
    if (Joueur.race === 'dinosaure') {
        const sonDino = document.getElementById("sonDino");
        sonDino.playbackRate = 2;
        sonDino.currentTime = 0; // Remet à zéro pour rejouer
        sonDino.play();
    }
    if (Joueur.race === 'sorcier'  || Joueur.race === 'sorciere') {
        const sonBaton = document.getElementById("sonBaton");
        sonBaton.currentTime = 0; // Remet à zéro pour rejouer

        sonBaton.play();
    }
}

function jouerSonMortJoueur() {
    const SonMortJoueur = document.getElementById("SonMortJoueur");
    SonMortJoueur.currentTime = 0; // Remet à zéro pour rejouer
    SonMortJoueur.playbackRate = 0.6;
    SonMortJoueur.play();
}

function saisirNom() {
    nomJoueur = document.getElementById('nomJoueur').value;
    if (nomJoueur.trim() !== '') {
        document.getElementById('choix_nom_joueur').style.display = 'none';
        document.getElementById('choixRaceSection').style.display = 'block';
        InitialiseValeur();
        Joueur.nom = nomJoueur //Permet d'attribuer le nom pour l'enregistrement
    }
}

function choisirRace(race) {
    bonusOr = 0;
    bonusHp = 0;
    bonusAtk = 0;
    bonusEssence = 0;
    SonBossEntree1.pause();
    skin_ennemi = liste_race[Math.floor(Math.random() * liste_race.length)];
    Joueur.race = race;

    // Vérifier si la race nécessite un choix de genre
    if (race === 'humain' || race === 'sorcier') {
        ouvrirModalGenre(); // Ouvrir la modale de choix de genre
    }
    // Déterminer le message de bonus en fonction de la race choisie
    if (race === 'humain' || race === 'humaine') {
        message = `Vous avez choisi la race : ${race}, vous obtiendrez de gros bonus d'attaque ⚔️ !`;
    } else if (race === 'dinosaure') {
        message = `Vous avez choisi la race : ${race}, vous obtiendrez de gros bonus de vie ❤️ !`;
    } else if (race === 'dragon') {
        message = `Vous avez choisi la race : ${race}, vous gagnerez beaucoup plus d'argent 💸 !`;
    } else if (race === 'sorcier' || race === 'sorciere') {
        message = `Vous avez choisi la race : ${race}, vous gagnerez beaucoup plus d'essences 🌺 et les sorts sont moins chers à lancer !`;
    } else {
        message = "Vous n'avez rien choisi, bizarre";
    }

    // Afficher le message de bonus
    document.getElementById('messages').innerText = message;
    document.getElementById('messages').style.display = 'block';

    // Afficher le bouton de validation pour confirmer le choix
    document.getElementById('validationRace').style.display = 'inline-block';
}

function choisirGenre(genre) {
    Joueur.genre = genre; // Enregistre le genre choisi pour le joueur

    // Changer la race en fonction de la sélection
    if (Joueur.race === 'humain') {
        Joueur.race = genre === 'homme' ? 'humain' : 'humaine';
    } else if (Joueur.race === 'sorcier') {
        Joueur.race = genre === 'homme' ? 'sorcier' : 'sorciere';
    }

    // Ferme la modale après le choix
    document.getElementById('genreModal').style.display = 'none';
    // Affiche le bouton de validation une fois le genre sélectionné
    document.getElementById('validationRace').style.display = 'inline-block';
}

// Fonction pour ouvrir la modale de choix de genre
function ouvrirModalGenre() {document.getElementById('genreModal').style.display = 'flex';}

// Fermer la modale si l'utilisateur annule
function fermerModal() {document.getElementById('genreModal').style.display = 'none';}

function validerChoix() {
    if (Joueur.race === 'humain' || Joueur.race === 'humaine') {
        // Attribuer les bonus communs aux humains
        bonusAtk = 1;
        Joueur.max_atk_joueur += 3;
        Joueur.mini_atk_joueur += 3;

        // Définir les propriétés spécifiques en fonction du genre
        if (Joueur.race === 'humain') {
            Joueur.skin = '👦🏻';
            Joueur.urlscreen = "url('../static/images/humain_guerrier.jpg')";
        } else {
            Joueur.skin = '👧🏼';
            Joueur.urlscreen = "url('../static/images/humain_guerriere.jpg')";
        }
    }
    if (Joueur.race === 'dinosaure') {
        Joueur.skin = '🦖'; // Dinosaure
        Joueur.urlscreen = "url('../static/images/dino.jpg')";
        bonusHp = 5
        Joueur.hpmax += 25
        Joueur.hp += 25
    }
    if (Joueur.race === 'dragon') {
        bonusOr = 3
        Joueur.skin = '🐉'; // Dragon
        Joueur.urlscreen = "url('../static/images/dragon.jpg')";
        Joueur.or += 100
    }
    if (Joueur.race === 'sorcier' || Joueur.race === 'sorciere') {
        // Attribuer les bonus communs aux sorciers et sorcières
        bonusEssence = 2;
        Joueur.manamax = 12;
        Sorts[1].CoutMana = 4; //Diminue le cout de regen
        Sorts[2].CoutMana = 8; //Diminue le cout de l'invincibilité
        Sorts[3].CoutMana = 4; //Diminue le cout de fleche
        Sorts[4].CoutMana = 8; //Diminue le cout de la malédiction
        Joueur.skin = Joueur.race === 'sorcier' ? '🧙🏼‍♂️' : '🧝‍♀️';
        Joueur.urlscreen = Joueur.race === 'sorcier'
            ? "url('../static/images/sorcier.jpg')"
            : "url('../static/images/sorciere.jpg')";

    }

    // Réinitialiser l'interface
    document.getElementById('choixRaceSection').style.display = 'none';
    document.getElementById('validationRace').style.display = 'none';
    // Afficher le message de bienvenue
    document.getElementById('messages').innerText = `Bienvenu ${nomJoueur}, tu as choisi d'être ${Joueur.race} ${Joueur.skin} !`;
    document.getElementById('suite').style.display = 'inline-block';
    console.log(`Race choisie : ${Joueur.race}`)
    if (messages) messages.style.display = 'block';
}

function randomBetween(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}

function nettoyageEcran() {
    const messagesElement = document.getElementById('messages');
    const suiteButton = document.getElementById('suite');
    const magasinDiv = document.getElementById('magasin');

    // Vérifier que l'élément "messages" existe et le masquer
    if (messagesElement) {
        messagesElement.style.display = 'none';
    }

    // Vérifier que le bouton "suite" existe et le masquer
    if (suiteButton) {
        suiteButton.style.display = 'none';
        const video = document.getElementById('background-video');
        video.pause(); // Met la vidéo en pause
        video.style.display = 'none'; // Cache la vidéo
    }
    // Mettre à jour l'affichage des boutons du magasin
    if (magasin) magasin.style.display = 'block';
    afficherBoutonsMagasin();
}

function reinitialiserMessagesMagasin() {
    const messagesErreur = document.querySelectorAll('.message-error');
    messagesErreur.forEach(message => {
        message.innerText = "  ";
    });
}

function afficherBoutonsMagasin() {
    document.body.style.backgroundImage = `url('../static/images/chateau.jpg')`;
    // Mettre à jour l'affichage du montant d'or actuel
    document.getElementById('or-actuel').style.display = 'block';
    mettreAJourMana();
    document.getElementById("montantOr").textContent = Joueur.or + " 💰";
    document.getElementById("Joueur.montantEssence").textContent = Joueur.montantEssence + " 🌺";
    const magasinDiv = document.getElementById('magasin');
    magasinDiv.innerHTML = '';

    const boutons = [
        { text: `Jette un oeil à tes stats et ton inventaire`, id: '3' },
        { text: `Utilise tes essences  🌺 : Ouvre ton grimoire 📖 `, id: '6' },
        { text: `Pour ${cout_hp_max}💰 : +${10 + bonusHp} sur ton max d'hp (actuellement ${Joueur.hpmax} ❤️)`, id: '1' },
        { text: `Pour ${cout_atk_max}💰 : +${2 + bonusAtk} à ton maximum d'attaque (actuellement ${Joueur.max_atk_joueur}⚔️)`, id: '2' },
        { text: `Pour ${cout_mini_atk}💰 : +${2 + bonusAtk} à ton minimum d'attaque (actuellement ${Joueur.mini_atk_joueur}⚔️)`, id: '4' },
        { text: `Pour ${cout_coffre}💰 : Teste le jeu du coffre 💼 💼 💼 `, id: '5' },
        { text: `Rien, et passons au combat 🤜🤜 `, id: '7' }
    ];

    boutons.forEach(bouton => {
        const buttonElement = document.createElement('button');
        buttonElement.innerText = bouton.text;
        buttonElement.dataset.id = bouton.id;

        const messageElement = document.createElement('span');
        messageElement.className = 'message-error';
        messageElement.innerText = "   ";
        messageElement.style.display = 'block';

        buttonElement.onclick = () => {
            choixMagasin(bouton.id, buttonElement, messageElement);
        };

        const buttonContainer = document.createElement('div');
        buttonContainer.appendChild(buttonElement);
        buttonContainer.appendChild(messageElement);
        magasinDiv.appendChild(buttonContainer);
    });

}

function choixMagasin(choix, buttonElement, messageElement) {

    console.log(`Choix dans le magasin : ${choix}`);
    let message = "";
    switch (choix) {
        case '1': //Monter les points de vie
            if (Joueur.or >= cout_hp_max) {
                Joueur.hpmax += 10 + bonusHp;
                Joueur.or -= cout_hp_max;
                cout_hp_max += 20;
                message = "Augmentation de la vie réussie !";
                document.getElementById("montantOr").textContent = Joueur.or + " 💰";
                buttonElement.innerText = `Pour ${cout_hp_max}💰 : +${10 + bonusHp} sur ton max de vie (actuellement ${Joueur.hpmax} ❤️)`;

            } else {
                message = "Vous n'avez pas assez d'argent.";
            }
            break;

        case '2': //Augmente le max d'attaque
            if (Joueur.or >= cout_atk_max) {
                Joueur.max_atk_joueur += (2 + bonusAtk);
                Joueur.or -= cout_atk_max;
                cout_atk_max += 20;
                message = "Attaque max augmentée avec succès !";
                document.getElementById("montantOr").textContent = Joueur.or + " 💰";
                buttonElement.innerText = `Pour ${cout_atk_max}💰 : +${2 + bonusAtk} à ton maximum d'attaque (actuellement  ${Joueur.max_atk_joueur}⚔️)`;
            } else {
                message = "Vous n'avez pas assez d'argent.";
            }
            break;

        case '3': //Charge l'inventaire
            OuvrirInventaire();
            break;

        case '4': // Augmente le minimum d'attaque
            if (Joueur.or < cout_mini_atk) {
                message = "Vous n'avez pas assez d'argent.";
                break;
            }
            if (Joueur.mini_atk_joueur >= Joueur.max_atk_joueur - (1 + bonusAtk)) {
                message = "Augmentez d'abord votre attaque maximale pour pouvoir augmenter le minimum.";
                break;
            }
            // Augmente le minimum d'attaque
            Joueur.mini_atk_joueur += (2 + bonusAtk);

            // Ajuste le maximum si le minimum le dépasse
            if (Joueur.mini_atk_joueur > Joueur.max_atk_joueur) {
                Joueur.max_atk_joueur = Joueur.mini_atk_joueur;
                // Met à jour le bouton pour refléter la nouvelle valeur de Joueur.max_atk_joueur
                const boutonRegenererHp = document.querySelector('.magasin button[data-id="2"]');
                boutonRegenererHp.innerText = `Pour ${cout_atk_max}💰 : +${2 + bonusAtk} à ton maximum d'attaque (actuellement ${Joueur.max_atk_joueur}⚔️)`;
            }
            // Met à jour les valeurs de l'or et du coût
            Joueur.or -= cout_mini_atk;
            cout_mini_atk += 20;
            message = "Attaque minimum augmentée avec succès !";
            // Affiche les nouvelles valeurs dans l'interface
            document.getElementById("montantOr").textContent = `${Joueur.or} 💰`;
            buttonElement.innerText = `Pour ${cout_mini_atk}💰 : +${2 + bonusAtk} à ton minimum d'attaque (actuellement ${Joueur.mini_atk_joueur}⚔️)`;
            break;

        case '5': //Jeu du coffre
            if (Joueur.nb_de_kill === 0){
                message = "Vous devez tuer au moins 1 monstre avant d'y jouer.";
                break;
            }
            if (Joueur.or >= cout_coffre) {
                Joueur.or -= cout_coffre;
                cout_coffre += 5;
                //message = "Jeu du coffre lancé !";
                document.getElementById("montantOr").textContent = Joueur.or + " 💰";
                buttonElement.innerText = `Pour ${cout_coffre}💰 : Testez le jeu du coffre 💼💼💼`;
                document.getElementById('or-actuel').style.display = 'none';
                document.getElementById('magasin').style.display = 'none';
                jeuCoffre();
                return;
            } else {
                message = "Vous n'avez pas assez d'argent.";
            }
            break;

        case '6': //Ouvrir Grimoire
            OuvrirGrimoireMagasin();
            break;

        case '7': //Go combat
            // Réinitialiser l'ennemi
            skin_ennemi = liste_race[Math.floor(Math.random() * liste_race.length)];
            vie_ennemi = 50 + 10*Joueur.nb_de_kill;
            if (Joueur.nb_de_kill % 10 === 0 && Joueur.nb_de_kill > 0) {
            // Code à exécuter si Joueur.nb_de_kill / 10 donne un nombre entier faire un boss
                skin_ennemi = '🦕';
                vie_ennemi +=  50 + 30*Joueur.nb_de_kill;
            }
            // Augmente l'attaque ennemi
            incre_atk_ennemi += 2;
            mini_atk_ennemi = 5 + incre_atk_ennemi/2;
            max_atk_ennemi = 8 + incre_atk_ennemi;
            max_atk_ennemi_base = max_atk_ennemi;
            mini_atk_ennemi_base = mini_atk_ennemi;
            reinitialiserMessagesMagasin();
            document.getElementById('or-actuel').style.display = 'none';
            if (skin_ennemi === '🦕') {
                sonVillage.pause();
                jouerSonBossEntree1();
                document.body.style.backgroundImage = `url('../static/images/areneboss.jpg')`;
            } else {
                const randomNumberArene = Math.floor(Math.random() * 21) + 1;
                document.body.style.backgroundImage = `url('../static/images/arene${randomNumberArene}.jpg')`;
            }
            lancerCombat();
            return;  // Arrêter l'exécution de la fonction, donc pas besoin de message d'erreur

        default:
            message = "Choix non reconnu.";
    }

    console.log("Message à afficher : ", message);
    messageElement.innerText = message;  // Mise à jour du texte de messageElement
    messageElement.style.display = 'inline';  // Assurer l'affichage du message
}

function lancerCombat() {
    // Masquer tous les conteneurs de combat
    const container1 = document.getElementById('container1');
    const container2 = document.getElementById('container2');
    const container3 = document.getElementById('container3');

    // Vider le contenu des conteneurs
    container1.innerHTML = '';
    container2.innerHTML = '';
    container3.innerHTML = '';

    // Masquer tous les conteneurs avant de les afficher
    container1.style.display = 'none';
    container2.style.display = 'none';
    container3.style.display = 'none';

    // Afficher les conteneurs de combat
    container1.style.display = 'flex'; // Affiche le conteneur 1
    container2.style.display = 'flex'; // Affiche le conteneur 2
    container3.style.display = 'flex'; // Affiche le conteneur 3

    // Masquer le magasin
    document.getElementById('magasin').style.display = 'none';

    // Afficher le conteneur de combat
    document.getElementById('combatContainers').style.display = 'flex';

    // Afficher le choix de combat
    document.getElementById('choix_combat').style.display = 'block';

    // Affiche le contenu des conteneurs
    afficherContainer1();
    afficherContainer2();
    afficherContainer3();
}

function afficherContainer1() {
    // Référence à container1
    const container1 = document.getElementById('container1');
    if (Joueur.hp > Joueur.hpmax) {Joueur.hp = Joueur.hpmax};
    if (Joueur.Mana > Joueur.manamax) {Joueur.Mana = Joueur.manamax};
    // Créer container1-1 pour afficher le skin du joueur
    const container1_1 = document.createElement('div');
    container1_1.id = 'container1-1';
    container1_1.style.fontSize = '3em'; // Pour rendre le skin plus grand
    container1_1.innerText = Joueur.skin; // Affiche le skin (texte) du joueur
    container1.appendChild(container1_1);

    // Créer container1-2 pour afficher les informations du joueur
    const container1_2 = document.createElement('div');
    container1_2.id = 'container1-2';

    // Insérer le contenu des statistiques du joueur
    container1_2.innerHTML = `
        <p>Vie : ${Joueur.hp} / ${Joueur.hpmax} ❤️ &nbsp;&nbsp; Mana : ${Joueur.Mana}/${Joueur.manamax}💧</p>
        <p>Dégâts actuels entre ${Joueur.mini_atk_joueur} et ${Joueur.max_atk_joueur}</p>
        <p>Nombre de potions restantes : ${Joueur.nb_de_potion}</p>
        <p>Les potions te rendent entre ${Joueur.min_hp_potion} et ${Joueur.hpmax} points de vie</p>
    `;

    // Ajouter container1-2 à container1
    container1.appendChild(container1_2);
}

function afficherContainer2() {
    const container2 = document.getElementById('container2');

    // Créer container2-1 pour afficher le skin de l'ennemi
    const container2_1 = document.createElement('div');
    container2_1.id = 'container2-1';
    container2_1.style.fontSize = '3em'; // Taille similaire au skin du joueur
    if (skin_ennemi === '🦕'){
        container2_1.style.fontSize = '11em';
    }
    container2_1.innerText = skin_ennemi; // Affiche le skin (texte) de l'ennemi
    container2.appendChild(container2_1);

    // Créer container2-2 pour afficher les informations de l'ennemi
    const container2_2 = document.createElement('div');
    container2_2.id = 'container2-2';

    // Insérer le contenu des statistiques de l'ennemi
    container2_2.innerHTML = `
        <p>Vie : ${vie_ennemi}</p>
        <p>Dégâts : entre ${mini_atk_ennemi} et ${max_atk_ennemi}</p>
    `;

    // Ajouter container2-2 à container2
    container2.appendChild(container2_2);
}

function afficherContainer3() {
    const container3 = document.getElementById('container3');

    // Vérifier si gainKill existe, sinon le créer
    let gainKill = document.getElementById('gainKill');
    if (!gainKill) {
        gainKill = document.createElement('div');  // Créer gainKill s'il n'existe pas
        gainKill.id = 'gainKill';
        document.body.appendChild(gainKill);  // L'ajouter au DOM
    }

    // Afficher le gainKill
    gainKill.style.display = 'none';
    gainKill.innerHTML = '';  // Vider le contenu actuel de container4

    // Calculer et afficher le score
    const gainKillor = document.createElement('p');
    gainKillor.innerText = `Vous avez trouvé ${(1+Joueur.nb_de_kill)*(5 + bonusOr)} 💰 et ${1 + bonusEssence} 🌺`;
    gainKill.appendChild(gainKillor);

    // Création du bouton "Attaque"
    const boutonAttaque = document.createElement('button');
    boutonAttaque.id = 'boutonAttaque'; // Ajoutez un id au bouton
    boutonAttaque.innerText = "Attaque";
    boutonAttaque.onclick = () => {
        attaque();
        // Appeler une fonction pour gérer l'attaque
        console.log("Attaque lancée !");
    };

    // Création du bouton "Bois une potion"
    const boutonPotion = document.createElement('button');
    boutonPotion.innerText = `Bois une potion (récupère entre ${Joueur.min_hp_potion}❤️ et ${Joueur.hpmax}❤️)`;
    boutonPotion.onclick = () => {
        boire_potion();
        console.log("Potion bue!");
    };

    // Création du bouton "Sort"
    const boutonLanceSort = document.createElement('button');
    boutonLanceSort.id = 'boutonLanceSort'; // Ajoutez un id au bouton
    boutonLanceSort.innerText = "Lance un sort";
    boutonLanceSort.onclick = () => {
        OuvrirGrimoireCombat();
        console.log("Ouvre le grimoire lancée !");
    };

    const boutonSuite = document.createElement('button');
    boutonSuite.innerText = 'Tu as gagné !';
    boutonSuite.onclick = () => {
        jeuCoffre();

    };


    const boutonFin = document.createElement('button');
    boutonFin.innerText = "Ouch tu es mort...";
    boutonFin.onclick = () => {
        calculscore();

    };

    const boutonRetourMagasin = document.createElement('button');
    boutonRetourMagasin.innerText = "Retour Magasin";
    boutonRetourMagasin.onclick = () => {
        retourMagasin();
        document.body.style.backgroundImage = `url('../static/images/chateau.jpg')`;
    };

    // Ajouter les boutons au container3
    if (Joueur.hp <= 0) {
        container3.appendChild(boutonFin);
    } else if (skin_ennemi === '☠️'){
        container3.appendChild(boutonRetourMagasin);
    } else if (vie_ennemi <= 0) {
        container3.appendChild(boutonSuite);
        container3.appendChild(gainKill);
        gainKill.style.display = 'block';
    } else if (vie_ennemi > 0) {
        container3.appendChild(boutonAttaque);
        container3.appendChild(boutonLanceSort);
        if (Joueur.hp < Joueur.hpmax) {
            container3.appendChild(boutonPotion);
        }
    }
}

function attaque() {
    if (skin_ennemi === '🦕'){jouerSonBossEntree2();}

    const container1_1 = document.getElementById('container1-1'); // Skin du joueur
    const container2_1 = document.getElementById('container2-1'); // Skin de l'ennemi
    const boutonAttaque = document.getElementById('boutonAttaque'); // Bouton d'attaque

    // Désactive le bouton d'attaque pour empêcher le spam
    boutonAttaque.disabled = true;
    jouerFrappeJoueur();
    const angleRotation = 45;
    const degatsEnnemi = randomBetween(Joueur.mini_atk_joueur, Joueur.max_atk_joueur);
    vie_ennemi -= degatsEnnemi;

    // Sauvegarde le skin actuel de l'ennemi
    const skinOriginalEnnemi = container2_1.innerText;

    // Créer un span pour afficher les dégâts temporairement
    container2_1.style.position = 'relative';
    const degatsSpan1 = document.createElement('span');
    degatsSpan1.innerText = `-${degatsEnnemi}`;
    degatsSpan1.style.fontSize = '100px';
    degatsSpan1.style.color = 'red';
    degatsSpan1.style.position = 'absolute';
    degatsSpan1.style.top = '0';
    degatsSpan1.style.left = '0';

    // Ajouter le span des dégâts dans le container du joueur
    container2_1.appendChild(degatsSpan1);

    // Applique la rotation au joueur
    container1_1.style.transition = 'transform 0.3s ease';
    container1_1.style.transform = `rotate(${angleRotation}deg)`;

    // Remet la rotation et restaure le skin de l'ennemi après 0.2s
    setTimeout(() => {
        container1_1.style.transform = 'rotate(0deg)';
        container2_1.innerText = skinOriginalEnnemi; // Restaure le skin de l'ennemi
        container2_1.style.color = ''; // Remet la couleur par défaut
        //container2_1.removeChild(degatsSpan1); // Supprime le span des dégâts

        // Vérifie si l'ennemi est mort après l'attaque
        if (vie_ennemi <= 0) {
            vie_ennemi = 0;
            skin_ennemi = (skin_ennemi === '🦕') ? '☠️' : '💀';
            jouerSonOsCasse();
            updateContainers();
            mort_ennemi();
            boutonAttaque.disabled = false; // Réactive le bouton en cas de fin du jeu
            return;
        }
        updateContainers();
        // Pause avant la riposte de l'ennemi
        setTimeout(() => {

            if (skin_ennemi === '🦕'){
                jouerSonBoss();
            } else {
                jouerSonCoupVentre();
            }
            const NangleRotation = -45;
            let degatsJoueur = 0;
            if (Joueur.Invincible > 0) {Joueur.Invincible -= 1;
            } else {degatsJoueur = randomBetween(mini_atk_ennemi, max_atk_ennemi);}
            Joueur.hp -= degatsJoueur;

            // Sauvegarde le skin actuel du joueur
            const skinOriginalJoueur = container1_1.innerText;
            // Créer un span pour afficher les dégâts temporairement
            const degatsSpan = document.createElement('span');
            degatsSpan.innerText = `-${degatsJoueur}`;
            degatsSpan.style.fontSize = '100px';
            degatsSpan.style.color = 'red';
            degatsSpan.style.position = 'absolute';
            degatsSpan.style.top = '0';
            degatsSpan.style.left = '0';

            // Ajouter le span des dégâts dans le container du joueur
            container1_1.appendChild(degatsSpan);

            // Applique la rotation à l'ennemi
            container2_1.style.transition = 'transform 0.3s ease';
            container2_1.style.transform = `rotate(${NangleRotation}deg)`;

            // Remet la rotation et restaure le skin du joueur après 0.2s
            setTimeout(() => {
                container2_1.style.transform = 'rotate(0deg)';
                container1_1.innerText = skinOriginalJoueur; // Restaure le skin du joueur
                container1_1.style.color = ''; // Remet la couleur par défaut
                //container1_1.removeChild(degatsSpan); // Supprime le span des dégâts

                // Vérifie si le joueur est mort après la riposte
                if (Joueur.hp <= 0) {
                    Joueur.hp = 0;
                    jouerSonMortJoueur();
                    Joueur.skin = '💀';
                    updateContainers();
                    boutonAttaque.disabled = false; // Réactive le bouton en cas de fin du jeu
                    return;
                }

                updateContainers();
                // Réactive le bouton d'attaque après la fin de l'animation de riposte
                boutonAttaque.disabled = false;
            }, 300);
        }, 300);
    }, 300);
    if (Joueur.Invincible === 0) {Joueur.Mana += 1;}
    mettreAJourMana();
}

function updateContainers() {
    // Utilise une condition pour afficher le skin de mort si la vie est à 0
    document.getElementById('container1-1').innerText = Joueur.hp <= 0 ? '💀' : Joueur.skin;
    document.getElementById('container2-1').innerText = vie_ennemi <= 0 ? '💀' : skin_ennemi;
    if (Joueur.hp > Joueur.hpmax) {Joueur.hp = Joueur.hpmax};
    if (Joueur.Mana > Joueur.manamax) {Joueur.Mana = Joueur.manamax};
    if (vie_ennemi < 0) {vie_ennemi = 0};
    // Met à jour le conteneur du joueur
    document.getElementById('container1-2').innerHTML = `
        <p>Vie : ${Joueur.hp} / ${Joueur.hpmax} ❤️ &nbsp;&nbsp; Mana : ${Joueur.Mana}/${Joueur.manamax}💧</p>
        <p>Dégâts actuels entre ${Joueur.mini_atk_joueur} et ${Joueur.max_atk_joueur}</p>
        <p>Nombre de potions restantes : ${Joueur.nb_de_potion}</p>
        <p>Les potions te rendent entre ${Joueur.min_hp_potion} et ${Joueur.hpmax} points de vie</p>
    `;

    // Met à jour le conteneur de l'ennemi
    document.getElementById('container2-2').innerHTML = `
        <p>Vie : ${vie_ennemi}</p>
        <p>Dégâts : entre ${mini_atk_ennemi} et ${max_atk_ennemi}</p>
    `;

    const container3 = document.getElementById('container3');
    container3.innerHTML = '';
    afficherContainer3();
}

function retourMagasin() {
    // Masquer les conteneurs de combat s'ils existent
    const container1 = document.getElementById('container1');
    const container2 = document.getElementById('container2');
    const container3 = document.getElementById('container3');
    const jeuDiv = document.getElementById('jeu-coffre');

    if (jeuDiv) jeuDiv.remove();

    document.getElementById('magasin').style.display = 'inline-block';
    document.getElementById("montantOr").textContent = Joueur.or + " 💰";
    document.getElementById('or-actuel').style.display = 'block';

    if (container1) {
        container1.style.display = 'none'; // Masquer le conteneur 1
    }
    if (container2) {
        container2.style.display = 'none'; // Masquer le conteneur 2
    }
    if (container3) {
        container3.style.display = 'none'; // Masquer le conteneur 3
    }

    if (gainKill) {
        gainKill.style.display = 'none';
    }

    // Mettre à jour l'affichage des boutons du magasin
    document.getElementById('magasin').style.display = 'block';
}

function mort_ennemi() {
    max_atk_ennemi = max_atk_ennemi_base;
    mini_atk_ennemi = mini_atk_ennemi_base;

    Joueur.nb_de_kill += 1;
    if (skin_ennemi === '☠️') { // Gain si c'est le boss qui meurt
        // Gain en minimum d'attaque
        Joueur.lvl += 5;
        const ajoutAtkMin1 = Math.floor(Math.random() * 11) + 5;  // Entre 5 et 15
        Joueur.mini_atk_joueur += ajoutAtkMin1;
        // Vérifier que Joueur.mini_atk_joueur ne dépasse pas Joueur.max_atk_joueur
        if (Joueur.mini_atk_joueur > Joueur.max_atk_joueur) {
            Joueur.max_atk_joueur = Joueur.mini_atk_joueur;
        }
        const boutonAugMiniAtk1 = document.querySelector('.magasin button[data-id="4"]');
        boutonAugMiniAtk1.innerText = `Pour ${cout_mini_atk}💰 : +${2 + bonusAtk} à ton minimum d'attaque (actuellement ${Joueur.mini_atk_joueur}⚔️)`;
        const boutonAugMaxAtk1 = document.querySelector('.magasin button[data-id="2"]');
        boutonAugMaxAtk1.innerText = `Pour ${cout_atk_max}💰 : +${2 + bonusAtk} à ton maximum d'attaque (actuellement ${Joueur.max_atk_joueur}⚔️)`;
        gain1 = `gain de ${ajoutAtkMin1} en minimum d'attaque⚔️`;
        // Gain en maximum d'attaque
        const ajoutAtkMax1 = Math.floor(Math.random() * 16) + 15;
        Joueur.max_atk_joueur += ajoutAtkMax1;
        const boutonAugMaxAtk2 = document.querySelector('.magasin button[data-id="2"]');
        boutonAugMaxAtk2.innerText = `Pour ${cout_atk_max}💰 : +${2 + bonusAtk} à ton maximum d'attaque (actuellement ${Joueur.max_atk_joueur}⚔️)`;
        gain2 = `gain de ${ajoutAtkMax1} en maximum d'attaque 🗡️`;
        // Gain en vie minimum pour la potion
        const ajoutHpPotion1 = Math.floor(Math.random() * 16) + 15;  // Entre 5 et 20
        Joueur.min_hp_potion += ajoutHpPotion1;
        gain3 = `gain de ${ajoutHpPotion1} ❤️ de vie au minimum de la potion`;
        // Gain de potions et d'or
        const ajoutPotions1 = 10;
        const ajoutOr1 = Math.floor(Math.random() * 51) + 150 + (50 * Joueur.nb_de_kill);  // Entre 50 et 100 + bonus
        Joueur.nb_de_potion += ajoutPotions1;
        Joueur.or += ajoutOr1;
        Joueur.montantEssence += 10;
        gain4 = `${ajoutPotions1} potions 🥤 + ${ajoutOr1} d'or💰 + 10 Essences 🌺`;

        // Définit le contenu du bloc avec les variables, chaque variable sur une ligne
        const container2_2 = document.getElementById('container2-2');
        container2_2.innerHTML = `
            <p>${gain1}</p>
            <p>${gain2}</p>
            <p>${gain3}</p>
            <p>${gain4}</p>
        `;

        if (musiqueActuelle !== sonVillage) {

            SonBossEntree1.pause();
            jouerSonVillage();
        }


    } else {
        Joueur.or += Joueur.nb_de_kill*(5 + bonusOr);
        Joueur.montantEssence += 1 + bonusEssence;
        Joueur.lvl += 1;
    }
    document.getElementById("Joueur.montantEssence").textContent = Joueur.montantEssence + " 🌺";
    document.getElementById("montantOr").textContent = Joueur.or + " 💰";

}

function calculscore() {
    // Vérifier et masquer les trois premiers conteneurs
    if (container1) container1.style.display = 'none';
    if (container2) container2.style.display = 'none';
    if (container3) container3.style.display = 'none';

    // Vérifier si container4 existe, sinon le créer
    let container4 = document.getElementById('container4');
    if (!container4) {
        container4 = document.createElement('div');  // Créer container4 s'il n'existe pas
        container4.id = 'container4';
        document.body.appendChild(container4);  // L'ajouter au DOM
    }

    // Afficher le container4
    container4.style.display = 'block';
    container4.innerHTML = '';  // Vider le contenu actuel de container4

    // Calculer et afficher le score
    const score = (Joueur.nb_de_kill * 50) + Joueur.nb_de_potion;
    const scoreText = document.createElement('p');
    scoreText.innerText = `Ton score est de ${score} points`;
    container4.appendChild(scoreText);

    // Appeler la fonction pour enregistrer le score
    console.log('lancement de la fonction enregistrer')
    //enregistrerScore(nomJoueur, Joueur.nb_de_kill);  // Appel de la fonction avec nomJoueur et Joueur.nb_de_kill
    console.log('fin de la fonction enregistrer')
    // Créer le bouton de recommencement
    const boutonRecommence = document.createElement('button');
    boutonRecommence.innerText = "Veux-tu recommencer ?";
    boutonRecommence.onclick = () => {
        container4.style.display = 'none';
        container1.innerHTML = '';  // Vider container1 pour repartir
        container2.innerHTML = '';  // Vider container2 pour repartir
        container3.innerHTML = '';  // Vider container3 pour repartir
        container4.innerHTML = '';  // Vider container4 pour repartir

        console.log("Réinitialisation du jeu terminée");
        InitialiseValeur();
        saisirNom();
    };

    // Ajouter le bouton au container4
    container4.appendChild(boutonRecommence);
}

function boire_potion() {
    jouerSonPotion();
    if (Joueur.nb_de_potion > 0) { // Vérifier si le joueur a des potions
        // Générer une potion aléatoire
        const potion = randomBetween(Joueur.min_hp_potion,Joueur.hpmax)

        // Réduire le nombre de potions
        Joueur.nb_de_potion -= 1;

        // Augmenter la vie du joueur
        Joueur.hp += potion;

        // Vérifier si la vie du joueur dépasse le maximum
        if (Joueur.hp > Joueur.hpmax) {
            Joueur.hp = Joueur.hpmax; // Réinitialiser à Joueur.hpmax si besoin
        }

    } else {
        console.log("Vous n'avez plus de potions à boire !");
    }
    updateContainers();
}

function ajusterLargeurBoutonsMagasin() {
    const boutons = document.querySelectorAll('.magasin button');
    let maxLargeur = 500;

    // Calculer la largeur maximale des boutons
    boutons.forEach((bouton) => {
        bouton.style.width = 'auto'; // Ajuste automatiquement la largeur
        maxLargeur = Math.max(maxLargeur, bouton.offsetWidth);
    });

    // Applique cette largeur maximale à tous les boutons
    boutons.forEach((bouton) => {
        bouton.style.width = `${maxLargeur}px`;
    });

}

// Appelle cette fonction une fois les boutons chargés
window.onload = ajusterLargeurBoutonsMagasin;

function jeuCoffre() {
    // Génère un nombre aléatoire entre 1 et 6
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    document.body.style.backgroundImage = `url('../static/images/salleOr${randomNumber}.jpg')`;
    // 1. Vérifier et cacher le magasin et les conteneurs 1, 2 et 3 + autre
    const magasinDiv = document.getElementById('magasin');
    if (magasinDiv.style.display === 'inline-block') {
        magasinDiv.style.display = 'none';
    }

    const containers = [1, 2, 3].map(num => document.getElementById(`container${num}`));
    containers.forEach(container => {
        if (container) container.style.display = 'none';
    });

    let gainKill = document.getElementById('gainKill');
    if (gainKill){
        if (gainKill.style.display === 'block') {
            gainKill.style.display = 'none';
        }
    }
    // 2. Créer l'interface de jeu de coffre
    const jeuDiv = document.createElement('div');
    jeuDiv.id = 'jeu-coffre';
    const regle = document.createElement('h4');
    regle.innerText = 'Choisis un des trois coffres';
    jeuDiv.appendChild(regle);
    document.body.appendChild(jeuDiv);



    // 3. Définir les coffres et le gagnant
    const coffreButtons = [];
    const coffreGagnant = Math.floor(Math.random() * 3);

    // 4. Créer et afficher les trois boutons de coffres
    for (let i = 0; i < 3; i++) {
        const coffreButton = document.createElement('button');
        coffreButton.innerText = '💼';  // Symbole d'un coffre fermé
        coffreButton.style.fontSize = '50px';
        coffreButton.style.margin = '10px';
        coffreButton.dataset.index = i;
        coffreButton.onclick = () => verifierCoffre(i, coffreGagnant, coffreButtons, messageDiv);
        jeuDiv.appendChild(coffreButton);
        coffreButtons.push(coffreButton);
    }
        // Texte de message
    const messageDiv = document.createElement('p');
    messageDiv.id = 'message-coffre';
    messageDiv.style.fontSize = '20px';
    jeuDiv.appendChild(messageDiv);
    document.getElementById("montantOr").textContent = Joueur.or;

    //Mise à jour des valeurs dans le magasin
    const boutonMag1 = document.querySelector('.magasin button[data-id="1"]');
    const boutonMag2 = document.querySelector('.magasin button[data-id="2"]');
    const boutonMag4 = document.querySelector('.magasin button[data-id="4"]');

    boutonMag1.innerText = `Pour ${cout_hp_max}💰 : +10 sur ton max d'hp (actuellement ${Joueur.hpmax} ❤️)`;
    boutonMag2.innerText = `Pour ${cout_atk_max}💰 : +${2 + bonusAtk} à ton maximum d'attaque (actuellement ${Joueur.max_atk_joueur}⚔️)`;
    boutonMag4.innerText = `Pour ${cout_mini_atk}💰 : +${2 + bonusAtk} à ton minimum d'attaque (actuellement ${Joueur.mini_atk_joueur}⚔️)`;

}

function verifierCoffre(coffreClique, coffreGagnant, coffreButtons, messageDiv) {

    // 1. Révéler tous les coffres
    coffreButtons.forEach((button, index) => {
        // Créer un conteneur pour les émoticônes
        const emojiContainer = document.createElement('div');
        emojiContainer.style.position = 'relative'; // Positionner relativement
        emojiContainer.style.display = 'inline-block'; // Affichage en ligne

        // Ajouter l'émoticône du coffre
        const coffreEmoji = document.createElement('span');
        coffreEmoji.innerText = '💼'; // Coffre
        coffreEmoji.style.fontSize = '50px';

        // Ajouter l'émoticône de perte ou de gain
        const resultEmoji = document.createElement('span');
        resultEmoji.innerText = (index === coffreGagnant) ? '💰' : '❌'; // Gagnant ou perdant
        resultEmoji.style.fontSize = '50px';
        resultEmoji.style.position = 'absolute'; // Position absolue
        resultEmoji.style.top = '0'; // Ajuste la position verticale
        resultEmoji.style.left = '0'; // Ajuste la position horizontale

        // Ajouter les émoticônes au conteneur
        emojiContainer.appendChild(coffreEmoji);
        emojiContainer.appendChild(resultEmoji);

        // Ajouter le conteneur au bouton
        button.innerHTML = ''; // Vider le contenu du bouton
        button.appendChild(emojiContainer);
    });

    // Désactiver les boutons
    for (let button of coffreButtons) {
        button.disabled = true; // Cela rend le bouton non cliquable
    }

    // 2. Message en fonction du résultat
    if (coffreClique === coffreGagnant) {
        jouerSonCoins();
        jouerSonYes();
        messageDiv.style.fontSize = '40px';
        recompense();
        messageDiv.innerText = `Tu obtiens un bonus de : ${gain}  🎉!!`;


    } else {
        jouerSonEchec();
        messageDiv.style.fontSize = '40px';
        messageDiv.innerHTML = "Dommage, mauvais coffre 😢 <br> Peut être auras tu plus de chance la prochaine fois...";
    }

    // 3. Créer le bouton de retour au magasin
    const retourButton = document.createElement('button');
    retourButton.innerText = 'Retour magasin';
    retourButton.onclick = () => {
        retourMagasin();
        document.body.style.backgroundImage = `url('../static/images/chateau.jpg')`;
    };
    retourButton.style.display = 'block';
    retourButton.style.marginTop = '20px';
    retourButton.style.fontSize = '20px';

    // Ajoute le texte et le bouton de retour sous le message
    messageDiv.appendChild(retourButton);
}

function recompense() {
    // Générer un numéro aléatoire entre 1 et 6
    const numero = Math.floor(Math.random() * 6) + 1;

    if (numero === 1) {
        // Gain en minimum d'attaque
        const ajoutAtkMin = Math.floor(Math.random() * 11) + 5;  // Entre 5 et 15
        Joueur.mini_atk_joueur += ajoutAtkMin;

        // Vérifier que Joueur.mini_atk_joueur ne dépasse pas Joueur.max_atk_joueur
        if (Joueur.mini_atk_joueur > Joueur.max_atk_joueur) {
            Joueur.max_atk_joueur = Joueur.mini_atk_joueur;
        }
        const boutonAugMiniAtk = document.querySelector('.magasin button[data-id="4"]');
        boutonAugMiniAtk.innerText = `Pour ${cout_mini_atk}💰 : +${2 + bonusAtk} à ton minimum d'attaque (actuellement ${Joueur.mini_atk_joueur}⚔️)`;
        const boutonAugMaxAtk = document.querySelector('.magasin button[data-id="2"]');
        boutonAugMaxAtk.innerText = `Pour ${cout_atk_max}💰 : +${2 + bonusAtk} à ton maximum d'attaque (actuellement ${Joueur.max_atk_joueur}⚔️)`;

        gain = `gain de ${ajoutAtkMin} en minimum d'attaque⚔️`;

    } else if (numero === 2) {
        // Gain en maximum d'attaque
        const ajoutAtkMax = Math.floor(Math.random() * 16) + 5;  // Entre 5 et 20
        Joueur.max_atk_joueur += ajoutAtkMax;
        const boutonAugMaxAtk = document.querySelector('.magasin button[data-id="2"]');
        boutonAugMaxAtk.innerText = `Pour ${cout_atk_max}💰 : +${2 + bonusAtk} à ton maximum d'attaque (actuellement ${Joueur.max_atk_joueur}⚔️)`;
        gain = `gain de ${ajoutAtkMax} en maximum d'attaque 🗡️`;

    } else if (numero === 3) {
        // Gain en vie minimum pour la potion
        const ajoutHpPotion = Math.floor(Math.random() * 16) + 5;  // Entre 5 et 20
        Joueur.min_hp_potion += ajoutHpPotion;
        Joueur.hpmax += 25;
        gain = `gain de ${ajoutHpPotion} ❤️🥤 de vie au minimum que rend une potion et +25❤️  à ton maximum de vie`;

    } else if (numero === 4) {
        // Gain de potions et d'or
        const ajoutPotions = 5;
        const ajoutOr = Math.floor(Math.random() * 51) + 50 + (50 * Joueur.nb_de_kill);  // Entre 50 et 100 + bonus
        Joueur.nb_de_potion += ajoutPotions;
        Joueur.or += ajoutOr;
        gain = `${ajoutPotions} potions 🥤 + ${ajoutOr} d'or💰`;
    } else {
        const AjoutEssence = Math.floor(Math.random() * 5) + 5;
        Joueur.montantEssence += AjoutEssence;
        gain = `${AjoutEssence} Essences 🌺`
    }
    document.getElementById("Joueur.montantEssence").textContent = Joueur.montantEssence + " 🌺";

}

function OuvrirGrimoireMagasin() {
    // Récupère ou crée l'élément de fond pour le grimoire
    const grimoireContainer = document.createElement('div');
    grimoireContainer.id = 'grimoire-container';
    grimoireContainer.style.position = 'fixed';
    grimoireContainer.style.top = '0';
    grimoireContainer.style.left = '0';
    grimoireContainer.style.width = '100%';
    grimoireContainer.style.height = '100%';
    grimoireContainer.style.backgroundImage = "url('../static/images/grimoire.jpg')";
    grimoireContainer.style.backgroundSize = 'contain';
    grimoireContainer.style.backgroundPosition = 'center';
    grimoireContainer.style.backgroundRepeat = 'no-repeat';
    grimoireContainer.style.zIndex = '100'; // au-dessus de l'interface du magasin
    document.body.appendChild(grimoireContainer);

    // Ajouter le texte centré
    const instructionText = document.createElement('div');
    instructionText.id = 'instruction-text';
    instructionText.classList.add('center-text-grimoire');
    instructionText.innerText = `Clique sur un sort pour l'améliorer Essence : ${Joueur.montantEssence} 🌺`;
    grimoireContainer.appendChild(instructionText);

    // Crée le bouton de retour au magasin
    const boutonRetour = document.createElement('button');
    boutonRetour.id = 'bouton-retour-magasin';
    boutonRetour.innerText = "Retour au magasin";
    boutonRetour.classList.add('bouton-retour-magasin-via-grimoire');
    grimoireContainer.appendChild(boutonRetour);

    // Ajoute un événement de clic pour revenir au magasin
    boutonRetour.addEventListener('click', () => {
        grimoireContainer.style.display = 'none'; // Cache le grimoire

    });

    // Création des quatre containers pour les sorts
    for (let i = 1; i <= 4; i++) {
        const sortContainer = document.createElement('div');
        sortContainer.id = `sort-container-${i}`;
        sortContainer.classList.add('sort-container');

        // Styles par défaut des containers (position, taille)
        sortContainer.style.position = 'absolute';
        sortContainer.style.cursor = 'pointer';

        // Taille du container (ajuster si besoin)
        sortContainer.style.width = '25%';
        sortContainer.style.height = '25%';

        // Tooltip description
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip', `tooltip-sort${i}`); // Ajoute une classe unique pour chaque sort


        if (i === 1) {
            tooltip.innerHTML = `<div class="tooltip-title">REGEN</div>
            <div class="tooltip-description">Rend ${Sorts[1].Resultat}% de ta vie</div>`;
            sortContainer.appendChild(tooltip);
        }
        if (i === 2) {
            tooltip.innerHTML = `<div class="tooltip-title">INVINCIBLE</div>
            <div class="tooltip-description">Pas de dommage pendant ${Sorts[2].Resultat} tours</div>`;
            sortContainer.appendChild(tooltip);
        }
        if (i === 3) {
            tooltip.innerHTML = `<div class="tooltip-title">FLECHE</div>
            <div class="tooltip-description">Lance une flèche infligeant ${Sorts[3].Resultat} fois tes dégâts maximum</div>`;
            sortContainer.appendChild(tooltip);
        }
        if (i === 4) {
            tooltip.innerHTML = `<div class="tooltip-title">MALEDICTION</div>
            <div class="tooltip-description">Réduit les dégâts de l'ennemi de ${Sorts[4].Resultat}% jusqu'à la fin du combat</div>`;
            sortContainer.appendChild(tooltip);
        }


        // Positionnement spécifique pour chaque sort (en pourcentage pour que cela reste dynamique)
        switch (i) {
    case 1:
        console.log('on a clic sur le sort 1');
        sortContainer.style.top = '10%';  // Position en haut à gauche
        sortContainer.style.left = '25%';
        sortContainer.addEventListener('click', function() { SortMagasin(1); });
        instructionText.innerText = `Clique sur un sort pour l'améliorer Essence : ${Joueur.montantEssence} 🌺`;
        break;
    case 2:
        console.log('on a clic sur le sort 2');
        sortContainer.style.top = '10%';  // Position en haut à droite
        sortContainer.style.right = '25%';
        sortContainer.addEventListener('click', function() { SortMagasin(2); });
        instructionText.innerText = `Clique sur un sort pour l'améliorer Essence : ${Joueur.montantEssence} 🌺`;
        break;
    case 3:
        console.log('on a clic sur le sort 3');
        sortContainer.style.bottom = '30%'; // Position en bas à gauche
        sortContainer.style.left = '25%';
        sortContainer.addEventListener('click', function() { SortMagasin(3); });
        instructionText.innerText = `Clique sur un sort pour l'améliorer Essence : ${Joueur.montantEssence} 🌺`;
        break;
    case 4:
        console.log('on a clic sur le sort 4');
        sortContainer.style.bottom = '30%'; // Position en bas à droite
        sortContainer.style.right = '25%';
        sortContainer.addEventListener('click', function() { SortMagasin(4); });
        instructionText.innerText = `Clique sur un sort pour l'améliorer Essence : ${Joueur.montantEssence} 🌺`;
        break;
}



        // Ajouter le container de sort au grimoire
        grimoireContainer.appendChild(sortContainer);
    }
}

function SortMagasin(sortId) {

    const sortData = Sorts[sortId]; // Récupère les données du sort correspondant

    // Vérifie si le sort a déjà été amélioré 5 fois
    if (sortData.Amelioration >= 5) {
        // Crée l'overlay pour bloquer les interactions
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '199'; // Derrière le message d'erreur, mais au-dessus du reste de l'interface
        document.body.appendChild(overlay);


        const maxContainer = document.createElement('div');
        maxContainer.id = 'sort-confirmation';
        maxContainer.style.position = 'fixed';
        maxContainer.style.top = '50%';
        maxContainer.style.left = '50%';
        maxContainer.style.transform = 'translate(-50%, -50%)';
        maxContainer.style.padding = '20px';
        maxContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        maxContainer.style.color = '#fff';
        maxContainer.style.borderRadius = '10px';
        maxContainer.style.textAlign = 'center';
        maxContainer.style.zIndex = '200';

        // Texte d'alerte pour le maximum atteint
        maxContainer.innerHTML = `
            <p>Vous avez atteint le maximum pour ce sort !</p>
            <button id="return-button">Retour</button>
        `;

        document.body.appendChild(maxContainer);

        document.getElementById('return-button').addEventListener('click', () => {
            document.body.removeChild(maxContainer); // Supprime le container
            document.body.removeChild(overlay);
        });

        return;
    }

    // Création du container de confirmation d'amélioration
    // Crée l'overlay pour bloquer les interactions
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '199'; // Derrière le message d'erreur, mais au-dessus du reste de l'interface
    document.body.appendChild(overlay);


    const confirmationContainer = document.createElement('div');
    confirmationContainer.id = 'sort-confirmation';
    confirmationContainer.style.position = 'fixed';
    confirmationContainer.style.top = '50%';
    confirmationContainer.style.left = '50%';
    confirmationContainer.style.transform = 'translate(-50%, -50%)';
    confirmationContainer.style.padding = '20px';
    confirmationContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    confirmationContainer.style.color = '#fff';
    confirmationContainer.style.borderRadius = '10px';
    confirmationContainer.style.textAlign = 'center';
    confirmationContainer.style.zIndex = '200';

    // Texte de confirmation spécifique au sort
    const descriptionMap = {
        1: `Augmente de +10% pour ${sortData.Cout} essence 🌺?`,
        2: `Ajoute 1 tour pour ${sortData.Cout} essence 🌺?`,
        3: `Ajoute 1 fois les dégâts max pour ${sortData.Cout} essence 🌺?`,
        4: `Réduit de 10% de plus pour ${sortData.Cout} essence 🌺?`
    };

    confirmationContainer.innerHTML = `
        <p>${descriptionMap[sortId]}</p>
        <button id="confirm-upgrade">Oui</button>
        <button id="cancel-upgrade">Non</button>
    `;

    document.body.appendChild(confirmationContainer);

    // Boutons d'action
    document.getElementById('confirm-upgrade').addEventListener('click', () => {
        if ((Joueur.montantEssence - sortData.Cout) >= 0) {
            Joueur.montantEssence -= sortData.Cout;
            sortData.Amelioration += 1;
            if (sortId === 1) {
                sortData.Resultat += 10;
                sortData.Cout += 2;
            }
            if (sortId === 2) {
                sortData.Resultat += 1;
                sortData.Cout += 10;
            }
            if (sortId === 3) {
                sortData.Resultat += 1;
                sortData.Cout += 5;
            }
            if (sortId === 4) {
                sortData.Resultat += 10;
                sortData.Cout += 2;
            }

            console.log(`Le sort sortData a été amélioré !`);
            // Mettre à jour tous les tooltips
            const tooltipUpdate = {
                1 : `REGEN`,
                2 : `INVINCIBLE`,
                3 : `FLECHE`,
                4 : `MALEDICTION`,
                5 : `Rend ${Sorts[1].Resultat}% de ta vie`,
                6 : `Pas de dommage pendant ${Sorts[2].Resultat} tours`,
                7 : `Lance une flèche infligeant ${Sorts[3].Resultat} fois tes dégâts maximum`,
                8 : `Réduit les dégâts de l'ennemi de ${Sorts[4].Resultat}% jusqu'à la fin du combat`
            };
            for (let i = 1; i <= 4; i++) {
                const tooltip = document.querySelector(`.tooltip-sort${i}`);
                tooltip.innerHTML = `
                    <div class="tooltip-title">${tooltipUpdate[i]}</div>
                    <div class="tooltip-description">${tooltipUpdate[i+4]}</div>
                `;
            }

            document.body.removeChild(confirmationContainer); // Supprime le container
            document.body.removeChild(overlay);
        } else {
            document.body.removeChild(confirmationContainer); // Supprime le container
            document.body.removeChild(overlay);
            // Créer le container pour l'alerte de manque d'essence
            const errorContainer = document.createElement('div');
            errorContainer.id = 'essence-error';
            errorContainer.style.position = 'fixed';
            errorContainer.style.top = '50%';
            errorContainer.style.left = '50%';
            errorContainer.style.transform = 'translate(-50%, -50%)';
            errorContainer.style.padding = '20px';
            errorContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            errorContainer.style.color = '#fff';
            errorContainer.style.borderRadius = '10px';
            errorContainer.style.textAlign = 'center';
            errorContainer.style.zIndex = '200';

            // Ajouter le message et le bouton retour dans le container
            errorContainer.innerHTML = `
                <p>Vous n'avez pas assez d'essence pour améliorer ce sort.</p>
                <button id="error-return-button">Retour</button>
            `;
            document.body.appendChild(errorContainer);

            // Ajouter l'événement pour fermer le message d'erreur
            document.getElementById('error-return-button').addEventListener('click', () => {
                document.body.removeChild(errorContainer); // Supprime le container
            });
        }
        document.getElementById("instruction-text").textContent = `Clique sur un sort pour l'améliorer Essence : ${Joueur.montantEssence} 🌺`;
        document.getElementById("Joueur.montantEssence").textContent = Joueur.montantEssence + " 🌺";

    });

    document.getElementById('cancel-upgrade').addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.removeChild(confirmationContainer); // Supprime le container
    });
}

function OuvrirGrimoireCombat() {
    // Récupère ou crée l'élément de fond pour le grimoire
    const grimoireContainer = document.createElement('div');
    grimoireContainer.id = 'grimoire-container';
    grimoireContainer.style.position = 'fixed';
    grimoireContainer.style.top = '0';
    grimoireContainer.style.left = '0';
    grimoireContainer.style.width = '100%';
    grimoireContainer.style.height = '100%';
    grimoireContainer.style.backgroundImage = "url('../static/images/grimoire.jpg')";
    grimoireContainer.style.backgroundSize = 'contain';
    grimoireContainer.style.backgroundPosition = 'center';
    grimoireContainer.style.backgroundRepeat = 'no-repeat';
    grimoireContainer.style.zIndex = '100';
    document.body.appendChild(grimoireContainer);

    // Ajouter le texte centré
    const instructionText = document.createElement('div');
    instructionText.id = 'instruction-text';
    instructionText.classList.add('center-text-grimoire');
    instructionText.innerText = `Clique sur un sort pour le lancer : ${Joueur.Mana} 💧`;
    grimoireContainer.appendChild(instructionText);

    // Bouton de retour
    const boutonRetour = document.createElement('button');
    boutonRetour.id = 'bouton-retour-combat';
    boutonRetour.innerText = "Retour au combat";
    boutonRetour.classList.add('bouton-retour');

    // Styles fixes du bouton
    boutonRetour.style.position = 'absolute';
    boutonRetour.style.bottom = '10%'; // Ajuster selon la position souhaitée
    boutonRetour.style.left = '50%';
    boutonRetour.style.transform = 'translateX(-50%)'; // Centrer horizontalement
    boutonRetour.style.padding = '5px 10px'; // Ajuste la taille du bouton si besoin

    grimoireContainer.appendChild(boutonRetour);

    boutonRetour.addEventListener('click', () => {
        grimoireContainer.style.display = 'none';
    });

    // Fonction pour afficher un message d'erreur si le mana est insuffisant
    function afficherErreurMana() {
        const errorContainer = document.createElement('div');
        errorContainer.style.position = 'fixed';
        errorContainer.style.top = '50%';
        errorContainer.style.left = '50%';
        errorContainer.style.transform = 'translate(-50%, -50%)';
        errorContainer.style.padding = '20px';
        errorContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        errorContainer.style.color = '#fff';
        errorContainer.style.borderRadius = '10px';
        errorContainer.style.textAlign = 'center';
        errorContainer.style.zIndex = '200';

        errorContainer.innerHTML = `
            <p>Vous n'avez pas assez de mana pour lancer ce sort.</p>
            <button id="error-return-button">Retour</button>
        `;

        document.body.appendChild(errorContainer);
        document.getElementById('error-return-button').addEventListener('click', () => {
            document.body.removeChild(errorContainer);
        });
    }

    function SortLance(sortId) {
        grimoireContainer.style.display = 'none';

        // Crée l'overlay pour bloquer les interactions
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '199'; // Derrière le message d'erreur, mais au-dessus du reste de l'interface
        document.body.appendChild(overlay);
        //document.body.removeChild(overlay);

        const errorContainer = document.createElement('div');
        errorContainer.style.position = 'fixed';
        errorContainer.style.top = '50%';
        errorContainer.style.left = '50%';
        errorContainer.style.transform = 'translate(-50%, -50%)';
        errorContainer.style.padding = '20px';
        errorContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        errorContainer.style.color = '#fff';
        errorContainer.style.borderRadius = '10px';
        errorContainer.style.textAlign = 'center';
        errorContainer.style.zIndex = '200';

        errorContainer.innerHTML = `
            <p><span style="font-size: 2em;">${Sorts[sortId].Animation}</span> <br> ${Sorts[sortId].getEffet()}</p>
            <button id="error-return-button">Retour</button>
        `;
        Sorts[sortId].Son();
        document.body.appendChild(errorContainer);
        document.getElementById('error-return-button').addEventListener('click', () => {
            document.body.removeChild(errorContainer);
            document.body.removeChild(overlay);
            Sorts[sortId].getResult();
            if (vie_ennemi <= 0) {
                vie_ennemi = 0;
                skin_ennemi = (skin_ennemi === '🦕') ? '☠️' : '💀';
                jouerSonOsCasse();
                updateContainers();
                mort_ennemi();
                boutonAttaque.disabled = false; // Réactive le bouton en cas de fin du jeu
                return;
            }
            updateContainers();
        });
    }

    // Création des quatre containers pour les sorts
    for (let i = 1; i <= 4; i++) {
        const sortContainer = document.createElement('div');
        sortContainer.id = `sort-container-${i}`;
        sortContainer.classList.add('sort-container');

        // Styles par défaut des containers
        sortContainer.style.position = 'absolute';
        sortContainer.style.cursor = 'pointer';
        sortContainer.style.width = '25%';
        sortContainer.style.height = '25%';

        // Tooltip description pour chaque sort
        const tooltipUpdate = {
                1 : `Rend ${Sorts[1].Resultat}% de ta vie <br>Coût : ${Sorts[1].CoutMana}💧`,
                2 : `Pas de dommage pendant ${Sorts[2].Resultat} tours <br>Coût : ${Sorts[2].CoutMana}💧`,
                3 : `Lance une flèche infligeant ${Sorts[3].Resultat} fois tes dégâts maximum <br>Coût : ${Sorts[3].CoutMana}💧`,
                4 : `Réduit les dégâts de l'ennemi de ${Sorts[4].Resultat}% jusqu'à la fin du combat <br>Coût : ${Sorts[4].CoutMana}💧`
            };
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip', `tooltip-sort${i}`);
        tooltip.innerHTML = `
            <div class="tooltip-title">${Sorts[i].Nom}</div>
            <div class="tooltip-description">${tooltipUpdate[i]}</div>
        `;
        sortContainer.appendChild(tooltip);

        // Positionnement spécifique pour chaque sort
        switch (i) {
            case 1:
                sortContainer.style.top = '10%';
                sortContainer.style.left = '25%';
                break;
            case 2:
                sortContainer.style.top = '10%';
                sortContainer.style.right = '25%';
                break;
            case 3:
                sortContainer.style.bottom = '30%';
                sortContainer.style.left = '25%';
                break;
            case 4:
                sortContainer.style.bottom = '30%';
                sortContainer.style.right = '25%';
                break;
        }

        // Ajouter un événement pour lancer le sort ou afficher l'erreur
        sortContainer.addEventListener('click', () => {
            if (Sorts[i].CoutMana <= Joueur.Mana) {
                console.log(`Lancement du sort ${Sorts[i].nom}`);
                Joueur.Mana -= Sorts[i].CoutMana; // Décompte du mana
                mettreAJourMana(); // Mettre à jour l'affichage du mana
                instructionText.innerText = `Clique sur un sort pour le lancer : ${Joueur.Mana} 💧`;
                updateContainers();
                SortLance(i)
            } else {
                afficherErreurMana();
            }
        });

        // Ajouter le container de sort au grimoire
        grimoireContainer.appendChild(sortContainer);
    }
}

function OuvrirInventaire() {
    // Créer un conteneur principal pour l'inventaire avec un arrière-plan semi-transparent
    const inventaireOverlay = document.createElement('div');
    inventaireOverlay.id = 'inventaire-overlay';
    inventaireOverlay.style.position = 'fixed';
    inventaireOverlay.style.top = '0';
    inventaireOverlay.style.left = '0';
    inventaireOverlay.style.width = '100%';
    inventaireOverlay.style.height = '100%';
    inventaireOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';  // Sombre pour désactiver l’arrière-plan
    inventaireOverlay.style.display = 'flex';
    inventaireOverlay.style.flexDirection = 'column';
    inventaireOverlay.style.alignItems = 'center';
    inventaireOverlay.style.justifyContent = 'center';
    inventaireOverlay.style.zIndex = '1000';  // Au-dessus des autres éléments
    document.body.appendChild(inventaireOverlay);

    // Conteneur principal de l'inventaire
    const inventaireContainer = document.createElement('div');
    inventaireContainer.id = 'inventaire-container';
    inventaireContainer.style.width = '90%';
    inventaireContainer.style.height = '90%';
    inventaireContainer.style.maxWidth = '700px';  // Limite pour grands écrans
    inventaireContainer.style.backgroundColor = '#333';
    inventaireContainer.style.borderRadius = '8px';
    inventaireContainer.style.overflowY = 'auto';
    inventaireContainer.style.padding = '20px';
    inventaireContainer.style.color = 'white';
    inventaireOverlay.appendChild(inventaireContainer);

    // Conteneur pour les sections gauche/droite
    const sectionsContainer = document.createElement('div');
    sectionsContainer.style.display = 'flex';
    sectionsContainer.style.flexDirection = 'row';
    sectionsContainer.style.justifyContent = 'space-between';
    sectionsContainer.style.height = '85%';
    sectionsContainer.style.marginBottom = '5px';
    inventaireContainer.appendChild(sectionsContainer);

    // Conteneur de gauche pour les caractéristiques
    const containerGauche = document.createElement('div');
    containerGauche.style.flex = '0.8';
    containerGauche.style.backgroundImage = "url('../static/images/fond_gris.jpg')";
    containerGauche.style.backgroundSize = 'cover';
    containerGauche.style.padding = '20px';
    containerGauche.style.marginRight = '10px';
    containerGauche.style.overflowY = 'auto';
    containerGauche.style.height = '100%';
    containerGauche.style.boxShadow = '0px 4px 10px rgba(10, 10, 10, 1)';
    containerGauche.style.fontSize = '2rem';  // Taille de texte réduite
    containerGauche.style.lineHeight = '1.2';    // Réduction de l'espacement entre lignes
    sectionsContainer.appendChild(containerGauche);

    // Affichage des caractéristiques du joueur
    const joueurStats = `
        <h2 style="margin: 15px 0; text-transform: uppercase; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">${Joueur.nom}</h2>
        <p style="margin: 3px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">Race : ${Joueur.race}</p>
        <p style="margin: 3px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">Niveau : ${Joueur.lvl}</p>
        <p style="margin: 3px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">Vie : ${Joueur.hp}/${Joueur.hpmax}</p>
        <p style="margin: 3px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">Attaque Max : ${Joueur.max_atk_joueur}</p>
        <p style="margin: 3px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">Attaque Min : ${Joueur.mini_atk_joueur}</p>
        <p style="margin: 3px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">Mana : ${Joueur.Mana}/${Joueur.manamax}</p>
        <p style="margin: 3px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">Potions : ${Joueur.nb_de_potion}</p>
        <p style="margin: 3px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">Or : ${Joueur.or}</p>
        <p style="margin: 3px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">Essence : ${Joueur.montantEssence}</p>
        <p style="margin: 3px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">Monstres vaincus : ${Joueur.nb_de_kill}</p>
        <p style="margin: 3px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">Boss dans : ${10 - (Joueur.nb_de_kill % 10)} monstres</p>
    `;
    containerGauche.innerHTML = joueurStats;

    // Conteneur de droite pour l'image du dino
    const containerDroit = document.createElement('div');
    containerDroit.style.flex = '1.2';
    containerDroit.style.backgroundImage = Joueur.urlscreen;
    containerDroit.style.backgroundSize = 'contain';
    containerDroit.style.backgroundRepeat = 'no-repeat';
    containerDroit.style.backgroundPosition = 'center';
    containerDroit.style.marginLeft = '10px';
    containerDroit.style.maxHeight = '650px';  // Hauteur ajustée pour plus de place
    sectionsContainer.appendChild(containerDroit);

    // Bouton de retour pour fermer l'inventaire
    const boutonRetour = document.createElement('button');
    boutonRetour.innerText = "Retour au magasin";
    boutonRetour.classList.add('bouton-retour-magasin-via-grimoire'); // Applique la classe CSS existante
    inventaireContainer.appendChild(boutonRetour);

    // Action pour fermer l'inventaire
    boutonRetour.addEventListener('click', () => {
        document.body.removeChild(inventaireOverlay);  // Supprime l’overlay et donc l’inventaire
    });
}


