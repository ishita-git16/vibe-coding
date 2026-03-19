const STORAGE_KEY = 'gmat_study_logs';

export function getLogs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveLog(entry) {
  const logs = getLogs();
  logs.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  return logs;
}

export function clearLogs() {
  localStorage.removeItem(STORAGE_KEY);
}
