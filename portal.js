const API_BASE = 'https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com';
const COGNITO_LOGIN = 'https://YOUR_COGNITO_DOMAIN/oauth2/authorize?client_id=YOUR_CLIENT_ID&response_type=token&redirect_uri=YOUR_PORTAL_URL';

(function handleAuth() {
  // Parse token from URL hash after Cognito login
  const hash = window.location.hash.substr(1);
  const params = new URLSearchParams(hash);
  if (params.has('access_token')) {
    localStorage.setItem('accessToken', params.get('access_token'));
    window.location.hash = '';
    return;
  }
  // If no token, redirect to Cognito login
  if (!localStorage.getItem('accessToken')) {
    window.location.href = COGNITO_LOGIN;
  }
})();

document.getElementById('logoutBtn').onclick = () => {
  localStorage.removeItem('accessToken');
  window.location.reload();
};

document.getElementById('job-form').onsubmit = async (e) => {
  e.preventDefault();
  const data = {
    title:       e.target.title.value,
    company:     e.target.company.value,
    location:    e.target.location.value,
    description: e.target.description.value,
    applyUrl:    e.target.applyUrl.value,
    postedAt:    new Date().toISOString(),
  };
  try {
    const res = await fetch(`${API_BASE}/jobs`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create job');
    document.getElementById('status').textContent = '✅ Job posted!';
    document.getElementById('job-form').reset();
  } catch (err) {
    document.getElementById('status').textContent = '❌ ' + err.message;
  }
};
