import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function PostCard({ post, onDelete }) {
  const { user, token } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  // Vérifier si l'utilisateur connecté a déjà liké ce post
  const isLiked = user && likes.includes(user.id);

  // Gérer le Like / Unlike
  const handleLike = async () => {
    if (!user) return alert('Connectez-vous pour liker !');
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(res.data); // Met à jour le tableau des IDs qui ont liké
    } catch (err) {
      console.error("Erreur lors du like", err);
    }
  };

  // Ajouter un commentaire
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return alert('Connectez-vous pour commenter !');
    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/${post._id}/comment`,
        { text: newCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data); // Met à jour la liste des commentaires
      setNewCommentText('');
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire", err);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-4">
      {/* En-tête du post */}
      <div className="flex justify-between items-center mb-3">
        <div className="font-bold text-gray-800">{post.author?.username}</div>
        {user && user.id === post.author?._id && (
          <button
            onClick={() => onDelete(post._id)}
            className="text-red-500 hover:text-red-700 text-sm font-semibold"
          >
            Supprimer
          </button>
        )}
      </div>

      {/* Contenu */}
      <p className="text-gray-700 mb-3">{post.content}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Publication"
          className="w-full h-auto rounded-lg mb-3 object-cover max-h-96"
        />
      )}

      {/* Boutons d'interaction */}
      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3 mt-2">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 font-semibold ${isLiked ? 'text-red-500' : 'hover:text-gray-700'}`}
        >
          {isLiked ? '❤️' : '🤍'} {likes.length} Likes
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:text-gray-700 font-semibold"
        >
          💬 {comments.length} Commentaires
        </button>
      </div>

      {/* Section Commentaires (affichée si l'utilisateur clique) */}
      {showComments && (
        <div className="mt-4 border-t pt-3">
          {/* Liste des commentaires */}
          <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
            {comments.map((comment, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded-lg text-sm">
                <span className="font-semibold text-gray-800 mr-2">
                  {comment.user?.username || 'Utilisateur'} :
                </span>
                <span className="text-gray-600">{comment.text}</span>
              </div>
            ))}
          </div>

          {/* Formulaire d'ajout de commentaire */}
          {user && (
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Écrire un commentaire..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
              >
                Envoyer
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}