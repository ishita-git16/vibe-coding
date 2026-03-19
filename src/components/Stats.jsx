export default function Stats({ logs, streak }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="stats-container">
        <h2>📊 Statistics</h2>
        <p className="empty-msg">Log your first session to see stats!</p>
      </div>
    );
  }

  const totalHours = logs.reduce((sum, l) => sum + (l.studyHours || 0), 0);
  const scores = logs.filter(l => l.mockScore).map(l => l.mockScore);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;

  return (
    <div className="stats-container">
      <h2>📊 Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card streak-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{totalHours.toFixed(1)}</div>
          <div className="stat-label">Total Hours</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{avgScore}</div>
          <div className="stat-label">Avg Score</div>
        </div>
        <div className="stat-card best-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{bestScore}</div>
          <div className="stat-label">Best Score</div>
        </div>
      </div>
    </div>
  );
}
