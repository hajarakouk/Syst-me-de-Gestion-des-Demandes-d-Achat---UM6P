import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { BsFillTrashFill } from "react-icons/bs";
import './HomePage.css';

function UsersDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/users', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement');
    }
    setLoading(false);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const url = editUser
        ? `http://localhost:5001/api/users/${editUser.id}`
        : `http://localhost:5001/api/users`;

      const method = editUser ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(form)
      });

      setShowForm(false);
      setEditUser(null);
      setForm({ name: '', email: '', role: '', password: '' });
      fetchUsers();
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = user => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, role: user.role || '', password: '' });
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
              await fetch(`http://localhost:5001/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      fetchUsers();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: 0 }}>
      <h1 style={{ color: 'red', textAlign: 'center' }}>DEBUG USERS DASHBOARD</h1>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, width: '100%' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#222' }}>Team members</h2>
          <button
            onClick={() => {
              setShowForm(true);
              setEditUser(null);
              setForm({ name: '', email: '', role: '', password: '' });
            }}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 28px',
              fontWeight: 600,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer'
            }}
          >
            <FaPlus style={{ fontSize: 18 }} />
            Add user
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,33,71,0.06)', overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 16 }}>
            <thead>
              <tr style={{ background: '#f3f6fa', color: '#222', fontWeight: 700 }}>
                <th style={{ padding: 14 }}></th>
                <th style={{ padding: 14 }}>Nom</th>
                <th style={{ padding: 14 }}>Email</th>
                <th style={{ padding: 14 }}>Type</th>
                <th style={{ padding: 14 }}>Mot de passe</th>
                <th style={{ padding: 14 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user.id}
                  style={{ borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}
                >
                  <td style={{ padding: 14 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: '#e0e7ef', color: '#2563eb',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 18
                    }}>
                      {user.name?.charAt(0)}
                    </div>
                  </td>
                  <td style={{ padding: 14 }}>{user.name}</td>
                  <td style={{ padding: 14 }}>{user.email}</td>
                  <td style={{ padding: 14 }}>
                    <span style={{
                      background: user.role === 'admin' ? '#dcfce7' : user.role === 'gestion_achat' ? '#dbeafe' : '#f3f4f6',
                      color: user.role === 'admin' ? '#22c55e' : user.role === 'gestion_achat' ? '#2563eb' : '#6b7280',
                      padding: '4px 14px', borderRadius: 12, fontWeight: 600, fontSize: 14
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: 14, color: '#888' }}>{user.password || '-'}</td>
                  <td style={{ padding: 14 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        onClick={() => handleEdit(user)}
                        style={{
                          background: '#e0f2fe',
                          border: 'none',
                          borderRadius: 8,
                          padding: 8,
                          cursor: 'pointer'
                        }}
                        title="Modifier"
                      >
                        <FaEdit style={{ color: '#2563eb', fontSize: 18 }} />
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{
                          background: '#fee2e2',
                          border: 'none',
                          borderRadius: 8,
                          padding: 8,
                          cursor: 'pointer'
                        }}
                        title="Supprimer"
                      >
                        <BsFillTrashFill style={{ color: '#dc2626', fontSize: 18 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div style={{ marginTop: 32, background: '#fff', borderRadius: 12, padding: 32, maxWidth: 420, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontWeight: 700, fontSize: 22, color: '#2563eb', marginBottom: 18 }}>
              {editUser ? 'Modifier' : 'Ajouter'} un utilisateur
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600 }}>Nom :</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', width: '100%', fontSize: 16, marginTop: 6 }}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600 }}>Email :</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', width: '100%', fontSize: 16, marginTop: 6 }}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600 }}>Mot de passe :</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required={!editUser}
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', width: '100%', fontSize: 16, marginTop: 6 }}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600 }}>Type :</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', width: '100%', fontSize: 16, marginTop: 6 }}
                >
                  <option value="">Sélectionner un type</option>
                  <option value="admin">Admin</option>
                  <option value="gestion_achat">Gestion Achat</option>
                  <option value="user">User</option>
                </select>
              </div>
              <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontWeight: 700, fontSize: 16, marginRight: 10, cursor: 'pointer' }}>Enregistrer</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: '#ccc', color: '#222', border: 'none', borderRadius: 8, padding: '12px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Annuler</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersDashboard;
