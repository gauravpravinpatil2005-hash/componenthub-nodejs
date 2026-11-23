const form = document.getElementById('requestForm');
const banner = document.getElementById('banner');
const rows = document.getElementById('rows');

function showBanner(type, text) {
  banner.className = 'banner ' + type;
  banner.textContent = text;
}
function clearErrors() {
  form.querySelectorAll('.err').forEach((e) => (e.textContent = ''));
  form.querySelectorAll('.invalid').forEach((e) => e.classList.remove('invalid'));
}
function showErrors(errors) {
  Object.entries(errors).forEach(([field, msg]) => {
    const span = form.querySelector(`.err[data-for="${field}"]`);
    const input = form.elements[field];
    if (span) span.textContent = msg;
    if (input) input.classList.add('invalid');
  });
}
function esc(s) {
  const d = document.createElement('div'); d.textContent = s; return d.innerHTML;
}

async function loadRequests() {
  const res = await fetch('/api/requests');
  const data = await res.json();
  if (!data.requests.length) { rows.innerHTML = '<tr><td colspan="7">No requests yet.</td></tr>'; return; }
  rows.innerHTML = data.requests.map((r) => `<tr>
    <td>${esc(r.requestId)}</td><td>${esc(r.name)}</td><td>${esc(r.componentName)}</td>
    <td>${r.quantity}</td><td>${esc(r.labDate)}</td><td>${esc(r.priority)}</td><td>${esc(r.status)}</td></tr>`).join('');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();
  banner.className = 'banner hidden';
  const payload = Object.fromEntries(new FormData(form).entries()); // no client-side validation on purpose
  try {
    const res = await fetch('/api/requests', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) {
      showBanner('error', data.message + ' Please correct the highlighted fields.');
      if (data.errors) showErrors(data.errors);
      return;
    }
    showBanner('success', `${data.message} Request ID: ${data.request.requestId} | Priority: ${data.request.priority} | Status: ${data.request.status}`);
    form.reset();
    loadRequests();
  } catch (err) {
    showBanner('error', 'Could not reach the server. Try again.');
  }
});

document.getElementById('refresh').addEventListener('click', loadRequests);
loadRequests();
