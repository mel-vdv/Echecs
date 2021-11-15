
'use strict';
const app = require('express')();
const http = require('http').Server(app);
const serveurIo = require('socket.io')(http, {
    cors: {
        origin: "*",
        "Access-Control-Allow-Origin": "*"
    }
});
//const port = process.env.PORT || 3456;
const port = 3456;
const MongoClient = require('mongodb').MongoClient;
//const urldb = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const urldb = "mongodb://127.0.0.1:27017";
//--------------------------------------------
const session = require('express-session');
app.use(session({
    secret: 'secretpasswordblog',
    resave: false,
    saveUninitialized: true
}));
let datas = {};
app.use((req, res, next) => {
    datas = app.locals;
    app.locals = {};
    datas.session = req.session;
    next();
})
//--------------

//********************************************************** */
serveurIo.on("connection", socket => {
    console.log("connexion socket");

    //////////////////////////////////////////////////////////////
    //   component CONNECT et STAT  : LA COLLECTION  JOUEURS
    /////////////////////////////////////////////////////////////

    socket.on('autresJoueurs', quiestco => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection('joueurs');
            coll.find({ pseudo: { $ne: quiestco } }).toArray((e, d) => {
                let list = d;
                socket.emit('autresJoueursS', list);
            });
        });
    });
    //******************************************************* */
    socket.on('nouveau', quiestco => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection('joueurs');
            coll.find({ pseudo: quiestco }).toArray((e, d) => {
                let reponse;
                if (d.length > 0) {
                    reponse = false;
                }
                else {
                    reponse = true;
                    coll.insertOne(
                        {
                            "pseudo": quiestco,
                            "coOrNot": "deco",
                            "demandeA": [],
                            "invitePar": [],
                            "jeuEnCours": [],
                            "win": [],
                            "lost": [],
                        }
                    );
                }
                socket.emit('nouveauS', reponse);
            });
        });
    });
    //******************************************************* */
    socket.on('inviter', prop => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection('joueurs');
            coll.updateOne({ "pseudo": prop.quiestco }, { $push: { "demandeA": prop.joueurB } });
            coll.updateOne({ "pseudo": prop.joueurB }, { $push: { "invitePar": prop.quiestco } });

            socket.emit('inviterS');
            serveurIo.emit('majEtatsS', prop);

        });
    });
    //******************************************************* */
    socket.on('accepter', duo => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection('joueurs');
            coll.updateOne({ "pseudo": duo.joueurB }, { $pull: { "demandeA": duo.quiestco } });
            coll.updateOne({ "pseudo": duo.quiestco }, { $pull: { "invitePar": duo.joueurB } });
            coll.updateOne({ "pseudo": duo.quiestco }, { $push: { "jeuEnCours": duo.joueurB } });
            coll.updateOne({ "pseudo": duo.joueurB }, { $push: { "jeuEnCours": duo.quiestco } });

            socket.emit('accepterS');
            serveurIo.emit('majEtatsS', duo);
        });
    });


    //******************************************************* */
    socket.on('co', quiestco => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection('joueurs');
            coll.find({ pseudo: quiestco }).toArray((e, d) => {
                let reponse;
                if (d.length > 0) {
                    reponse = true;
                    coll.updateOne({ pseudo: quiestco }, { $set: { "coOrNot": 'co' } });
                }
                else {
                    reponse = false;
                    console.log('joueur inconnu, merci de vous inscrire.');
                }
                socket.emit("coS", reponse);
                serveurIo.emit('majlistJoueurs');
            });

        });
    });
    //******************************************************* */
    socket.on('deco', quiestco => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection('joueurs');

            coll.updateOne({ "pseudo": quiestco }, { $set: { "coOrNot": "deco" } });

        });
        serveurIo.emit('majlistJoueurs');
    });
    //******************************************************* */  
