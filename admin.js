const PASSWORD_KEY = 'flashlog_admin_pw';

const gate = document.getElementById('gate');
const form = document.getElementById('post-form');
const passwordInput = document.getElementById('password-input');
const unlockBtn = document.getElementById('unlock-btn');
const gateError = document.getElementById('gate-error');
const chipSelect = document.getElementById('chip-select');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

function populateChips() {
  chipSelect.innerHTML = '';
  CONFIG.CHIPS.forEach(chip => {
    const opt = document.createElement('option');
    opt.value = chip;
    opt.textContent = chip;
    chipSelect.appendChild(opt);
  });
}

function getPassword() {
  return sessionStorage.getItem(PASSWORD_KEY) || '';
}

function showForm() {
  gate.hidden = true;
  form.hidden = false;
}

function showGate() {
  gate.hidden = false;
  form.hidden = true;
}

unlockBtn.addEventListener('click', () => {
  const pw = passwordInput.value.trim();
  if (!pw) {
    gateError.hidden = false;
    gateError.textContent = 'Enter the admin password.';
    return;
  }
  sessionStorage.setItem(PASSWORD_KEY, pw);
  gateError.hidden = true;
  showForm();
});

passwordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') unlockBtn.click();
});

populateChips();
if (getPassword()) showForm();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  formStatus.hidden = false;
  formStatus.classList.remove('status-error');
  formStatus.textContent = 'Saving…';

  const payload = {
    chip: chipSelect.value,
    title: document.getElementById('title-input').value.trim(),
    description: document.getElementById('description-input').value.trim(),
    code: document.getElementById('code-input').value,
    password: getPassword()
  };

  try {
    const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      // text/plain avoids a CORS preflight request that Apps Script doesn't handle
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      formStatus.classList.remove('status-error');
      formStatus.textContent = 'Saved — it now shows up on the public page.';
      form.reset();
      populateChips();
    } else {
      formStatus.classList.add('status-error');
      formStatus.textContent = data.error || 'Could not save that program.';
      if (data.error && data.error.toLowerCase().includes('password')) {
        sessionStorage.removeItem(PASSWORD_KEY);
        setTimeout(showGate, 1200);
      }
    }
  } catch (err) {
    formStatus.classList.add('status-error');
    formStatus.textContent = 'Network error — check the Apps Script URL in config.js.';
  } finally {
    submitBtn.disabled = false;
  }
});
