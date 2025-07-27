import React, { useState, useEffect } from 'react';
import './SubjectSelector.css';

function SubjectSelector({ onSelectionChange }) {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    fetch('/api/subjects')
      .then(res => res.json())
      .then(data => setSubjects(data))
      .catch(err => console.error('Error fetching subjects:', err));
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetch(`/api/subjects/${selectedSubject}`)
        .then(res => res.json())
        .then(data => setTopics(data))
        .catch(err => console.error('Error fetching topics:', err));
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedSubject && selectedTopic) {
      onSelectionChange(selectedSubject, selectedTopic);
    }
  }, [selectedSubject, selectedTopic, onSelectionChange]);

  return (
    <div className="subject-selector">
      <select 
        value={selectedSubject} 
        onChange={(e) => {
          setSelectedSubject(e.target.value);
          setSelectedTopic('');
        }}
      >
        <option value="">Select Subject</option>
        {subjects.map(subject => (
          <option key={subject} value={subject}>{subject}</option>
        ))}
      </select>

      {selectedSubject && (
        <select 
          value={selectedTopic} 
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="">Select Topic</option>
          <option value="all">All Topics</option>
          {topics.map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export default SubjectSelector;