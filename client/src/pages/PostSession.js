import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/PostSession.css";

const FACES = [
  { value: 1, emoji: '😔', label: 'rough' },
  { value: 2, emoji: '😐', label: 'okay' },
  { value: 3, emoji: '🙂', label: 'good' },
  { value: 4, emoji: '😌', label: 'relieved' },
  { value: 5, emoji: '😊', label: 'really good' }
];

export default function PostSession({ onDone }) {
  const [rating, setRating] = useState(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const handleSaveNote = () => {
    if (note.trim()) {
      const existing = JSON.parse(localStorage.getItem('offload_notes') || '[]');
      existing.push({ text: note.trim(), date: new Date().toISOString() });
      localStorage.setItem('offload_notes', JSON.stringify(existing));
      setSaved(true);
    }
  };
  const handleDone = () => {

    sessionStorage.removeItem("offload_room");

    if (note.trim() && !saved) {

        handleSaveNote();

    }

    navigate("/home");

};

  

  return (
    <div className="postsession-page">
      <div className="postsession-inner">

        <div className="postsession-closing">
          this conversation stays here.<br />
          take care of yourself.
        </div>

        <div className="postsession-question">How did that feel?</div>

        <div className="postsession-faces">
          {FACES.map(f => (
            <button
              key={f.value}
              className={`postsession-face${rating === f.value ? ' is-selected' : ''}`}
              onClick={() => setRating(f.value)}
            >
              <span className="postsession-face-emoji">{f.emoji}</span>
              <span className="postsession-face-label">{f.label}</span>
            </button>
          ))}
        </div>

        <div className="postsession-divider" />

        <div className="postsession-note-label">anything you want to remember?</div>
        <textarea
          className="postsession-textarea"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="just for you — stored only on this device..."
          rows={4}
        />
        <div className="postsession-note-hint">
          {saved ? '✓ saved to this device' : 'private · never leaves your device'}
        </div>

        <button className="postsession-done-btn" onClick={handleDone}>
          done
        </button>

        <div className="postsession-nudge">
          rooms fill up most on tuesday and thursday evenings.<br />
          <button className="postsession-nudge-link" onClick={handleDone}>
            join another room →
          </button>
        </div>

      </div>
    </div>
  );
}