import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchUserPosts = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/posts/user/${user.id}`);
          setUserPosts(res.data);
        } catch (err) {
          console.error("Erreur lors de la récupération des posts du profil", err);
        }
      };
      fetchUserPosts();
    }
  }, [user]);

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPosts(userPosts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  if (!user) {
    return <div className="text-center mt-20 text-gray-600">Veuillez vous connecter pour voir votre profil.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Carte d'informations du profil */}
      <div className="bg-white p-6 rounded-xl shadow mb-6 text-center">
        <div className="w-20 h-20 bg-blue-500 text-white text-3xl font-bold flex items-center justify-center rounded-full mx-auto mb-4">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
        <p className="text-gray-500 text-sm mt-1">{user.email}</p>
        <p className="text-gray-700 mt-3">{user.bio || "Aucune biographie pour le moment."}</p>
      </div>

      {/* Publications de l'utilisateur */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">Mes Publications</h3>
      <div className="space-y-4">
        {userPosts.length === 0 ? (
          <p className="text-gray-500 text-center bg-white p-4 rounded-xl shadow">Vous n'avez encore publié aucun post.</p>
        ) : (
          userPosts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
          ))
        )}
      </div>
    </div>
  );
}