///////////////////////////////////////////////////////////////////////////////
// collection   CODE
///////////////////////////////////////////////////////////////////////////////
socket.on('creer', duo => {
    let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let un = Math.floor(Math.random() * 24);
    let deux = Math.floor(Math.random() * 24);
    let trois = Math.floor(Math.random() * 24);
    let numeroAleatoire = alphabet[un] + alphabet[deux] + alphabet[trois];
    console.log(numeroAleatoire);

    MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
        const coll = cli.db('echecs').collection('parties');

        let positions = [
            { "_id": 3, "case": "c8", "lettre": "c", "piece": "fn1", "type": "fou", "chiffre": 8, "chiffrestring": "huit", "etat": "vivant", "couleur": "noir" },
            { "_id": 2, "case": "b8", "lettre": "b", "piece": "cn1", "type": "cheval", "chiffre": 8, "chiffrestring": "huit", "etat": "vivant", "couleur": "noir" },
            { "_id": 5, "case": "e8", "lettre": "e", "piece": "rn", "type": "reine", "chiffre": 8, "chiffrestring": "huit", "etat": "vivant", "couleur": "noir" },
            { "_id": 6, "case": "f8", "lettre": "f", "piece": "fn2", "type": "fou", "chiffre": 8, "chiffrestring": "huit", "etat": "vivant", "couleur": "noir" },
            { "_id": 8, "case": "h8", "lettre": "h", "piece": "tn2", "type": "tour", "chiffre": 8, "chiffrestring": "huit", "etat": "vivant", "couleur": "noir" },
            { "_id": 4, "case": "d8", "lettre": "d", "piece": "ron", "type": "roi", "chiffre": 8, "chiffrestring": "huit", "etat": "vivant", "couleur": "noir" },
            { "_id": 9, "case": "a7", "lettre": "a", "piece": "pn1", "type": "pion", "chiffre": 7, "chiffrestring": "sept", "etat": "vivant", "couleur": "noir" },
            { "_id": 7, "case": "g8", "lettre": "g", "piece": "cn2", "type": "cheval", "chiffre": 8, "chiffrestring": "huit", "etat": "vivant", "couleur": "noir" },
            { "_id": 1, "case": "a8", "lettre": "a", "piece": "tn1", "type": "tour", "chiffre": 8, "chiffrestring": "huit", "etat": "vivant", "couleur": "noir" },
            { "_id": 12, "case": "d7", "lettre": "d", "piece": "pn4", "type": "pion", "chiffre": 7, "chiffrestring": "sept", "etat": "vivant", "couleur": "noir" },
            { "_id": 10, "case": "b7", "lettre": "b", "piece": "pn2", "type": "pion", "chiffre": 7, "chiffrestring": "sept", "etat": "vivant", "couleur": "noir" },
            { "_id": 13, "case": "e7", "lettre": "e", "piece": "pn5", "type": "pion", "chiffre": 7, "chiffrestring": "sept", "etat": "vivant", "couleur": "noir" },
            { "_id": 14, "case": "f7", "lettre": "f", "piece": "pn6", "type": "pion", "chiffre": 7, "chiffrestring": "sept", "etat": "vivant", "couleur": "noir" },
            { "_id": 16, "case": "h7", "lettre": "h", "piece": "pn8", "type": "pion", "chiffre": 7, "chiffrestring": "sept", "etat": "vivant", "couleur": "noir" },
            { "_id": 17, "case": "a6", "lettre": "a", "piece": "vide", "type": "vide", "chiffre": 6, "chiffrestring": "six", "etat": "vivant", "couleur": "vide" },
            { "_id": 18, "case": "b6", "lettre": "b", "piece": "vide", "type": "vide", "chiffre": 6, "chiffrestring": "six", "etat": "vivant", "couleur": "vide" },
            { "_id": 19, "case": "c6", "lettre": "c", "piece": "vide", "type": "vide", "chiffre": 6, "chiffrestring": "six", "etat": "vivant", "couleur": "vide" },
            { "_id": 15, "case": "g7", "lettre": "g", "piece": "pn7", "type": "pion", "chiffre": 7, "chiffrestring": "sept", "etat": "vivant", "couleur": "noir" },
            { "_id": 20, "case": "d6", "lettre": "d", "piece": "vide", "type": "vide", "chiffre": 6, "chiffrestring": "six", "etat": "vivant", "couleur": "vide" },
            { "_id": 21, "case": "e6", "lettre": "e", "piece": "vide", "type": "vide", "chiffre": 6, "chiffrestring": "six", "etat": "vivant", "couleur": "vide" },
            { "_id": 22, "case": "f6", "lettre": "f", "piece": "vide", "type": "vide", "chiffre": 6, "chiffrestring": "six", "etat": "vivant", "couleur": "vide" },
            { "_id": 23, "case": "g6", "lettre": "g", "piece": "vide", "type": "vide", "chiffre": 6, "chiffrestring": "six", "etat": "vivant", "couleur": "vide" },
            { "_id": 25, "case": "a5", "lettre": "a", "piece": "vide", "type": "vide", "chiffre": 5, "chiffrestring": "cinq", "etat": "vivant", "couleur": "vide" },
            { "_id": 26, "case": "b5", "lettre": "b", "piece": "vide", "type": "vide", "chiffre": 5, "chiffrestring": "cinq", "etat": "vivant", "couleur": "vide" },
            { "_id": 24, "case": "h6", "lettre": "h", "piece": "vide", "type": "vide", "chiffre": 6, "chiffrestring": "six", "etat": "vivant", "couleur": "vide" },
            { "_id": 27, "case": "c5", "lettre": "c", "piece": "vide", "type": "vide", "chiffre": 5, "chiffrestring": "cinq", "etat": "vivant", "couleur": "vide" },
            { "_id": 28, "case": "d5", "lettre": "d", "piece": "vide", "type": "vide", "chiffre": 5, "chiffrestring": "cinq", "etat": "vivant", "couleur": "vide" },
            { "_id": 29, "case": "e5", "lettre": "e", "piece": "vide", "type": "vide", "chiffre": 5, "chiffrestring": "cinq", "etat": "vivant", "couleur": "vide" },
            { "_id": 30, "case": "f5", "lettre": "f", "piece": "vide", "type": "vide", "chiffre": 5, "chiffrestring": "cinq", "etat": "vivant", "couleur": "vide" },
            { "_id": 11, "case": "c7", "lettre": "c", "piece": "pn3", "type": "pion", "chiffre": 7, "chiffrestring": "sept", "etat": "vivant", "couleur": "noir" },
            { "_id": 31, "case": "g5", "lettre": "g", "piece": "vide", "type": "vide", "chiffre": 5, "chiffrestring": "cinq", "etat": "vivant", "couleur": "vide" },
            { "_id": 34, "case": "b4", "lettre": "b", "piece": "vide", "type": "vide", "chiffre": 4, "chiffrestring": "quatre", "etat": "vivant", "couleur": "vide" },
            { "_id": 33, "case": "a4", "lettre": "a", "piece": "vide", "type": "vide", "chiffre": 4, "chiffrestring": "quatre", "etat": "vivant", "couleur": "vide" },
            { "_id": 32, "case": "h5", "lettre": "h", "piece": "vide", "type": "vide", "chiffre": 5, "chiffrestring": "cinq", "etat": "vivant", "couleur": "vide" },
            { "_id": 35, "case": "c4", "lettre": "c", "piece": "vide", "type": "vide", "chiffre": 4, "chiffrestring": "quatre", "etat": "vivant", "couleur": "vide" },
            { "_id": 36, "case": "d4", "lettre": "d", "piece": "vide", "type": "vide", "chiffre": 4, "chiffrestring": "quatre", "etat": "vivant", "couleur": "vide" },
            { "_id": 37, "case": "e4", "lettre": "e", "piece": "vide", "type": "vide", "chiffre": 4, "chiffrestring": "quatre", "etat": "vivant", "couleur": "vide" },
            { "_id": 40, "case": "h4", "lettre": "h", "piece": "vide", "type": "vide", "chiffre": 4, "chiffrestring": "quatre", "etat": "vivant", "couleur": "vide" },
            { "_id": 39, "case": "g4", "lettre": "g", "piece": "vide", "type": "vide", "chiffre": 4, "chiffrestring": "quatre", "etat": "vivant", "couleur": "vide" },
            { "_id": 41, "case": "a3", "lettre": "a", "piece": "vide", "type": "vide", "chiffre": 3, "chiffrestring": "trois", "etat": "vivant", "couleur": "vide" },
            { "_id": 38, "case": "f4", "lettre": "f", "piece": "vide", "type": "vide", "chiffre": 4, "chiffrestring": "quatre", "etat": "vivant", "couleur": "vide" },
            { "_id": 43, "case": "c3", "lettre": "c", "piece": "vide", "type": "vide", "chiffre": 3, "chiffrestring": "trois", "etat": "vivant", "couleur": "vide" },
            { "_id": 45, "case": "e3", "lettre": "e", "piece": "vide", "type": "vide", "chiffre": 3, "chiffrestring": "trois", "etat": "vivant", "couleur": "vide" },
            { "_id": 46, "case": "f3", "lettre": "f", "piece": "vide", "type": "vide", "chiffre": 3, "chiffrestring": "trois", "etat": "vivant", "couleur": "vide" },
            { "_id": 44, "case": "d3", "lettre": "d", "piece": "vide", "type": "vide", "chiffre": 3, "chiffrestring": "trois", "etat": "vivant", "couleur": "vide" },
            { "_id": 42, "case": "b3", "lettre": "b", "piece": "vide", "type": "vide", "chiffre": 3, "chiffrestring": "trois", "etat": "vivant", "couleur": "vide" },
            { "_id": 47, "case": "g3", "lettre": "g", "piece": "vide", "type": "vide", "chiffre": 3, "chiffrestring": "trois", "etat": "vivant", "couleur": "vide" },
            { "_id": 50, "case": "b2", "lettre": "b", "piece": "pb2", "type": "pion", "chiffre": 2, "chiffrestring": "deux", "etat": "vivant", "couleur": "blanc" },
            { "_id": 48, "case": "h3", "lettre": "h", "piece": "vide", "type": "vide", "chiffre": 3, "chiffrestring": "trois", "etat": "vivant", "couleur": "vide" },
            { "_id": 49, "case": "a2", "lettre": "a", "piece": "pb1", "type": "pion", "chiffre": 2, "chiffrestring": "deux", "etat": "vivant", "couleur": "blanc" },
            { "_id": 51, "case": "c2", "lettre": "c", "piece": "pb3", "type": "pion", "chiffre": 2, "chiffrestring": "deux", "etat": "vivant", "couleur": "blanc" },
            { "_id": 52, "case": "d2", "lettre": "d", "piece": "pb4", "type": "pion", "chiffre": 2, "chiffrestring": "deux", "etat": "vivant", "couleur": "blanc" },
            { "_id": 54, "case": "f2", "lettre": "f", "piece": "pb6", "type": "pion", "chiffre": 2, "chiffrestring": "deux", "etat": "vivant", "couleur": "blanc" },
            { "_id": 53, "case": "e2", "lettre": "e", "piece": "pb5", "type": "pion", "chiffre": 2, "chiffrestring": "deux", "etat": "vivant", "couleur": "blanc" },
            { "_id": 55, "case": "g2", "lettre": "g", "piece": "pb7", "type": "pion", "chiffre": 2, "chiffrestring": "deux", "etat": "vivant", "couleur": "blanc" },
            { "_id": 56, "case": "h2", "lettre": "h", "piece": "pb8", "type": "pion", "chiffre": 2, "chiffrestring": "deux", "etat": "vivant", "couleur": "blanc" },
            { "_id": 59, "case": "c1", "lettre": "c", "piece": "fb1", "type": "fou", "chiffre": 1, "chiffrestring": "un", "etat": "vivant", "couleur": "blanc" },
            { "_id": 57, "case": "a1", "lettre": "a", "piece": "tb1", "type": "tour", "chiffre": 1, "chiffrestring": "un", "etat": "vivant", "couleur": "blanc" },
            { "_id": 58, "case": "b1", "lettre": "b", "piece": "cb1", "type": "cheval", "chiffre": 1, "chiffrestring": "un", "etat": "vivant", "couleur": "blanc" },
            { "_id": 60, "case": "d1", "lettre": "d", "piece": "rb", "type": "reine", "chiffre": 1, "chiffrestring": "un", "etat": "vivant", "couleur": "blanc" },
            { "_id": 62, "case": "f1", "lettre": "f", "piece": "fb2", "type": "fou", "chiffre": 1, "chiffrestring": "un", "etat": "vivant", "couleur": "blanc" },
            { "_id": 61, "case": "e1", "lettre": "e", "piece": "rob", "type": "roi", "chiffre": 1, "chiffrestring": "un", "etat": "vivant", "couleur": "blanc" },
            { "_id": 63, "case": "g1", "lettre": "g", "piece": "cb2", "type": "cheval", "chiffre": 1, "chiffrestring": "un", "etat": "vivant", "couleur": "blanc" },
            { "_id": 64, "case": "h1", "lettre": "h", "piece": "tb2", "type": "tour", "chiffre": 1, "chiffrestring": "un", "etat": "vivant", "couleur": "blanc" },

        ];
        coll.insertOne({
            "statut": 'enCours', //'finie'
            "noir": duo.noir,
            "blanc": duo.blanc,
            "auTourDe": duo.blanc,
            "numero": numeroAleatoire,
            "echec": false,
            "echecA": '',
            'echecPar': '',
            "mortsBlancs":  [],
            "mortsNoirs": []
            }
        );
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection(`${numeroAleatoire}`);
            let x = 0;
            for (x = 0; x < 64; x++) {
                coll.insertOne(positions[x]);
                if (x === 63) {
                    socket.emit('creerS', numeroAleatoire);
                }

            }
        });
    });
});


