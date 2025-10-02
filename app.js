// Helpers
const $ = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>[...c.querySelectorAll(s)];

// Auth
$('#loginForm').addEventListener('submit',e=>{
  e.preventDefault();
  if($('#password').value==='jvitormartins2025'){
    $('#loginScreen').classList.add('hidden');
    $('#mainApp').classList.remove('hidden');
    restore();
  } else $('#loginError').classList.remove('hidden');
});

// Tabs
$$('.tab-button').forEach(btn=>{
  btn.onclick=()=>{
    $$('.tab-button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    $$('.tab-content').forEach(c=>c.classList.remove('active'));
    document.getElementById(btn.dataset.target).classList.add('active');
  };
});

// Progress
function updateProgress(){
  const checks=$$('.recurso-checkbox');
  const done=$$('.recurso-checkbox:checked').length;
  const total=checks.length;
  const pct=total?Math.round(done/total*100):0;
  $('#progressPercent').textContent=`${pct}%`;
  $('#completedItems').textContent=done;
  $('.progress-bar').style.width=`${pct}%`;
  localStorage.setItem('ds_done',JSON.stringify($$('.recurso-checkbox:checked').map(cb=>cb.closest('.recurso-item').innerText)));
}
document.addEventListener('change',e=>e.target.classList.contains('recurso-checkbox')&&updateProgress());

// Timer
let sec=0,run=false,itv;
$('#timerBtn').onclick=()=>{
  if(run){clearInterval(itv);$('#timerBtn').textContent='Iniciar'; run=false;}
  else{itv=setInterval(()=>{sec++;const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;$('#timerDisplay').textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;$('#totalStudyTime').textContent=`${h}h`;},1000);$('#timerBtn').textContent='Pausar';run=true;}
};

// Dark mode
$('#darkModeBtn').onclick=()=>{
  document.body.classList.toggle('dark');
  $('#darkModeBtn').textContent=document.body.classList.contains('dark')?'☀️':'🌙';
};

// Restore
function restore(){
  const done=JSON.parse(localStorage.getItem('ds_done')||'[]');
  $$('.recurso-item').forEach(item=>{
    const cb=item.querySelector('.recurso-checkbox');
    if(done.includes(item.innerText))cb.checked=true;
  });
  updateProgress();
}
