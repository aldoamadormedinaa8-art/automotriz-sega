/* ═══════════════════════════════════════════════
   AUTOMOTRIZ SEGA — script.js
═══════════════════════════════════════════════ */

const WA_NUMBER = '523221187012';
const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

/* ─── NAVBAR ─── */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ─── PARTICLES ─── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = window.innerWidth < 768 ? 18 : 35;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const isYellow = Math.random() > 0.7;
    Object.assign(p.style, {
      position: 'absolute',
      width: size + 'px', height: size + 'px',
      borderRadius: '50%',
      background: isYellow ? '#ffd700' : '#e60000',
      opacity: Math.random() * 0.5 + 0.1,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      animation: `floatUp ${Math.random() * 10 + 8}s ${Math.random() * 5}s ease-in-out infinite alternate`,
    });
    container.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `@keyframes floatUp {
    0%   { transform: translate(0, 0) scale(1); }
    50%  { transform: translate(${Math.random()*30-15}px, -${Math.random()*40+20}px) scale(1.3); }
    100% { transform: translate(${Math.random()*30-15}px, ${Math.random()*20}px) scale(0.8); }
  }`;
  document.head.appendChild(style);
})();

/* ─── COUNTERS ─── */
function animateCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current).toLocaleString('es-MX');
      if (current >= target) clearInterval(interval);
    }, 16);
  });
}

/* ─── REVEAL ON SCROLL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

/* ─── STATS COUNTER OBSERVER ─── */
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

/* ─── PIEZAS TABS ─── */
document.querySelectorAll('.pieza-cat').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    document.querySelectorAll('.pieza-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.pieza-item').forEach(item => {
      item.classList.toggle('active', item.dataset.cat === cat);
    });
  });
});

/* ─── CONTACT FORM → WhatsApp ─── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const fields = contactForm.querySelectorAll('input, select, textarea');
    const nombre   = fields[0].value || 'Sin nombre';
    const telefono = fields[1].value || 'No proporcionado';
    const vehiculo = fields[2].value || 'No especificado';
    const servicio = fields[3].value || 'No especificado';
    const mensaje  = fields[4].value || '';
    const text = `Hola Automotriz Sega, les escribo desde su sitio web.\n\n*Nombre:* ${nombre}\n*Teléfono:* ${telefono}\n*Vehículo:* ${vehiculo}\n*Servicio:* ${servicio}\n*Mensaje:* ${mensaje}`;
    window.open(waLink(text), '_blank');
  });
}

/* ══════════════════════════════════════════════
   CHATBOT
══════════════════════════════════════════════ */
const chatToggleBtn = document.getElementById('chatToggle');
const chatWindow    = document.getElementById('chatbotWindow');
const chatMinBtn    = document.getElementById('chatMinimize');
const chatMessages  = document.getElementById('chatMessages');
const quickReplies  = document.getElementById('quickReplies');
const chatInput     = document.getElementById('chatInput');
const chatSend      = document.getElementById('chatSend');
const chatNotif     = document.querySelector('.chat-notif');

let chatOpen = false;
let greeted = false;