///////////////////////////////////////////////////////////////////////////////
//   collection     PARTIES     
///////////////////////////////////////////////////////////////////////////////

//0/ débuter/reprendre:
    
    //************************************************************************** */
    socket.on('rejoindre', num => {
        let code = num;
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection(`${code}`);
            coll.find({}).toArray((e, d) => {
                let cases = d;
                socket.emit('rejoindreSa', cases);
            });
        });
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection("parties");
            coll.find({ numero: num }).toArray((e, d) => {
                let partie = d[0];
                socket.emit('rejoindreSb', partie);
            });
        });
    });
    //*************************************************************************** */
    socket.on('quelCode', duo => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection("parties");
            coll.find({ blanc: { $in: [duo.joueurB, duo.quiestco] }, noir: { $in: [duo.joueurB, duo.quiestco] }, statut: 'enCours' }).toArray((e, d) => {
                let code = d[0].numero;
                socket.emit('quelCodeS', code);
            });
        });
    });
    
    //************************************************************************** */
    socket.on('majCases', num => {
        let code = num;
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection(`${code}`);
            coll.find({}).toArray((e, d) => {
                let cases = d;
                socket.emit('majCasesS', cases);
            });
        });
    });
 

//1/ les actions:
    ///////////////////////////////////////////////////////////////////
    socket.on('bouger', mvt => {
        let code = mvt.num;
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection(`${code}`);

            coll.updateOne({ case: mvt.fromCase }, { $set: { piece: 'vide', type: 'vide', couleur: 'vide' } });
            coll.updateOne({ case: mvt.toCase }, { $set: { piece: mvt.fromPiece, type: mvt.fromType, couleur: mvt.fromCouleur } });
            socket.emit('bougerS');
            serveurIo.emit('faireMajGlobale',code);
        });
    });
    //******************************************************* */  
    socket.on('manger', proie => {
        let code = proie.num;
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection("parties");
            if (proie.color === 'blanc') {
                coll.updateOne({numero: code}, { $push: { 'mortsBlancs': proie.piece } });
            }
            else {
                coll.updateOne({numero: code}, { $push: { 'mortsNoirs': proie.piece } });
            }
        
            serveurIo.emit('faireMajGlobale',code);
        });
    });
    
    //************************************************************************** */
    socket.on('echecAuRoi', echec => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection('parties');
            coll.updateOne({ numero: echec.num }, { $set: { echec: echec.yn, echecA: echec.a, echecPar: echec.par } });
            socket.emit('echecAuRoiS', echec);
            let code = echec.num;
            serveurIo.emit('faireMajGlobale',code);
        })
    });
       //*************************************************************************** */
       socket.on('auTourDe', x => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection("parties");
            coll.updateOne({ numero: x.code }, { $set: { auTourDe: x.adversaire } });
            serveurIo.emit('faireMajGlobale', x.code);
        });
    });
        //************************************************************************* */
        socket.on('positionDuRoi', veille => {
            let code = veille.num;
            let roi = veille.roicouleur
            MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
                const coll = cli.db('echecs').collection(`${code}`);
    
                coll.find({ type: 'roi', couleur: roi }, { piece: 1, lettre: 1, chiffre: 1 }).toArray((e, d) => {
                    if (d[0]) {
                        socket.emit('roi', d);
                    }
                });
            });
        });
        //--------------------------
        socket.on('positionDesAttaquants', x => {
    
            let code = x.num;
            let color = x.couleur;
    
            MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
                const coll = cli.db('echecs').collection(`${code}`);
    
                    coll.find({ type: 'fou', couleur: color, etat: 'vivant' }, { piece: 1, lettre: 1, chiffre: 1 }).toArray((e, d) => {
                        if (d[0]) {
                            socket.emit('fou', d);
                        }
                    });
                    coll.find({ type: 'cheval', couleur: color, etat: 'vivant' }, { piece: 1, lettre: 1, chiffre: 1 }).toArray((e, d) => {
                        if (d[0]) {
                            socket.emit('cheval', d);
                        }
                    });
                    coll.find({ type: 'tour', couleur: color, etat: 'vivant' }, { piece: 1, lettre: 1, chiffre: 1 }).toArray((e, d) => {
                        if (d[0]) { socket.emit('tour', d); }
                    });
                    coll.find({ type: 'pion', couleur: color, etat: 'vivant' }, { piece: 1, lettre: 1, chiffre: 1 }).toArray((e, d) => {
                        if (d[0]) { socket.emit('pion', d); }
                    });
                    /*coll.find({ type: 'reine', couleur: color, etat: 'vivant' }, { piece: 1, lettre: 1, chiffre: 1 }).toArray((e, d) => {
                        if (d[0]) { socket.emit('reine', d); }
                    });*/
                    coll.find({ type: 'roi', couleur: color, etat: 'vivant' }, { piece: 1, lettre: 1, chiffre: 1 }).toArray((e, d) => {
                        if (d[0]) { socket.emit('roiAttaquant', d); }
                    });
                });
            });
    

