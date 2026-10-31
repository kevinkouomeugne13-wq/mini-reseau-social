// backend/routes/postRoutes.js (Ajout de la route commentaire)
router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Le commentaire ne peut pas être vide.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post introuvable.' });

    const newComment = {
      user: req.user.id,
      text,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    // Recharger le post avec les détails de l'utilisateur pour le commentaire
    await post.populate('comments.user', 'username profilePicture');

    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout du commentaire : " + err.message });
  }
});