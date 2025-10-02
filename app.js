// Utilitários
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

// Configurações
const CONFIG = {
  password: 'jvitormartins2025',
  storageKeys: {
    progress: 'datasteps_progress',
    timer: 'datasteps_timer'
  }
};

// Sistema de Autenticação
class AuthSystem {
  constructor() {
    this.loginForm = $('#loginForm');
    this.loginScreen = $('#loginScreen');
    this.mainApp = $('#mainApp');
    this.passwordInput = $('#password');
    this.errorDiv = $('#loginError');
    
    this.init();
  }
  
  init() {
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }
  }
  
  handleLogin(e) {
    e.preventDefault();
    const password = this.passwordInput.value.trim();
    
    if (password === CONFIG.password) {
      this.loginScreen.classList.add('hidden');
      this.mainApp.classList.remove('hidden');
      this.errorDiv.classList.add('hidden');
      
      // Inicializar sistemas após login
      window.progressSystem.init();
      window.timerSystem.init();
    } else {
      this.errorDiv.classList.remove('hidden');
      this.passwordInput.value = '';
      this.passwordInput.focus();
    }
  }
}

// Sistema de Abas
class TabSystem {
  constructor() {
    this.tabButtons = $$('.tab-button');
    this.tabContents = $$('.tab-content');
    
    this.init();
  }
  
  init() {
    this.tabButtons.forEach(button => {
      button.addEventListener('click', (e) => this.switchTab(e));
    });
  }
  
  switchTab(e) {
    const targetTab = e.target.getAttribute('data-target');
    
    // Remover classe active de todos os botões e conteúdos
    this.tabButtons.forEach(btn => btn.classList.remove('active'));
    this.tabContents.forEach(content => content.classList.remove('active'));
    
    // Adicionar classe active ao botão clicado e conteúdo correspondente
    e.target.classList.add('active');
    const targetContent = document.getElementById(targetTab);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  }
}

// Sistema de Progresso
class ProgressSystem {
  constructor() {
    this.progressPercent = $('#progressPercent');
    this.completedItems = $('#completedItems');
    this.progressBar = $('#progressBar');
    this.checkboxes = [];
  }
  
  init() {
    this.checkboxes = $$('.recurso-checkbox');
    this.loadProgress();
    this.bindEvents();
    this.updateProgress();
  }
  
  bindEvents() {
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('recurso-checkbox')) {
        this.updateProgress();
        this.saveProgress();
      }
    });
  }
  
  updateProgress() {
    const total = this.checkboxes.length;
    const completed = this.checkboxes.filter(checkbox => checkbox.checked).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Atualizar elementos da interface
    if (this.progressPercent) this.progressPercent.textContent = `${percentage}%`;
    if (this.completedItems) this.completedItems.textContent = completed;
    if (this.progressBar) this.progressBar.style.width = `${percentage}%`;
  }
  
  saveProgress() {
    const completedResources = this.checkboxes
      .filter(checkbox => checkbox.checked)
      .map(checkbox => {
        const recursoItem = checkbox.closest('.recurso-card');
        return recursoItem ? recursoItem.querySelector('.recurso-nome').textContent.trim() : null;
      })
      .filter(Boolean);
    
    localStorage.setItem(CONFIG.storageKeys.progress, JSON.stringify(completedResources));
  }
  
  loadProgress() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKeys.progress);
      if (!saved) return;
      
      const completedResources = JSON.parse(saved);
      
      this.checkboxes.forEach(checkbox => {
        const recursoItem = checkbox.closest('.recurso-card');
        if (recursoItem) {
          const resourceName = recursoItem.querySelector('.recurso-nome').textContent.trim();
          if (completedResources.includes(resourceName)) {
            checkbox.checked = true;
          }
        }
      });
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }
  }
}

// Sistema de Cronômetro
class TimerSystem {
  constructor() {
    this.timerDisplay = $('#timerDisplay');
    this.timerBtn = $('#timerBtn');
    this.totalStudyTime = $('#totalStudyTime');
    
    this.seconds = 0;
    this.interval = null;
    this.isRunning = false;
  }
  
  init() {
    this.loadTimer();
    this.bindEvents();
    this.updateDisplay();
  }
  
  bindEvents() {
    if (this.timerBtn) {
      this.timerBtn.addEventListener('click', () => this.toggleTimer());
    }
  }
  
  toggleTimer() {
    if (this.isRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }
  
  startTimer() {
    this.interval = setInterval(() => {
      this.seconds++;
      this.updateDisplay();
      this.saveTimer();
    }, 1000);
    
    this.isRunning = true;
    if (this.timerBtn) this.timerBtn.textContent = 'Pausar';
  }
  
  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    this.isRunning = false;
    if (this.timerBtn) this.timerBtn.textContent = 'Iniciar';
  }
  
  updateDisplay() {
    const hours = Math.floor(this.seconds / 3600);
    const minutes = Math.floor((this.seconds % 3600) / 60);
    const seconds = this.seconds % 60;
    
    const timeString = [hours, minutes, seconds]
      .map(val => val.toString().padStart(2, '0'))
      .join(':');
    
    if (this.timerDisplay) this.timerDisplay.textContent = timeString;
    if (this.totalStudyTime) this.totalStudyTime.textContent = `${hours}h`;
  }
  
  saveTimer() {
    localStorage.setItem(CONFIG.storageKeys.timer, this.seconds.toString());
  }
  
  loadTimer() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKeys.timer);
      if (saved) {
        this.seconds = parseInt(saved, 10) || 0;
      }
    } catch (error) {
      console.error('Erro ao carregar timer:', error);
    }
  }
}

// Sistema de Modo Escuro
class DarkModeSystem {
  constructor() {
    this.darkModeBtn = $('#darkModeBtn');
    this.init();
  }
  
  init() {
    if (this.darkModeBtn) {
      this.darkModeBtn.addEventListener('click', () => this.toggleDarkMode());
    }
    
    // Carregar preferência salva
    this.loadDarkModePreference();
  }
  
  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    if (this.darkModeBtn) {
      this.darkModeBtn.textContent = isDark ? '☀️' : '🌙';
    }
    
    // Salvar preferência
    localStorage.setItem('datasteps_dark_mode', isDark);
  }
  
  loadDarkModePreference() {
    const isDark = localStorage.getItem('datasteps_dark_mode') === 'true';
    
    if (isDark) {
      document.body.classList.add('dark-mode');
      if (this.darkModeBtn) this.darkModeBtn.textContent = '☀️';
    }
  }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar sistemas
  window.authSystem = new AuthSystem();
  window.tabSystem = new TabSystem();
  window.progressSystem = new ProgressSystem();
  window.timerSystem = new TimerSystem();
  window.darkModeSystem = new DarkModeSystem();
  
  console.log('DataSteps carregado com sucesso! 🚀');
});

// Tratamento de erros global
window.addEventListener('error', (e) => {
  console.error('Erro na aplicação:', e.error);
});

// Prevenir perda de dados ao sair
window.addEventListener('beforeunload', (e) => {
  if (window.timerSystem && window.timerSystem.isRunning) {
    window.timerSystem.saveTimer();
  }
  if (window.progressSystem) {
    window.progressSystem.saveProgress();
  }
});
