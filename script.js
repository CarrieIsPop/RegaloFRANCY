const ANNIVERSARY = new Date("Jan 17, 2027 00:00:00").getTime();
const FIRST_MONTH = new Date("Feb 17, 2026 00:00:00").getTime();

// IMPORTANTE: 'L' mayúscula para GitHub
const playlist = [{ title: "Lofi Love Mix 🎵", file: "assets/Lofi1.mp3" }];
let currentIdx = 0;
const audio = new Audio(playlist[currentIdx].file);
audio.loop = true;

let compliments = [];
let usedIds = JSON.parse(localStorage.getItem('visto')) || [];

async function initCompliments() {
    try {
        const resp = await fetch('assets/compliments.json');
        compliments = await resp.json();
    } catch (e) { console.log("Cargando base de datos..."); }
}

function darCumplido() {
    // Esto hace que la música empiece a sonar al primer toque en celular
    if (audio.paused) {
        audio.play().then(() => {
            document.getElementById("play-btn").innerText = "⏸️";
        }).catch(e => console.log("Esperando click del usuario"));
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

function escribir() {
    const msg = "Hola mi amor... hice este rincon solo para nosotros. ❤️";
    let i = 0;
    const dest = document.getElementById("typewriter");
    dest.innerHTML = ""; 
    const interval = setInterval(() => {
        if (msg[i] === " ") { dest.innerHTML += "&nbsp;"; } // Arreglo de los espacios
        else { dest.innerHTML += msg[i]; }
        i++;
        if (i === msg.length) clearInterval(interval);
    }, 75);
}

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

document.addEventListener('mousedown', (e) => {
    for(let i=0; i<6; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.style.left = e.pageX + 'px'; s.style.top = e.pageY + 'px';
        s.style.setProperty('--x', (Math.random()-0.5)*100+'px');
        s.style.setProperty('--y', (Math.random()-0.5)*100+'px');
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