/* Bot knowledge base */
const botResponses = {
  servicio: {
    keywords: ['servicio','mantenimiento','revisión','revision','reparación','reparacion','taller','agendar','cita','aceite','frenos','bujías','bujias'],
    reply: '¿Qué tipo de servicio necesitas?\n\n🔧 Tenemos: cambio de aceite, frenos, diagnóstico computarizado, motor, eléctrico y más.\n\nTe agendo en minutos por WhatsApp.',
    actions: [
      { label: 'Agendar servicio', wa: 'Hola, quiero agendar un servicio automotriz' },
    ]
  },
  piezas: {
    keywords: ['pieza','piezas','refacción','refaccion','refacciones','parte','partes','filtro','bujía','bujia','pastilla','disco','batería','bateria','alternador'],
    reply: 'Contamos con más de *5,000 piezas* en stock.\n\n✅ Marcas originales y aftermarket de calidad.\n✅ Pedidos especiales en 24-48 hrs.\n\nDime qué necesitas y te doy precio de inmediato.',
    actions: [
      { label: 'Cotizar pieza', wa: 'Hola, busco la siguiente pieza: ' },
    ]
  },
  consultoria: {
    keywords: ['consultoría','consultoria','asesoría','asesoria','consejo','pregunta','diagnóstico','diagnostico','comprar','usado'],
    reply: '¡Nuestros expertos están para ayudarte! 🏆\n\nPodemos ayudarte con:\n• Revisión pre-compra de autos usados\n• Diagnóstico remoto\n• Presupuesto sin compromiso',
    actions: [
      { label: 'Consulta gratis', wa: 'Hola, quiero una consultoría automotriz' },
    ]
  },
  precio: {
    keywords: ['precio','costo','cuánto','cuanto','cobran','cobras','presupuesto','cotización','cotizacion','tarifa'],
    reply: 'Los precios dependen del servicio y del vehículo. ¡Pero puedo darte un presupuesto sin compromiso en minutos!\n\nCuéntame qué necesitas y te lo calculo 🎯',
    actions: [
      { label: 'Pedir cotización', wa: 'Hola, necesito cotización para: ' },
    ]
  },
  horario: {
    keywords: ['horario','hora','abierto','abren','cierran','domingo','lunes','sábado','sabado','disponible'],
    reply: '🕐 *Nuestros horarios:*\n\n📅 Lunes – Viernes: 8:00 AM – 6:00 PM\n📅 Sábado: 8:00 AM – 2:00 PM\n\n¿Quieres agendar una cita?',
    actions: [
      { label: 'Agendar cita', wa: 'Hola, quiero agendar una cita' },
    ]
  },
  ubicacion: {
    keywords: ['dónde','donde','ubicación','ubicacion','dirección','direccion','mapa','llegar','están','estan','taller'],
    reply: '📍 Estamos ubicados en la región. Para la dirección exacta contáctanos por WhatsApp y te enviamos el pin de ubicación al instante.',
    actions: [
      { label: 'Pedir ubicación', wa: 'Hola, ¿me pueden compartir su ubicación?' },
    ]
  },
  vehiculos: {
    keywords: ['auto','carro','camioneta','moto','motocicleta','pickup','suv','sedan','truck'],
    reply: 'Atendemos todo tipo de vehículos:\n\n🚗 Autos particulares\n🚙 Camionetas y Pick-up\n🏍️ Motocicletas\n\n¿Qué tienes y qué necesitas?',
    actions: [
      { label: 'Consultar por mi vehículo', wa: 'Hola, tengo un vehículo y necesito: ' },
    ]
  },
};

const quickOptions = [
  '🔧 Servicios',
  '⚙️ Piezas',
  '💬 Consultoría',
  '🕐 Horarios',
  '📍 Ubicación',
  '💰 Precios',
];

function addMessage(text, type = 'bot', withAvatar = true) {
  const wrap = document.createElement('div');
  wrap.className = `chat-msg ${type}`;

  if (withAvatar) {
    const av = document.createElement('div');
    av.className = 'msg-avatar';
    av.textContent = type === 'bot' ? '🔧' : '👤';
    wrap.appendChild(av);
  }

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = text.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  wrap.appendChild(bubble);

  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return wrap;
}

function showTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'chat-msg bot msg-typing';
  const av = document.createElement('div');
  av.className = 'msg-avatar';
  av.textContent = '🔧';
  wrap.appendChild(av);
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  wrap.appendChild(bubble);
  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return wrap;
}

function setQuickReplies(options) {
  quickReplies.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quick-reply';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleUserMessage(opt));
    quickReplies.appendChild(btn);
  });
}

function botReply(text, actions = []) {
  const typing = showTyping();
  const delay = Math.min(text.length * 12, 1200) + 400;
  setTimeout(() => {
    typing.remove();
    addMessage(text, 'bot');
    quickReplies.innerHTML = '';
    if (actions.length) {
      actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply';
        btn.textContent = '📲 ' + action.label;
        btn.addEventListener('click', () => window.open(waLink(action.wa), '_blank'));
        quickReplies.appendChild(btn);
      });
      // Always add fallback
      const fallback = document.createElement('button');
      fallback.className = 'quick-reply';
      fallback.textContent = '🔄 Otra pregunta';
      fallback.addEventListener('click', () => setQuickReplies(quickOptions));
      quickReplies.appendChild(fallback);
    } else {
      setQuickReplies(quickOptions);
    }
  }, delay);
}

function handleUserMessage(text) {
  if (!text.trim()) return;
  quickReplies.innerHTML = '';
  addMessage(text, 'user');
  chatInput.value = '';

  const lower = text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  // Check each category
  for (const [, data] of Object.entries(botResponses)) {
    if (data.keywords.some(kw => lower.includes(kw))) {
      botReply(data.reply, data.actions);
      return;
    }
  }

  // Fallback
  botReply(
    'Entendido. Para darte la información más precisa, nuestro equipo te atenderá directamente. 😊\n\n¿Prefieres continuar por WhatsApp?',
    [{ label: 'Contactar ahora', wa: 'Hola Automotriz Sega, necesito ayuda con: ' + text }]
  );
}

function greetUser() {
  if (greeted) return;
  greeted = true;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  addMessage(`${greeting}! 👋 Soy el asistente de *Automotriz Sega*.\n\n¿En qué puedo ayudarte hoy?`);
  setTimeout(() => setQuickReplies(quickOptions), 600);
}

