// Replace with your real API invoke URL
const API_BASE = 'https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com';

async function fetchJobs() {
  try {
    const res = await fetch(`${API_BASE}/jobs`);
    const jobs = await res.json();
    const container = document.getElementById('jobs-container');
    container.innerHTML = '';
    jobs.sort((a,b)=> new Date(b.postedAt)-new Date(a.postedAt))
        .forEach(job => {
      const card = document.createElement('div');
      card.className = 'job-card';
      card.innerHTML = `
        <h3>${job.title}</h3>
        <p><strong>${job.company}</strong> — ${job.location}</p>
        <p>${job.description.substring(0,100)}…</p>
        <a href="${job.applyUrl}" target="_blank" class="apply-btn">Apply</a>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load jobs', err);
  }
}

window.addEventListener('DOMContentLoaded', fetchJobs);
