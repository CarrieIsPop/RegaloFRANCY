// Configuración de Fechas (Anniversary: Jan 17)
const ANNIVERSARY = new Date("Jan 17, 2027 00:00:00").getTime();
const FIRST_MONTH = new Date("Feb 17, 2026 00:00:00").getTime();

// IMPORTANTE: 'L' mayúscula para que suene en GitHub
const playlist = [{ title: "Lofi Love Mix 🎵", file: "assets/Lofi1.mp3" }];
let currentIdx = 0;
const audio = new Audio(playlist[currentIdx].file);
audio.loop = true;

let compliments = [];
let usedIds = JSON.parse(localStorage.getItem('visto')) || [];

// 1. Cargar el JSON de halagos
async function initCompliments() {
    try {
        const resp = await fetch('assets/compliments.json');
        compliments = await resp.json();
    } catch (e) { console.log("Cargando halagos..."); }
}

// 2. Dar cumplido y desbloquear música en celular
function darCumplido() {
    if (audio.paused) {
        audio.play().then(() => {
            document.getElementById("play-btn").innerText = "⏸️";
        }).catch(e => console.log("Esperando interacción"));
    }

    const p = document.getElementById("compliment-text");
    let disponibles = compliments.filter(c => !usedIds.includes(c.id));
    if (disponibles.length === 0) { usedIds = []; disponibles = compliments; }
    const seleccionada = disponibles[Math.floor(Math.random() * disponibles.length)];
    usedIds.push(seleccionada.id);
    localStorage.setItem('visto', JSON.stringify(usedIds));

    p.style.opacity = 0;
    setTimeout(() => { p.innerText = seleccionada.text; p.style.opacity = 1; }, 300);
}

// 3. Efecto Typewriter con saltos de línea manuales
function escribir() {
    const msg = "Hola mi amor...<br>hice este rincón<br>solo para nosotros. ❤️";
    let i = 0;
    const dest = document.getElementById("typewriter");
    if (!dest) return;
    dest.innerHTML = ""; 

    const interval = setInterval(() => {
        if (msg.substring(i, i + 4) === "<br>") {
            dest.innerHTML += "<br>";
            i += 4;
        } else {
            if (msg[i] === " ") { dest.innerHTML += "&nbsp;"; }
            else { dest.innerHTML += msg[i]; }
            i++;
        }
        if (i >= msg.length) clearInterval(interval);
    }, 85); 
}

// 4. Controles de Música y Tema
function toggleMusica() {
    const btn = document.getElementById("play-btn");
    if (audio.paused) { audio.play().then(() => btn.innerText = "⏸️"); }
    else { audio.pause(); btn.innerText = "▶️"; }
}

function cambiarTema() {
    const b = document.body;
    const isDark = b.getAttribute("data-theme") === "dark";
    b.setAttribute("data-theme", isDark ? "light" : "dark");
    document.getElementById("theme-toggle").innerText = isDark ? "🌙" : "☀️";
}

// 5. Contadores de tiempo
setInterval(() => {
    const ahora = new Date().getTime();
    const calc = (target, id) => {
        const el = document.getElementById(id);
        if(!el) return;
        const d = target - ahora;
        const dias = Math.floor(d / (1000*60*60*24));
        const horas = Math.floor((d % (1000*60*60*24)) / (1000*60*60));
        const mins = Math.floor((d % (1000*60*60)) / (1000*60));
        const segs = Math.floor((d % (1000*60)) / 1000);
        el.innerText = `${dias}d ${horas}h ${mins}m ${segs}s`;
    };
    calc(ANNIVERSARY, "timer-aniversario");
    calc(FIRST_MONTH, "timer-mes");
}, 1000);

// 6. Efectos visuales (Click)
document.addEventListener('mousedown', (e) => {
    for(let i=0; i<6; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.style.left = e.pageX + 'px'; s.style.top = e.pageY + 'px';
        s.style.setProperty('--x', (Math.random()-0.5)*120+'px');
        s.style.setProperty('--y', (Math.random()-0.5)*120+'px');
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 800);
    }
});

window.onload = () => {
    initCompliments();
    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
        document.getElementById("main-content").classList.remove("hidden");
        escribir();
    }, 4500);
};
