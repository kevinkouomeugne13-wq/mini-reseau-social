// backend/routes/postRoutes.js (Ajout de la route like)
const authMiddleware = require('../middleware/authMiddleware');

// Liker / Unliker un post
router.put('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post introuvable.' });

    // Vérifier si l'utilisateur a déjà liké le post
    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      // Si déjà liké, on retire l'ID (Unlike)
      post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
    } else {
      // Sinon, on ajoute l'ID (Like)
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post.likes); // On retourne la liste mise à jour des likes
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du like : ' + err.message });
  }
});