chatToggleBtn.addEventListener('click', () => {
  chatOpen = !chatOpen;
  chatToggleBtn.classList.toggle('open', chatOpen);
  chatWindow.classList.toggle('open', chatOpen);
  if (chatNotif) chatNotif.classList.add('hidden');
  if (chatOpen) {
    greetUser();
    setTimeout(() => chatInput.focus(), 350);
  }
});

chatMinBtn.addEventListener('click', () => {
  chatOpen = false;
  chatToggleBtn.classList.remove('open');
  chatWindow.classList.remove('open');
});

chatSend.addEventListener('click', () => handleUserMessage(chatInput.value));
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleUserMessage(chatInput.value);
});

/* ─── Auto-open greeting after 4s ─── */
setTimeout(() => {
  if (!chatOpen && chatNotif) {
    chatNotif.classList.remove('hidden');
  }
}, 4000);

/* ─── Active nav link on scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

/* ══════════════════════════════════════════════
   AGENDA / CALENDARIO
══════════════════════════════════════════════ */
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_SEMANA = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];

let agendaState = {
  servicio: '',
  fecha: null,      // Date object
  hora: '',
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
};

const overlay    = document.getElementById('agendaOverlay');
const step1El    = document.getElementById('step1');
const step2El    = document.getElementById('step2');
const step3El    = document.getElementById('step3');
const step4El    = document.getElementById('step4');
const stepEls    = [step1El, step2El, step3El, step4El];
const stepDots   = document.querySelectorAll('.agenda-step');

function abrirAgenda(servicioPreset = '') {
  agendaState = { servicio: '', fecha: null, hora: '', calYear: new Date().getFullYear(), calMonth: new Date().getMonth() };
  irAStep(1);
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (servicioPreset) {
    const btn = document.querySelector(`.servicio-opt[data-servicio="${servicioPreset}"]`);
    if (btn) {
      document.querySelectorAll('.servicio-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      agendaState.servicio = servicioPreset;
      document.getElementById('step1Next').disabled = false;
      document.getElementById('agendaSubtitle').textContent = servicioPreset;
    }
  }
}

function cerrarAgenda() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('agendaClose').addEventListener('click', cerrarAgenda);
overlay.addEventListener('click', e => { if (e.target === overlay) cerrarAgenda(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarAgenda(); });

function irAStep(n) {
  stepEls.forEach((el, i) => el.classList.toggle('hidden', i !== n - 1));
  stepDots.forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 === n) dot.classList.add('active');
    else if (i + 1 < n) dot.classList.add('done');
  });
  document.querySelector('.agenda-modal').scrollTop = 0;
}

/* ── Step 1: Servicio ── */
document.querySelectorAll('.servicio-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.servicio-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    agendaState.servicio = btn.dataset.servicio;
    document.getElementById('step1Next').disabled = false;
    document.getElementById('agendaSubtitle').textContent = agendaState.servicio;
  });
});

document.getElementById('step1Next').addEventListener('click', () => {
  renderCalendario();
  irAStep(2);
});

/* ── Step 2: Calendario ── */
function renderCalendario() {
  const { calYear, calMonth } = agendaState;
  document.getElementById('calMonthLabel').textContent = `${MESES[calMonth]} ${calYear}`;

  const container = document.getElementById('calDays');
  container.innerHTML = '';

  const today = new Date(); today.setHours(0,0,0,0);
  const firstDay = new Date(calYear, calMonth, 1);
  // Monday=0 offset
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6; // Sunday → end

  for (let i = 0; i < startOffset; i++) {
    const blank = document.createElement('div');
    blank.className = 'cal-day empty';
    container.appendChild(blank);
  }

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(calYear, calMonth, d);
    const dow = date.getDay(); // 0=Sun
    const isPast = date < today;
    const isSunday = dow === 0;
    const isToday = date.getTime() === today.getTime();
    const isSelected = agendaState.fecha && date.getTime() === agendaState.fecha.getTime();

    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    if (isPast || isSunday) el.classList.add(isSunday ? 'disabled' : 'past');
    if (isToday) el.classList.add('today');
    if (isSelected) el.classList.add('selected');

    if (!isPast && !isSunday) {
      el.addEventListener('click', () => {
        agendaState.fecha = date;
        document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        document.getElementById('step2Next').disabled = false;
      });
    }
    container.appendChild(el);
  }
}

document.getElementById('calPrev').addEventListener('click', () => {
  agendaState.calMonth--;
  if (agendaState.calMonth < 0) { agendaState.calMonth = 11; agendaState.calYear--; }
  renderCalendario();
});
document.getElementById('calNext').addEventListener('click', () => {
  agendaState.calMonth++;
  if (agendaState.calMonth > 11) { agendaState.calMonth = 0; agendaState.calYear++; }
  renderCalendario();
});

