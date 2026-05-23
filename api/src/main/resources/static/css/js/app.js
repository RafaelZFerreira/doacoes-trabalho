const API = 'http://localhost:8080';
/* ---------- Toast ---------- */
function toast(msg, tipo = 'ok') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { ok: '✅', erro: '❌', aviso: '⚠️' };
  const el = document.createElement('div');
  el.className = `toast-msg ${tipo === 'ok' ? '' : tipo}`;
  el.innerHTML = `<span>${icons[tipo]}</span> ${msg}`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

/* ---------- Fetch wrapper ---------- */
async function api(path, opts = {}) {
  try {
    const resp = await fetch(API + path, {
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      ...opts
    });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(txt || `Erro ${resp.status}`);
    }
    const ct = resp.headers.get('Content-Type') || '';
    if (ct.includes('json') && resp.status !== 204) return resp.json();
    return null;
  } catch (e) {
    toast(e.message || 'Erro de conexão', 'erro');
    throw e;
  }
}

/* ---------- Active nav link ---------- */
(function markActiveNav() {
  const current = location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href')?.replace(/\/$/, '') || '';
    if (href && current.endsWith(href)) a.classList.add('active');
  });
})();

/* ---------- Confirmação de exclusão ---------- */
function confirmarExclusao(msg = 'Tem certeza que deseja excluir?') {
  return confirm(msg);
}

/* ---------- Renderizar paginação simples ---------- */
function renderPaginacao(container, pagina, totalPaginas, onChange) {
  container.innerHTML = `
    <div class="d-flex align-items-center gap-3">
      <button class="pag-btn" ${pagina === 0 ? 'disabled' : ''} onclick="(${onChange})(${pagina - 1})">← Anterior</button>
      <span class="pag-info">Página ${pagina + 1} de ${Math.max(totalPaginas, 1)}</span>
      <button class="pag-btn" ${pagina >= totalPaginas - 1 ? 'disabled' : ''} onclick="(${onChange})(${pagina + 1})">Próxima →</button>
    </div>`;
}
