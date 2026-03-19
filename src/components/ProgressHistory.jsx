export default function ProgressHistory({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="history-container">
        <h2>📈 Study History</h2>
        <p className="empty-msg">No study sessions logged yet. Start your GMAT journey!</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2>📈 Study History</h2>
      <div className="table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Hours</th>
              <th>Score</th>
              <th>Reward</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className={i === 0 ? 'latest-row' : ''}>
                <td>{log.date}</td>
                <td><span className="badge hours-badge">{log.studyHours}h</span></td>
                <td><span className="badge score-badge">{log.mockScore}</span></td>
                <td>{log.reward ? `${log.reward.emoji} ${log.reward.label}` : '—'}</td>
                <td className="notes-cell">{log.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
