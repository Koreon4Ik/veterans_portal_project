// frontend/src/pages/NewsPage.js
import React, { useEffect, useState } from 'react';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // УВАГА: На локальній машині це буде http://localhost:5000
        // На сервері цю адресу потрібно буде змінити на реальний URL твого бекенду!
        const response = await fetch('http://localhost:5000/api/news');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        console.error("Помилка при завантаженні новин:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []); // Порожній масив залежностей означає, що ефект запускається лише один раз після першого рендеру

  if (loading) return <p>Завантаження новин...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (news.length === 0) return <p>Наразі немає новин.</p>;

  return (
    <section id="news">
      <h2>Останні Новини</h2>
      <div className="news-list">
        {news.map((item) => (
          <div key={item._id} className="news-item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.imageUrl && <img src={item.imageUrl} alt={item.title} style={{ maxWidth: '100%', height: 'auto' }} />}
            <p><small>Дата публікації: {new Date(item.date).toLocaleDateString()}</small></p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsPage;