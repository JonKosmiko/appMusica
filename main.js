let vol = 50;
let isPlaying = false;
let vInterval;
let targetHeights = Array(20).fill(0);
let currentHeights = Array(20).fill(0);

const volProgress = document.getElementById('volProgress');
const volDisplay = document.getElementById('volDisplay');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const visualizer = document.getElementById('visualizer');
const volSlider = document.getElementById('volSlider');

// ÚNICO CONTROL: Escuchar al slider
volSlider.addEventListener('input', (e) => {
    vol = parseInt(e.target.value);
    updateUI();
});

// Actualiza toda la interfaz basándose en la variable 'vol'
function updateUI() {
    // 1. Texto central
    volDisplay.innerText = `${vol}%`;
    
    // 2. Anillo del círculo (el 565 es por tu stroke-dasharray anterior, ajústalo si es necesario)
    const offset = 628 - (628 * vol / 100); 
    volProgress.style.strokeDashoffset = offset;
}

// Lógica de Play/Pause (sin cambios)
playBtn.addEventListener('click', function () {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        startV();
    } else {
        playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        stopV();
    }
});

// Lógica del Visualizador y Zonas (sin cambios)
function changeZone(btn, name) {
    document.querySelectorAll('.zone-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('current-zone-label').innerText = name;
}

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
    vInterval = setInterval(() => {
        for (let col = 0; col < 20; col++) {
            if (Math.random() > 0.8) {
                targetHeights[col] = col < 5 ? Math.random() * 5 + 3 : (col < 15 ? Math.random() * 10 : Math.random() * 4);
            }
            currentHeights[col] += (targetHeights[col] - currentHeights[col]) * 0.15;
            for (let row = 0; row < 10; row++) {
                const index = (row * 20) + col;
                const isActive = (9 - row) < currentHeights[col];
                segs[index].classList.toggle('active', isActive);
            }
            if (Math.random() > 0.5) {
                const randomDb = (Math.random() * -5 - 20).toFixed(1);
                document.getElementById('db-display').innerText = `${randomDb} dB`;
            }
        }
    }, 50);
}

function stopV() {
    clearInterval(vInterval);
    document.querySelectorAll('.bar-segment').forEach(s => s.classList.remove('active'));
}

// Inicialización
initV();
updateUI();