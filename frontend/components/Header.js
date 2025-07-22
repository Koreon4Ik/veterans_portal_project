// frontend/src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Ми створимо цей файл для стилів хедера

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // Стан для керування відкриттям/закриття бургер-меню

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="main-header">
      <div className="header-content">
        {/* Анімоване лого та назва порталу */}
        <Link to="/" className="logo-container" onClick={() => setIsOpen(false)}>
          {/* Тут буде ваше SVG-лого або зображення */}
          <div className="logo-placeholder"></div> {/* Заглушка для лого */}
          <h1 className="portal-title">Портал Ветеранів ЗСУ</h1>
        </Link>

        {/* Бургер-меню іконка */}
        <div className="burger-menu-icon" onClick={toggleMenu}>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        </div>

        {/* Навігаційне меню */}
        <nav className={`main-nav ${isOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/news" onClick={toggleMenu}>Новини</Link></li>
            <li><Link to="/categories" onClick={toggleMenu}>Категорії закладів</Link></li>
            <li><Link to="/contacts" onClick={toggleMenu}>Контакти</Link></li>
            <li><Link to="/admin" onClick={toggleMenu}>Вхід адміністратора</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;