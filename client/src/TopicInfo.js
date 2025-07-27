import React, { useState } from 'react';
import './TopicInfo.css';

function TopicInfo({ metadata }) {
  const [showInfo, setShowInfo] = useState(false);

  if (!metadata) return null;

  return (
    <div className="topic-info">
      <button 
        className="info-toggle"
        onClick={() => setShowInfo(!showInfo)}
      >
        ℹ️ Topic Info
      </button>
      
      {showInfo && (
        <div className="info-panel">
          <div className="info-item">
            <strong>Last Updated:</strong> {metadata.lastUpdated}
          </div>
          
          {metadata.author && (
            <div className="info-item">
              <strong>Author:</strong> {metadata.author}
            </div>
          )}
          
          {metadata.version && (
            <div className="info-item">
              <strong>Version:</strong> {metadata.version}
            </div>
          )}
          
          {metadata.sources && metadata.sources.length > 0 && (
            <div className="info-item">
              <strong>Sources:</strong>
              <ul>
                {metadata.sources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TopicInfo;