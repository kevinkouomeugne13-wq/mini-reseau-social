// backend/routes/postRoutes.js (Ajout de la route posts par utilisateur)
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des posts de l'utilisateur : " + err.message });
  }
});