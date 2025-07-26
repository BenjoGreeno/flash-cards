import React, { useState, useCallback } from 'react';
import FlashCard from './FlashCard';
import SubjectSelector from './SubjectSelector';
import './App.css';

function App() {
  const [cards, setCards] = useState([]);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');

  const handleSelectionChange = useCallback((subject, topic) => {
    setCurrentSubject(subject);
    setCurrentTopic(topic);
    
    fetch(`http://localhost:5000/api/cards/${subject}/${topic}`)
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.error('Error fetching cards:', err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Flash Cards</h1>
        <SubjectSelector onSelectionChange={handleSelectionChange} />
        {currentSubject && currentTopic && (
          <p className="current-selection">
            {currentSubject} → {currentTopic === 'all' ? 'All Topics' : currentTopic}
          </p>
        )}
        <div className="cards-container">
          {cards.map(card => (
            <FlashCard key={card.id} card={card} />
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;