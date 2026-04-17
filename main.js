// --- ESTADO GLOBAL ---
let vol = 50;
let isPlaying = false;
let vInterval;
let targetHeights = Array(20).fill(0);
let currentHeights = Array(20).fill(0);

// --- ELEMENTOS DEL DOM ---
const volProgress = document.getElementById('volProgress');
const volDisplay = document.getElementById('volDisplay');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const visualizer = document.getElementById('visualizer');

// Elementos del Nuevo Slider
const sliderTrack = document.getElementById('sliderTrack');
const sliderFill = document.getElementById('sliderFill');
const sliderThumb = document.getElementById('sliderThumb');

// --- LÓGICA DEL SLIDER (Sustituye a handleVolume) ---
function handleSlider(e) {
    const rect = sliderTrack.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Calculamos la posición relativa al contenedor (0 a 1)
    // rect.bottom es el 0% y rect.top es el 100%
    let percentage = ((rect.bottom - clientY) / rect.height) * 100;
    
    // Limitamos el rango entre 0 y 100
    vol = Math.max(0, Math.min(100, Math.round(percentage)));
    updateUI();
}

let isMoving = false;

// Eventos de Ratón
sliderTrack.addEventListener('mousedown', (e) => { 
    isMoving = true; 
    handleSlider(e); 
});
window.addEventListener('mousemove', (e) => { 
    if (isMoving) handleSlider(e); 
});
window.addEventListener('mouseup', () => { 
    isMoving = false; 
});

// Eventos Táctiles (iOS/Android)
sliderTrack.addEventListener('touchstart', (e) => { 
    isMoving = true; 
    handleSlider(e); 
}, { passive: false });

window.addEventListener('touchmove', (e) => { 
    if (isMoving) { 
        e.preventDefault(); // Evita que la página se mueva
        handleSlider(e); 
    } 
}, { passive: false });

window.addEventListener('touchend', () => { 
    isMoving = false; 
});

// --- ACTUALIZACIÓN DE INTERFAZ ---
function updateUI() {
    // 1. Texto central
    volDisplay.innerText = `${vol}%`;
    
    // 2. Anillo del círculo (el valor 628 es para r=100)
    const offset = 628 - (628 * vol / 100);
    volProgress.style.strokeDashoffset = offset;
    
    // 3. Slider Visual
    if (sliderFill && sliderThumb) {
        sliderFill.style.height = `${vol}%`;
        sliderThumb.style.bottom = `${vol}%`;
    }
}

// --- CONTROLES DE REPRODUCCIÓN ---
playBtn.addEventListener('click', function () {
    isPlaying = !isPlaying;
    if (isPlaying) {
        // Icono Pause
        playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        startV();
    } else {
        // Icono Play
        playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        stopV();
    }
});

// --- GESTIÓN DE ZONAS ---
function changeZone(btn, name) {
    document.querySelectorAll('.zone-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('current-zone-label').innerText = name;
}

// --- VISUALIZADOR (ECUALIZADOR) ---
function initV() {
    visualizer.innerHTML = '';
    for (let i = 0; i < 200; i++) {
        const div = document.createElement('div');
        div.className = 'bar-segment';
        visualizer.appendChild(div);
    }
}

function startV() {
    const segs = document.querySelectorAll('.bar-segment');
    if (vInterval) clearInterval(vInterval); // Limpieza de seguridad

    vInterval = setInterval(() => {
        for (let col = 0; col < 20; col++) {
            if (Math.random() > 0.8) {
                if (col < 5) targetHeights[col] = Math.random() * 5 + 3;
                else if (col < 15) targetHeights[col] = Math.random() * 10;
                else targetHeights[col] = Math.random() * 4;
            }

            currentHeights[col] += (targetHeights[col] - currentHeights[col]) * 0.15;

            for (let row = 0; row < 10; row++) {
                const index = (row * 20) + col;
                const isActive = (9 - row) < currentHeights[col];
                segs[index].classList.toggle('active', isActive);
            }

            // Actualización de dB aleatorios
            if (Math.random() > 0.5) {
                const randomDb = (Math.random() * -5 - 20).toFixed(1);
                const dbElement = document.getElementById('db-display');
                if (dbElement) dbElement.innerText = `${randomDb} dB`;
            }
        }
    }, 50);
}

function stopV() {
    clearInterval(vInterval);
    document.querySelectorAll('.bar-segment').forEach(s => s.classList.remove('active'));
}

// --- INICIALIZACIÓN ---
initV();
updateUI();