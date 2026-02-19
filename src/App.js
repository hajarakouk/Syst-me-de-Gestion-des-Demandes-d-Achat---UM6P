import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainPage from './components/MainPage';
import Login from './components/Login';
import UsersDashboard from './components/UsersDashboard';
import PurchaseRequestWizard from './components/PurchaseRequestWizard';
import ModifierDemande from './components/ModifierDemande';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import ProcessusAchatDashboard from './components/ProcessusAchatDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/users"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <UsersDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['gestion_achat']}>
              <UsersDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/processus-achat"
          element={
            <PrivateRoute allowedRoles={['gestion_achat']}>
              <ProcessusAchatDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/demande-achat"
          element={
            <PrivateRoute allowedRoles={['gestion_achat', 'admin', 'user']}>
              <PurchaseRequestWizard />
            </PrivateRoute>
          }
        />

        <Route
          path="/modifier-demande/:id"
          element={
            <PrivateRoute allowedRoles={['gestion_achat', 'admin', 'user']}>
              <ModifierDemande />
            </PrivateRoute>
          }
        />
        
      </Routes>
    </Router>
  );
}

export default App;
