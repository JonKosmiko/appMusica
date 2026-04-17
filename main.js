let vol = 50;
let isPlaying = false;
let vInterval;
let targetHeights = Array(20).fill(0);
let currentHeights = Array(20).fill(0);

const volProgress = document.getElementById('volProgress');
const volDisplay = document.getElementById('volDisplay');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const volArea = document.getElementById('volArea');
const visualizer = document.getElementById('visualizer');

// LÓGICA DE CONTROL DE VOLUMEN (DIAL CIRCULAR FUNCIONAL)
function handleVolume(e) {
    const rect = volArea.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    let degree = angle * (180 / Math.PI) + 90;

    if (degree < 0) degree += 360;

    let newVol = Math.round((degree / 360) * 100);

    if (Math.abs(newVol - vol) < 20) {
        vol = newVol;
        updateUI();
    } else if (vol > 80 && newVol < 20) {
        vol = 100; updateUI();
    } else if (vol < 20 && newVol > 80) {
        vol = 0; updateUI();
    }
}

let isDragging = false;
const startAction = (e) => { isDragging = true; handleVolume(e); };
const endAction = () => { isDragging = false; };
const moveAction = (e) => { if (isDragging) { e.preventDefault(); handleVolume(e); } };

volArea.addEventListener('mousedown', startAction);
window.addEventListener('mousemove', moveAction);
window.addEventListener('mouseup', endAction);

volArea.addEventListener('touchstart', startAction, { passive: false });
window.addEventListener('touchmove', moveAction, { passive: false });
window.addEventListener('touchend', endAction);

function updateUI() {
    volDisplay.innerText = `${vol}%`;
    const offset = 565 - (565 * vol / 100);
    volProgress.style.strokeDashoffset = offset;
}

// Play / Pause
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

            if (Math.random() > 0.5) {
                const randomDb = (Math.random() * -5 - 20).toFixed(1); // Oscila entre -20 y -25 dB
                document.getElementById('db-display').innerText = `${randomDb} dB`;
            }
        }
    }, 50);
}

function stopV() {
    clearInterval(vInterval);
    document.querySelectorAll('.bar-segment').forEach(s => s.classList.remove('active'));
}

initV();
updateUI();