//2/ les mises à jour :*******************************************************

// mise à jour globale (serveurIo.socket !!! )
socket.on('majGlobale', code => {
    MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
        const coll = cli.db('echecs').collection('parties');
        coll.find({ numero: code }).toArray((e, d) => {
            let infos = {
                statut: d[0].statut,
                tour :d[0].auTourDe,
                mortsBlancs: d[0].mortsBlancs,
                mortsNoirs : d[0].mortsNoirs,
                a: d[0].echecA
            }
            socket.emit('majGlobaleS', infos);
        });
    });
});



//3/ la fin de partie : ******************************************************
    socket.on('fin', equipe => {
        let dateJeu = new Date();
        let jour = dateJeu.getDate();
        let mois = dateJeu.getMonth() + 1;
        let an = dateJeu.getFullYear();
        let dateX = 'le ' + jour + '/' + mois + '/' + an;

        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection('joueurs');
            coll.updateOne({ pseudo: equipe.perdant }, { $push: { "lost": { 'pseudo': equipe.gagnant, 'date': dateX } } });
            coll.updateOne({ pseudo: equipe.gagnant }, { $push: { "win": { 'pseudo': equipe.perdant, 'date': dateX } } });
            coll.updateOne({ pseudo: equipe.perdant }, { $pull: { "jeuEnCours": equipe.gagnant } });
            coll.updateOne({ pseudo: equipe.gagnant }, { $pull: { "jeuEnCours": equipe.perdant } });

        });
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection('parties');
            coll.updateOne({ numero: equipe.num }, { $set: { statut: 'finie' } });

        });
        let code = equipe.num;
        serveurIo.emit('faireMajGlobale',code);

    });
  
 
    //************************************************************************** */
    socket.on('verifObstacle', envoi => {
        let code = envoi.num;
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection(`${code}`);
            coll.find({ case: { $in: envoi.dea } }, { type: 1 }).toArray((e, d) => {
                let obstacles = 0;
                for (let i = 0; i < d.length; i++) {
                    if (d[i].type !== 'vide') { obstacles++; }
                }
                let rep;
                if (obstacles === 0) { rep = true; } else { rep = false; }
                socket.emit('verifObstacleS', rep);

            });
        });
    });
    //************************************************************************** *

//4/ les stat:
       //************************************************************************** */
       socket.on('stat', quiestco => {

        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('echecs').collection('joueurs');
            coll.find({ pseudo: quiestco }).toArray((e, d) => {
                let listwin = d[0].win; let listlost = d[0].lost;

                socket.emit('winS', listwin);
                socket.emit('lostS', listlost);
            });
        });
    });
    //*********************************************************************************** */
});
http.listen(port, () => {
    console.log(`port ${port} sur écoute`);
});