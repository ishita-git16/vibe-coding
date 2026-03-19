import { useState } from 'react';

export default function StudyLogForm({ onSubmit }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [hours, setHours] = useState(2);
  const [score, setScore] = useState(500);
  const [notes, setNotes] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ date, studyHours: Number(hours), mockScore: Number(score), notes });
  }

  return (
    <form className="log-form" onSubmit={handleSubmit}>
      <h2 className="form-title">📚 Log Today's Study Session</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} max={today} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Study Hours: <span className="value-badge">{hours}h</span></label>
          <input type="range" min="0" max="12" step="0.5" value={hours} onChange={e => setHours(e.target.value)} className="slider" />
          <div className="range-labels"><span>0h</span><span>6h</span><span>12h</span></div>
        </div>
        <div className="form-group">
          <label>Mock GMAT Score: <span className="value-badge">{score}</span></label>
          <input type="range" min="200" max="800" step="10" value={score} onChange={e => setScore(e.target.value)} className="slider score-slider" />
          <div className="range-labels"><span>200</span><span>500</span><span>800</span></div>
        </div>
        <div className="form-group full-width">
          <label>Notes (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What did you study today?" rows={3} />
        </div>
      </div>
      <button type="submit" className="btn-primary">🎰 LOG & SPIN!</button>
    </form>
  );
}
