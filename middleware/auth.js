const jwt = require('jsonwebtoken');

// Ici nous comparons l'userId de celui qui fait la requete "req.body.userId" soit le meme Id qui est encodé dans le payload du Token
module.exports = (req, res, next) => {
    try {
        const tokenRetrieved = req.headers.authorization.split(' ')[1];
        const tokenDecoded = jwt.verify(tokenRetrieved, 'RANDOM_TOKEN_SECRET');
        // on recup l'userId qu'on a précedemment envoyer dans le payload de la method sign de JsonWebToken
        const userId = tokenDecoded.userId;
        if ( req.body.userId && req.body.userId !== userId ) {
            throw 'User ID invalide';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};
