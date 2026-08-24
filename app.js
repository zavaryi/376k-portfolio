/**
 * 376K.XYZ - Dynamic Application Script
 * Interactive Terminal, Filtering, Cursor Follower, Responsive Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  // Update year
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

  // 1. Ambient Cursor Glow Follower
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const renderCursor = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();
  }

  // 2. Navbar Scroll Glass Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Mobile Navigation Menu Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = navToggle.querySelector('i');
      if (navMenu.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // 4. Project Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Interactive Terminal Sandbox Engine
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const clearTerminalBtn = document.getElementById('clearTerminalBtn');
  const quickCmdBtns = document.querySelectorAll('.quick-cmd');

  const commands = {
    help: () => `
<div class="term-response">
  <p><strong>Available Commands:</strong></p>
  <p><span class="term-cmd-hint">about</span>    - Brief overview of 376K</p>
  <p><span class="term-cmd-hint">skills</span>   - List core technical stack & systems</p>
  <p><span class="term-cmd-hint">projects</span> - View highlighted portfolio projects</p>
  <p><span class="term-cmd-hint">contact</span>  - Display contact channels</p>
  <p><span class="term-cmd-hint">whoami</span>   - Print current visitor session info</p>
  <p><span class="term-cmd-hint">uptime</span>   - Print site uptime status</p>
  <p><span class="term-cmd-hint">socials</span>  - Direct links to GitHub & Discord</p>
  <p><span class="term-cmd-hint">clear</span>    - Clear terminal screen</p>
</div>`,

    about: () => `
<div class="term-response">
  <p><strong>Identity:</strong> 376K</p>
  <p><strong>Role:</strong> Creative Full-Stack Engineer & Cloud Systems Architect</p>
  <p><strong>Focus:</strong> Ultra-fast edge web apps, Discord RPC microservices, and modern UX.</p>
</div>`,

    skills: () => `
<div class="term-response">
  <p><strong>Languages:</strong> JavaScript (ES6+), TypeScript, Node.js, Python, HTML5, CSS3</p>
  <p><strong>Cloud/Edge:</strong> Cloudflare (Pages, Workers), Docker, Kubernetes, Linux</p>
  <p><strong>Frameworks:</strong> React, Next.js, Express, Tailwind/Vanilla CSS</p>
  <p><strong>Storage:</strong> PostgreSQL, Redis, SQLite</p>
</div>`,

    projects: () => `
<div class="term-response">
  <p>1. <strong>Cloud RPC Gateway</strong> - Containerized Discord Rich Presence server</p>
  <p>2. <strong>376k.xyz Portal</strong> - Edge deployed portfolio on Cloudflare Pages</p>
  <p>3. <strong>CyberCLI Web Terminal</strong> - In-browser shell engine with dynamic commands</p>
  <p>4. <strong>Rest API & Microservice Hub</strong> - Secure modular API service</p>
</div>`,

    contact: () => `
<div class="term-response">
  <p>🌐 <strong>Domain:</strong> 376k.xyz</p>
  <p>💬 <strong>Discord:</strong> @376K</p>
  <p>🐙 <strong>GitHub:</strong> github.com</p>
</div>`,

    whoami: () => `
<div class="term-response">
  <p>User: guest@376k.xyz</p>
  <p>Host: Cloudflare Edge Network</p>
  <p>Protocol: HTTPS / HTTP/3</p>
</div>`,

    uptime: () => `
<div class="term-response">
  <p>🟢 System Status: 100% Operational</p>
  <p>Edge Nodes: Active Worldwide via Cloudflare Pages</p>
</div>`,

    socials: () => `
<div class="term-response">
  <p><a href="https://github.com" target="_blank" style="color:var(--accent-cyan);">GitHub ↗</a></p>
  <p><a href="https://discord.com" target="_blank" style="color:var(--accent-indigo);">Discord ↗</a></p>
</div>`,

    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    },

    sudo: () => `<div class="term-response" style="color:var(--accent-rose);">Permission denied: Nice try! 😉</div>`
  };

  const handleCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Echo input
    const inputEcho = document.createElement('div');
    inputEcho.className = 'term-line';
    inputEcho.innerHTML = `<span class="terminal-prompt">guest@376k.xyz:~$</span> <span>${escapeHtml(rawCmd)}</span>`;
    terminalOutput.appendChild(inputEcho);

    if (cmd === 'clear') {
      commands.clear();
      return;
    }

    const outputDiv = document.createElement('div');
    outputDiv.className = 'term-line';

    if (commands[cmd]) {
      outputDiv.innerHTML = commands[cmd]();
    } else {
      outputDiv.innerHTML = `<p style="color:var(--accent-rose);">Command not found: "${escapeHtml(rawCmd)}". Type <span class="term-cmd-hint">help</span> for a list of commands.</p>`;
    }

    terminalOutput.appendChild(outputDiv);
    const terminalBody = document.getElementById('terminalBody');
    if (terminalBody) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  };

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        terminalInput.value = '';
        handleCommand(val);
      }
    });
  }

  if (clearTerminalBtn) {
    clearTerminalBtn.addEventListener('click', () => {
      commands.clear();
      showToast('Terminal cleared');
    });
  }

  quickCmdBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) handleCommand(cmd);
    });
  });

  // 6. Contact Form Simulation & Toast Notification
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('btnSubmitMessage');
      const formStatus = document.getElementById('formStatus');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        }
        contactForm.reset();
        showToast('🚀 Message received! Thanks for reaching out.');
      }, 1000);
    });
  }
});
