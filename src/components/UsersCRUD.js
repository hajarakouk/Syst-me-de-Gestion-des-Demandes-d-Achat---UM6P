import React, { useEffect, useState } from 'react';
import { FaUser, FaUsers, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
function UsersCRUD() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });

  // Charger la liste des utilisateurs
  useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    try {
        const res = await fetch('http://localhost:5001/api/users');
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement');
    }
    setLoading(false);
  };
    fetchUsers();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
            const url = editUser ? `http://localhost:5001/api/users/${editUser.id}` : 'http://localhost:5001/api/users';
    const method = editUser ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setShowForm(false);
      setEditUser(null);
      setForm({ name: '', email: '' });
      fetchUsers();
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = user => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    try {
        await fetch(`http://localhost:5001/api/users/${id}`, { method: 'DELETE' });
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
      setError('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div style={{maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32}}>
      <h2>Gestion des utilisateurs</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {loading ? <div>Chargement...</div> : (
        <>
          <button onClick={() => { setShowForm(true); setEditUser(null); setForm({ name: '', email: '' }); }} style={{marginBottom: 18, background: '#e6501e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8}}>
            <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24" style={{marginRight: 6}}><path d="M12 5v14m7-7H5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            Ajouter un utilisateur
          </button>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{background: '#f7f7f7'}}>
                <th style={{padding: 8, border: '1px solid #eee'}}>Nom</th>
                <th style={{padding: 8, border: '1px solid #eee'}}>Email</th>
                <th style={{padding: 8, border: '1px solid #eee'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{padding: 8, border: '1px solid #eee'}}>{user.name}</td>
                  <td style={{padding: 8, border: '1px solid #eee'}}>{user.email}</td>
                  <td style={{padding: 8, border: '1px solid #eee'}}>
                    <button onClick={() => handleEdit(user)} style={{marginRight: 8, background: '#002147', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4}}>
                      <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24"><path d="M17.25 6.085l.665-.665a1.5 1.5 0 1 0-2.12-2.12l-.665.665 2.12 2.12zm-2.12 2.12l-9.13 9.13a1 1 0 0 0-.263.465l-1 4a1 1 0 0 0 1.213 1.213l4-1a1 1 0 0 0 .465-.263l9.13-9.13-4.415-4.415z"></path></svg>
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(user.id)} style={{background: '#e6501e', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4}}>
                      <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24"><path d="M9 3v1H4v2h16V4h-5V3H9zm2 5v10h2V8h-2zm-4 0v10h2V8H7zm8 0v10h2V8h-2z"></path></svg>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {showForm && (
        <div style={{marginTop: 24, background: '#faf8fc', borderRadius: 8, padding: 20}}>
          <h3>{editUser ? 'Modifier' : 'Ajouter'} un utilisateur</h3>
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: 12}}>
              <label>Nom : </label>
              <input name="name" value={form.name} onChange={handleChange} required style={{padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%'}} />
            </div>
            <div style={{marginBottom: 12}}>
              <label>Email : </label>
              <input name="email" value={form.email} onChange={handleChange} required style={{padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%'}} />
            </div>
            <button type="submit" style={{background: '#e6501e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', marginRight: 10}}>Enregistrer</button>
            <button type="button" onClick={() => setShowForm(false)} style={{background: '#ccc', color: '#222', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer'}}>Annuler</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default UsersCRUD; 