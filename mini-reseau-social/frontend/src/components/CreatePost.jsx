import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/posts',
        { content, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      setImageUrl('');
      onPostCreated(res.data); // Met à jour le fil d'actualité sans recharger la page
    } catch (err) {
      console.error("Erreur lors de la création du post", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Quoi de neuf ?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        
        <input
          type="text"
          placeholder="URL d'une image (optionnel)"
          className="w-full mt-2 p-2 border rounded-lg text-sm focus:outline-none"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <div className="flex justify-end mt-3">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Publier
          </button>
        </div>
      </form>
    </div>
  );
}