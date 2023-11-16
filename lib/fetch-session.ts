export async function fetchSession() {
    const response = await fetch('/api/auth/session');
    if (!response.ok) {
      throw new Error('Session not found. User might not be logged in.');
    }
    return response.json();
  }