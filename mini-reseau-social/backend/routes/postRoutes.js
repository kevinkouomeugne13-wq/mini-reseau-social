// backend/routes/postRoutes.js
const router = require('express').Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');

// 1. Créer une nouvelle publication
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Le contenu du post ne peut pas être vide.' });
    }

    const newPost = new Post({
      author: req.user.id,
      content,
      imageUrl: imageUrl || ''
    });

    const savedPost = await newPost.save();
    // Population de l'auteur pour retourner directement le nom dans la réponse
    await savedPost.populate('author', 'username profilePicture');

    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création du post : ' + err.message });
  }
});

// 2. Récupérer tous les posts (du plus récent au plus ancien)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des posts : ' + err.message });
  }
});

// 3. Supprimer un post (seulement par son auteur)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post introuvable.' });

    // Vérification : l'utilisateur qui supprime est-il l'auteur du post ?
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Action non autorisée.' });
    }

    await post.deleteOne();
    res.json({ message: 'Post supprimé avec succès.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression : ' + err.message });
  }
});

module.exports = router;