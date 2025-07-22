// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header'; // Компонент хедера

// Імпортуємо наші нові компоненти сторінок
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import CategoriesPage from './pages/CategoriesPage';
import ContactsPage from './pages/ContactsPage';
import AdminLoginPage from './pages/AdminLoginPage';


function App() {
  return (
    <Router>
      <div className="App">
        <Header /> {/* Використовуємо наш компонент Header */}

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; 2024 Портал Ветеранів ЗСУ. Усі права захищені.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;