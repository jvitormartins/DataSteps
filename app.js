// Utilidades
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Autenticação
const loginForm = $('#loginForm');
const loginScreen = $('#loginScreen');
const mainApp = $('#mainApp');
const PASSWORD = 'jvitormartins2025';

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = $('#password').value.trim();
    const error = $('#loginError');
    if (val === PASSWORD) {
      loginScreen.classList.add('hidden');
      mainApp.classList.remove('hidden');
      error.classList.add('hidden');
      restoreProgress();
    } else {
      error.classList.remove('hidden');
    }
  });
}

// Navegação entre tabs
const tabButtons = $$('.tab-button');
const tabContents = $$('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tabContents.forEach(c => c.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// Progresso
function updateProgress() {
  const checkboxes = $$('.recurso-checkbox');
  const checked = $$('.recurso-checkbox:checked');
  const total = checkboxes.length;
  const completed = checked.length;
  const pct = total ? Math.round((completed/total)*100) : 0;
  $('#progressPercent').textContent = `${pct}%`;
  $('#completedItems').textContent = completed;
  $('#progressBar').style.width = `${pct}%`;
  const doneNames = checked.map(cb => cb.closest('.recurso-item').querySelector('.recurso-nome').textContent.trim());
  localStorage.setItem('ds_progress_done', JSON.stringify(doneNames));
}

// Cronômetro
const timerBtn = $('#timerBtn');
const timerDisplay = $('#timerDisplay');
const totalStudyTime = $('#totalStudyTime');
const timer = {seconds:0,itv:null,running:false};

function formatTime(s) {
  const h = String(Math.floor(s/3600)).padStart(2,'0');
  const m = String(Math.floor((s%3600)/60)).padStart(2,'0');
  const ss = String(s%60).padStart(2,'0');
  return `${h}:${m}:${ss}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(timer.seconds);
  totalStudyTime.textContent = `${Math.floor(timer.seconds/3600)}h`;
}

if (timerBtn) {
  timerBtn.addEventListener('click', () => {
    if (timer.running) {
      clearInterval(timer.itv);
      timer.running = false;
      timerBtn.textContent = 'Iniciar';
    } else {
      timer.itv = setInterval(() => {
        timer.seconds++;
        renderTimer();
      },1000);
      timer.running = true;
      timerBtn.textContent = 'Pausar';
    }
  });
}

// Dark mode
const darkBtn = $('#darkModeBtn');
if (darkBtn) {
  darkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    darkBtn.textContent = document.body.classList.contains('dark') ? '☀️ Modo Claro' : '🌙 Modo Escuro';
  });
}

// Checkbox events
document.addEventListener('change', e => {
  if (e.target.classList.contains('recurso-checkbox')) updateProgress();
});

// Restaurar progresso
function restoreProgress() {
  const saved = JSON.parse(localStorage.getItem('ds_progress_done')||'[]');
  $$('.recurso-item').forEach(item => {
    const name = item.querySelector('.recurso-nome').textContent.trim();
    const cb = item.querySelector('.recurso-checkbox');
    if (saved.includes(name)) cb.checked = true;
  });
  updateProgress();
  renderTimer();
}

// Se já estiver logado como dev:
if (!loginScreen.classList.contains('hidden')) {
  /* aguarda login */
} else {
  restoreProgress();
}
