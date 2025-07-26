import React, { useState } from 'react';
import './FlashCard.css';

function FlashCard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flashcard" onClick={handleClick}>
      <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
        <div className="flashcard-front">
          <h3>{card.question}</h3>
        </div>
        <div className="flashcard-back">
          <p>{card.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default FlashCard;