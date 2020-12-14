const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
};

exports.getTheSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createTheSauce = (req, res, next) => {
    const SauceObj = JSON.parse(req.body.sauce);

    // delete l'id car mongoDB va enregistrer le sien de manière automatique
    delete SauceObj._id;
    const sauce = new Sauce({
       ...SauceObj,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
       likes: 0,
       dislikes: 0
    });

    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
        .catch(error => res.status(400).json({ error }));
};

exports.updateTheSauce = (req, res, next) => {
    const SauceObj = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    // ancien système d'update
    // Sauce.updateOne({ _id: req.params.id }, { ...SauceObj, _id: req.params.id })
    //     .then(() => res.status(200).json({ message: 'Objet modifié'}))
    //     .catch(error => res.status(400).json({ error }))

    // Nouveau système d'update qui permet de supprimer l'image actuelle quand une nouvelle est ajoutée
    Sauce.findOneAndUpdate({_id: req.params.id}, {...SauceObj, _id: req.params.id})
        .then(oldSauce => {
            if (req.file && SauceObj.imageUrl) {
                const filename = oldSauce.imageUrl.split('/images/')[1];

                fs.unlink(`images/${filename}`, () => {
                    res.status(201).json({ message: 'Objet modifié et ancienne photo supprimée correctement'})
                })
            } else {
                res.status(200).json({ message: 'Objet modifié'})
            }
        })
        .catch(error => res.status(400).json({ error }))
};

exports.removeTheSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            const filename = sauce.imageUrl.split('/images/')[1];
            // second argument = callBack = que faire quand la fonction s'est éxecuté
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé correctement'}))
                    .catch(error => { res.status({ error }) })
            })
        })
        .catch(error => res.status(500).json({ error }))
};

exports.likeTheSauce = (req, res, next) => {
    
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // On met a jour nos tableaux en fonction du "like" renvoyé par le front
            switch (req.body.like) {
                case 0: {
                    console.log('case 0');
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        sauce.usersLiked.forEach((item, index) => {
                            if (item === req.body.userId) {
                                sauce.usersLiked.splice(index, 1);
                            }
                        })
                    }

                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.usersDisliked.forEach((item, index) => {
                            if (item === req.body.userId) {
                                sauce.usersDisliked.splice(index, 1);
                            }
                        })
                    }

                    break;
                }

                case 1: {
                    console.log('case 1');
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.usersDisliked.forEach((item, index) => {
                            if (item === req.body.userId) {
                                sauce.usersDisliked.splice(index, 1);
                            }
                        })
                    }

                    if (sauce.usersLiked.includes(req.body.userId) === false) {
                        sauce.usersLiked.push(req.body.userId);
                    }

                    break;
                }

                case -1: {
                    console.log('case -1');
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        sauce.usersLiked.forEach((item, index) => {
                            if (item === req.body.userId) {
                                sauce.usersLiked.splice(index, 1);
                            }
                        })
                    }

                    if (sauce.usersDisliked.includes(req.body.userId) === false) {
                        sauce.usersDisliked.push(req.body.userId);
                    }

                    break;
                }
                default:
                    break;
            }

            sauce.likes = sauce.usersLiked.length;
            sauce.dislikes = sauce.usersDisliked.length;

                Sauce.findOneAndUpdate({ _id: req.params.id }, {
                    $set: {
                        likes: sauce.likes,
                        dislikes: sauce.dislikes,
                        usersLiked: sauce.usersLiked,
                        usersDisliked: sauce.usersDisliked
                    }
                }, { new: true },
                    () => {
                    res.status(200).json({ message: 'Objet Updated'})
                    })


        })
        .catch(error => res.status(501).json({ error }));
};
