// Fechas Importantes
const ANNIVERSARY = new Date("Jan 17, 2027 00:00:00").getTime();
const FIRST_MONTH = new Date("Feb 17, 2026 00:00:00").getTime();

// Configuración de Música (Asegúrate de tener lofi1.mp3 en assets)
const playlist = [
    { title: "Lofi Love Mix 🎵", file: "assets/lofi1.mp3" },
    { title: "Dulces Sueños ✨", file: "assets/lofi2.mp3" }
];
let currentSongIndex = 0;
const audio = new Audio(playlist[currentSongIndex].file);
audio.loop = true;

let compliments = [];
let usedIds = JSON.parse(localStorage.getItem('visto')) || [];

// 1. Iniciar Frases (JSON)
async function initCompliments() {
    try {
        const resp = await fetch('assets/compliments.json');
        compliments = await resp.json();
    } catch (e) {
        console.log("No se encontró el JSON todavía.");
    }
}

// 2. Lógica de Cumplidos sin Repetir
function darCumplido() {
    const p = document.getElementById("compliment-text");
    let disponibles = compliments.filter(c => !usedIds.includes(c.id));

    if (disponibles.length === 0) {
        usedIds = []; // Reiniciar ciclo
        disponibles = compliments;
    }

    const index = Math.floor(Math.random() * disponibles.length);
    const seleccionada = disponibles[index];

    usedIds.push(seleccionada.id);
    localStorage.setItem('visto', JSON.stringify(usedIds));

    p.style.opacity = 0;
    setTimeout(() => {
        p.innerText = seleccionada.text;
        p.style.opacity = 1;
    }, 300);
}

// 3. Escritura con Espacios
function escribir() {
    // Asegúrate de que los espacios estén presentes dentro de las comillas
    const msg = "Hola mi amor... hice este rincon solo para nosotros. ❤️";
    let i = 0;
    const dest = document.getElementById("typewriter");
    
    if (!dest) return; // Seguridad de código
    dest.innerHTML = ""; 

    const interval = setInterval(() => {
        // Usamos un pequeño truco: si el caracter es un espacio, usamos el espacio de no ruptura
        if (msg[i] === " ") {
            dest.innerHTML += "&nbsp;";
        } else {
            dest.innerHTML += msg[i];
        }
        
        i++;
        if (i === msg.length) {
            clearInterval(interval);
        }
    }, 90); // Un poquito más lento para que sea más romántico
}

// 4. Lógica de Música (Iconos Play/Pause)
function toggleMusica() {
    const btn = document.getElementById("play-btn");
    if (audio.paused) {
        audio.play().then(() => {
            btn.innerText = "⏸️"; 
        }).catch(err => console.log("Clic necesario para sonar"));
    } else {
        audio.pause();
        btn.innerText = "▶️";
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    cambiarCancion();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    cambiarCancion();
}

function cambiarCancion() {
    audio.src = playlist[currentSongIndex].file;
    document.getElementById("song-title").innerText = playlist[currentSongIndex].title;
    audio.play();
    document.getElementById("play-btn").innerText = "⏸️";
}

// 5. Contadores
setInterval(() => {
    const ahora = new Date().getTime();
    const calc = (target, id) => {
        const el = document.getElementById(id);
        if(!el) return;
        const d = target - ahora;
        const dias = Math.floor(d / (1000 * 60 * 60 * 24));
        const horas = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
        const segs = Math.floor((d % (1000 * 60)) / 1000);
        el.innerText = `${dias}d ${horas}h ${mins}m ${segs}s`;
    };
    calc(ANNIVERSARY, "timer-aniversario");
    calc(FIRST_MONTH, "timer-mes");
}, 1000);

// 6. Tema y Brillos
function cambiarTema() {
    const b = document.body;
    const isDark = b.getAttribute("data-theme") === "dark";
    b.setAttribute("data-theme", isDark ? "light" : "dark");
    document.getElementById("theme-toggle").innerText = isDark ? "🌙" : "☀️";
}

document.addEventListener('mousedown', (e) => {
    for(let i=0; i<8; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.style.left = e.pageX + 'px';
        s.style.top = e.pageY + 'px';
        s.style.setProperty('--x', (Math.random()-0.5)*120+'px');
        s.style.setProperty('--y', (Math.random()-0.5)*120+'px');
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 800);
    }
});

// Carga Inicial
window.onload = () => {
    initCompliments();
    setTimeout(() => {
        document.getElementById("loader").classList.add("hidden");
        document.getElementById("main-content").classList.remove("hidden");
        escribir();
    }, 4500);
};