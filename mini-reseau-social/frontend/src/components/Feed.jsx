import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost';
import { AuthContext } from '../context/AuthContext';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const { user, token } = useContext(AuthContext);

  // Charger les posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error("Erreur de chargement des posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Ajouter un nouveau post en haut du fil en temps réel
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Supprimer un post
  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {user && <CreatePost onPostCreated={handlePostCreated} />}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-5 rounded-xl shadow">
            <div className="flex justify-between items-center mb-3">
              <div className="font-bold text-gray-800">{post.author?.username}</div>
              {user && user.id === post.author?._id && (
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold"
                >
                  Supprimer
                </button>
              )}
            </div>

            <p className="text-gray-700 mb-3">{post.content}</p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Publication"
                className="w-full h-auto rounded-lg mb-3 object-cover max-h-96"
              />
            )}

            <div className="text-sm text-gray-500 border-t pt-2 mt-2">
              <span>❤️ {post.likes?.length || 0} Likes</span>
              <span className="ml-4">💬 {post.comments?.length || 0} Commentaires</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}