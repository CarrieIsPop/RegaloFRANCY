const ANNIVERSARY = new Date("Jan 17, 2027 00:00:00").getTime();
const FIRST_MONTH = new Date("Feb 17, 2026 00:00:00").getTime();

// CORRECCIÓN: 'L' mayúscula para coincidir con tu archivo en GitHub
const playlist = [
    { title: "Lofi Love Mix 🎵", file: "assets/Lofi1.mp3" }
];
let currentIdx = 0;
const audio = new Audio(playlist[currentIdx].file);
audio.loop = true;

let compliments = [];
let seen = JSON.parse(localStorage.getItem('visto')) || [];

async function init() {
    try {
        const r = await fetch('assets/compliments.json');
        compliments = await r.json();
    } catch(e) { console.error("Error al cargar frases"); }
}

function darCumplido() {
    const p = document.getElementById("compliment-text");
    let disp = compliments.filter(c => !seen.includes(c.id));
    if (disp.length === 0) { seen = []; disp = compliments; }
    const sel = disp[Math.floor(Math.random() * disp.length)];
    seen.push(sel.id);
    localStorage.setItem('visto', JSON.stringify(seen));
    p.innerText = sel.text;
}

function escribir() {
    const msg = "Hola mi amor... hice este rincón solo para nosotros. ❤️";
    let i = 0;
    const dest = document.getElementById("typewriter");
    dest.innerHTML = "";
    const interval = setInterval(() => {
        if (msg[i] === " ") dest.innerHTML += "&nbsp;";
        else dest.innerHTML += msg[i];
        i++;
        if (i === msg.length) clearInterval(interval);
    }, 70);
}

function toggleMusica() {
    const btn = document.getElementById("play-btn");
    if (audio.paused) {
        audio.play().then(() => btn.innerText = "⏸️").catch(e => console.log("Click requerido"));
    } else {
        audio.pause();
        btn.innerText = "▶️";
    }
}

function cambiarTema() {
    const b = document.body;
    const isDark = b.getAttribute("data-theme") === "dark";
    b.setAttribute("data-theme", isDark ? "light" : "dark");
}

setInterval(() => {
    const now = new Date().getTime();
    const calc = (target, id) => {
        const el = document.getElementById(id);
        if(!el) return;
        const d = target - now;
        const dias = Math.floor(d / (1000*60*60*24));
        const horas = Math.floor((d % (1000*60*60*24)) / (1000*60*60));
        const mins = Math.floor((d % (1000*60*60)) / (1000*60));
        const segs = Math.floor((d % (1000*60)) / 1000);
        el.innerText = `${dias}d ${horas}h ${mins}m ${segs}s`;
    }
    calc(ANNIVERSARY, "timer-aniversario");
    calc(FIRST_MONTH, "timer-mes");
}, 1000);

window.onload = () => {
    init();
    setTimeout(() => {
        document.getElementById("loader").classList.add("hidden");
        document.getElementById("main-content").classList.remove("hidden");
        escribir();
    }, 4500);
}
