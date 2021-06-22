// Middleware d'authentification
const jwt = require('jsonwebtoken');


// Protection des routes et vérifiera que les user soient authentifié avant autorisation d'envoie de requete
module.exports = (req, res, next) => {
    try {
        // Récupération du deuxième élément du tableau de token
        const token = req.headers.authorization.split(' ')[1];
        // Décoder le token avec le packe jsonwebtoken
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valide !';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};