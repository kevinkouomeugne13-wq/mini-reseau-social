// backend/routes/authRoutes.js
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Route d'inscription (Register)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Cet email est déjà utilisé.' });

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer et sauvegarder l'utilisateur
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès !' });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'inscription : " + err.message });
  }
});

// Route de connexion (Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Email ou mot de passe incorrect.' });

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Email ou mot de passe incorrect.' });

    // Créer un JWT valable 24h
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la connexion : ' + err.message });
  }
});

module.exports = router;