// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Accès refusé. Jeton manquant.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Contient l'ID de l'utilisateur ({ id: user._id })
    next();
  } catch (err) {
    res.status(400).json({ error: 'Jeton invalide ou expiré.' });
  }
};