// Helpers
const $ = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>[...c.querySelectorAll(s)];

// Auth
$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  if($('#password').value==='jvitormartins2025'){
    $('#loginScreen').classList.add('hidden');
    $('#mainApp').classList.remove('hidden');
    restoreProgress();
  } else $('#loginError').classList.remove('hidden');
});

// Tabs
$$('.tab-button').forEach(btn=>{
  btn.onclick = ()=>{
    $$('.tab-button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    $$('.tab-content').forEach(c=>c.classList.remove('active'));
    document.getElementById(btn.dataset.target).classList.add('active');
  };
});

// Progress
function updateProgress(){
  const all = $$('.recurso-checkbox');
  const done = $$('.recurso-checkbox:checked');
  const pct = all.length? Math.round(done.length/all.length*100):0;
  $('#progressPercent').textContent=`${pct}%`;
  $('#completedItems').textContent=done.length;
  $('#progressBar').style.width=`${pct}%`;
  const saved = done.map(cb=>cb.closest('.recurso-item').querySelector('.recurso-nome').textContent.trim());
  localStorage.setItem('ds_done', JSON.stringify(saved));
}
document.addEventListener('change',e=>{
  if(e.target.classList.contains('recurso-checkbox')) updateProgress();
});

// Timer
let sec=0,itv,run=false;
$('#timerBtn').onclick = ()=>{
  if(run){ clearInterval(itv); $('#timerBtn').textContent='Iniciar'; run=false; }
  else{
    itv = setInterval(()=>{
      sec++; const h=Math.floor(sec/3600), m=Math.floor(sec%3600/60), s=sec%60;
      $('#timerDisplay').textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      $('#totalStudyTime').textContent=`${h}h`;
    },1000);
    $('#timerBtn').textContent='Pausar'; run=true;
  }
};

// Dark Mode
$('#darkModeBtn').onclick = ()=>{
  document.body.classList.toggle('dark');
  $('#darkModeBtn').textContent = document.body.classList.contains('dark')?'☀️':'🌙';
};

// Restore
function restoreProgress(){
  const saved = JSON.parse(localStorage.getItem('ds_done')||'[]');
  $$('.recurso-item').forEach(item=>{
    const cb = item.querySelector('.recurso-checkbox');
    if(saved.includes(item.querySelector('.recurso-nome').textContent.trim())) cb.checked=true;
  });
  updateProgress();
}

// Initialize if already logged
if(!$('#loginScreen').classList.contains('hidden')){/*await login*/}
else restoreProgress();
