const state = {
  posts: [],
  filterChip: 'All',
  query: ''
};

const listEl = document.getElementById('post-list');
const searchInput = document.getElementById('search-input');
const filtersEl = document.getElementById('chip-filters');
const statusEl = document.getElementById('status');

function setStatus(msg, isError) {
  if (!msg) {
    statusEl.hidden = true;
    return;
  }
  statusEl.hidden = false;
  statusEl.textContent = msg;
  statusEl.classList.toggle('status-error', !!isError);
}

function buildFilters() {
  const chips = ['All', ...CONFIG.CHIPS];
  filtersEl.innerHTML = '';
  chips.forEach(chip => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip-filter';
    btn.textContent = chip;
    if (chip === state.filterChip) btn.classList.add('is-active');
    btn.addEventListener('click', () => {
      state.filterChip = chip;
      document.querySelectorAll('.chip-filter').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      render();
    });
    filtersEl.appendChild(btn);
  });
}

function formatDate(value) {
  const d = new Date(value);
  if (isNaN(d)) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function matches(post) {
  const chipOk = state.filterChip === 'All' || post.chip === state.filterChip;
  const q = state.query.trim().toLowerCase();
  const textOk = !q
    || (post.title || '').toLowerCase().includes(q)
    || (post.description || '').toLowerCase().includes(q);
  return chipOk && textOk;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render() {
  const filtered = state.posts.filter(matches);
  listEl.innerHTML = '';

  if (filtered.length === 0) {
    setStatus(
      state.posts.length === 0
        ? 'No programs yet. Add the first one from the admin panel.'
        : 'Nothing matches that search.'
    );
    return;
  }
  setStatus(null);

  filtered.forEach(post => {
    const li = document.createElement('li');
    li.className = 'post-row';

    const header = document.createElement('button');
    header.type = 'button';
    header.className = 'post-header';
    header.setAttribute('aria-expanded', 'false');
    header.innerHTML = `
      <span class="chip-tag">${escapeHtml(post.chip)}</span>
      <span class="post-title">${escapeHtml(post.title)}</span>
      <span class="post-date">${formatDate(post.timestamp)}</span>
      <span class="chevron" aria-hidden="true"></span>
    `;

    const details = document.createElement('div');
    details.className = 'post-details';
    details.hidden = true;
    details.innerHTML = `
      ${post.description ? `<p class="post-description">${escapeHtml(post.description)}</p>` : ''}
      <div class="code-block">
        <pre><code></code></pre>
        <button type="button" class="copy-btn">Copy code</button>
      </div>
    `;
    // set code via textContent to avoid any HTML injection from stored code
    details.querySelector('code').textContent = post.code || '';

    header.addEventListener('click', () => {
      const isOpen = !details.hidden;
      details.hidden = isOpen;
      header.setAttribute('aria-expanded', String(!isOpen));
      li.classList.toggle('is-open', !isOpen);
    });

    details.querySelector('.copy-btn').addEventListener('click', async (ev) => {
      ev.stopPropagation();
      const btn = ev.currentTarget;
      try {
        await navigator.clipboard.writeText(post.code || '');
        const original = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = original; }, 1500);
      } catch (err) {
        alert('Could not copy automatically — select and copy the code manually.');
      }
    });

    li.appendChild(header);
    li.appendChild(details);
    listEl.appendChild(li);
  });
}

async function loadPosts() {
  setStatus('Loading programs…');
  try {
    const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=list`);
    const data = await res.json();
    state.posts = Array.isArray(data) ? data : [];
    render();
  } catch (err) {
    setStatus('Could not load programs. Check the Apps Script URL in config.js.', true);
  }
}

searchInput.addEventListener('input', (e) => {
  state.query = e.target.value;
  render();
});

buildFilters();
loadPosts();
