import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/cards')
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.error('Error fetching cards:', err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Flash Cards</h1>
        <div className="cards-container">
          {cards.map(card => (
            <div key={card.id} className="card">
              <h3>{card.question}</h3>
              <p>{card.answer}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;