document.getElementById('step2Back').addEventListener('click', () => irAStep(1));
document.getElementById('step2Next').addEventListener('click', () => {
  renderHorarios();
  irAStep(3);
});

/* ── Step 3: Horarios ── */
function renderHorarios() {
  const d = agendaState.fecha;
  const dow = d.getDay(); // 0=Dom,6=Sáb
  const esSabado = dow === 6;
  const slots = esSabado
    ? ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM']
    : ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];

  const label = `${DIAS_SEMANA[dow === 0 ? 6 : dow - 1]} ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
  document.getElementById('stepDateLabel').textContent = `📅 ${label}`;

  const container = document.getElementById('timeSlots');
  container.innerHTML = '';
  slots.forEach(slot => {
    const btn = document.createElement('button');
    btn.className = 'time-slot';
    btn.textContent = slot;
    if (slot === agendaState.hora) btn.classList.add('selected');
    btn.addEventListener('click', () => {
      agendaState.hora = slot;
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('step3Next').disabled = false;
    });
    container.appendChild(btn);
  });
}

document.getElementById('step3Back').addEventListener('click', () => irAStep(2));
document.getElementById('step3Next').addEventListener('click', () => {
  renderResumen();
  irAStep(4);
});

/* ── Step 4: Confirmar ── */
function renderResumen() {
  const d = agendaState.fecha;
  const dow = d.getDay();
  const label = `${DIAS_SEMANA[dow === 0 ? 6 : dow - 1]} ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
  const summary = document.getElementById('agendaSummary');
  summary.innerHTML = `
    <div class="sum-row"><span class="sum-label">Servicio</span><span class="sum-value">${agendaState.servicio}</span></div>
    <div class="sum-row"><span class="sum-label">Fecha</span><span class="sum-value" style="text-transform:capitalize">${label}</span></div>
    <div class="sum-row"><span class="sum-label">Hora</span><span class="sum-value">${agendaState.hora}</span></div>
  `;
}

document.getElementById('step4Back').addEventListener('click', () => irAStep(3));

document.getElementById('btnConfirmarWA').addEventListener('click', () => {
  const nombre   = document.getElementById('agendaNombre').value.trim();
  const telefono = document.getElementById('agendaTelefono').value.trim();
  const notas    = document.getElementById('agendaNotas').value.trim();

  if (!nombre || !telefono) {
    document.getElementById('agendaNombre').style.borderColor = nombre ? '' : 'var(--red)';
    document.getElementById('agendaTelefono').style.borderColor = telefono ? '' : 'var(--red)';
    return;
  }

  const d = agendaState.fecha;
  const dow = d.getDay();
  const fechaLabel = `${DIAS_SEMANA[dow === 0 ? 6 : dow - 1]} ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;

  const msg = `Hola Automotriz Sega, quiero agendar una cita 🗓️\n\n` +
    `🔧 *Servicio:* ${agendaState.servicio}\n` +
    `📅 *Fecha:* ${fechaLabel}\n` +
    `🕐 *Hora:* ${agendaState.hora}\n` +
    `👤 *Nombre:* ${nombre}\n` +
    `📱 *Teléfono:* ${telefono}` +
    (notas ? `\n📝 *Notas:* ${notas}` : '') +
    `\n\nFavor de confirmar mi cita. ¡Gracias!`;

  window.open(waLink(msg), '_blank');
});

document.getElementById('btnGcal').addEventListener('click', () => {
  const d = agendaState.fecha;
  if (!d) return;
  const pad = n => String(n).padStart(2, '0');
  const y = d.getFullYear(), m = pad(d.getMonth() + 1), day = pad(d.getDate());

  // Parse hour from slot string like "10:00 AM"
  const [timePart, ampm] = agendaState.hora.split(' ');
  let [hh, mm] = timePart.split(':').map(Number);
  if (ampm === 'PM' && hh !== 12) hh += 12;
  if (ampm === 'AM' && hh === 12) hh = 0;
  const startStr = `${y}${m}${day}T${pad(hh)}${pad(mm)}00`;
  const endStr   = `${y}${m}${day}T${pad(hh + 1)}${pad(mm)}00`;

  const nombre = document.getElementById('agendaNombre').value.trim() || 'Cliente';
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent('Cita Automotriz Sega – ' + agendaState.servicio)}` +
    `&dates=${startStr}/${endStr}` +
    `&details=${encodeURIComponent(`Servicio: ${agendaState.servicio}\nCliente: ${nombre}`)}` +
    `&location=${encodeURIComponent('Automotriz Sega')}`;

  window.open(gcalUrl, '_blank');
});
