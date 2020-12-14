const jwt = require('jsonwebtoken');
const Sauce = require('../models/Sauce');


module.exports = (req, res, next) => {
    try {
        const userId = req.body.decodedUserId;

        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.userId !== userId) {
                    throw 'Il faut être propritétaire de la sauce pour la modifier ';
                } else {
                    next();
                }
            })
            .catch(error => res.status(404).json({ error }));

        next();

    }  catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};
