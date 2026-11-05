// --- NAVEGACIÓN MÓVIL ---
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
}

// --- SISTEMA DE MODAL DE CHECKOUT Y SUSCRIPCIÓN ---
let selectedPlanName = "";
let selectedPlanPrice = 0;

function openCheckoutModal(planName, price) {
    selectedPlanName = planName;
    selectedPlanPrice = price;

    document.getElementById('modal-plan-title').innerText = `Suscribirse a ${planName}`;
    document.getElementById('modal-plan-price').innerText = `$${price}.00 / mes`;
    document.getElementById('modal-plan-tag').innerText = planName.includes('Horno') ? 'Plan Destacado Pro' : 'Suscripción Activa';

    document.getElementById('checkout-form-container').classList.remove('hidden');
    document.getElementById('checkout-success').classList.add('hidden');
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    document.getElementById('checkout-form-container').classList.add('hidden');
    document.getElementById('success-plan-name').innerText = selectedPlanName;
    document.getElementById('checkout-success').classList.remove('hidden');

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 }
        });
    }
}

// --- MINIJUEGO INTERACTIVO ---
let gameMaterial = null;   
let valveClosed = false;   
let timingPos = 0;         
let timingDirection = 1;   
let timingInterval = null;
let isGameStopped = false;

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function handleDragOver(e) {
    e.preventDefault();
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) dropZone.classList.remove('drag-over');

    const id = e.dataTransfer.getData('text/plain');
    if (id === 'item-wood' || id === 'item-leaves') {
        selectMaterialClick(id === 'item-wood' ? 'wood' : 'leaves');
    }
}

function selectMaterialClick(type) {
    gameMaterial = type;
    const dropZone = document.getElementById('drop-zone');
    const dropText = document.getElementById('drop-text');
    const dropSubtext = document.getElementById('drop-subtext');
    const dropIcon = document.getElementById('drop-icon');
    const btn = document.getElementById('btn-to-phase2');

    if (type === 'wood') {
        dropIcon.innerHTML = '<i class="fa-solid fa-tree text-amber-400"></i>';
        dropText.innerText = "¡Madera y Podas cargadas!";
        dropSubtext.innerText = "Materia prima leñosa rica en estructura.";
    } else {
        dropIcon.innerHTML = '<i class="fa-solid fa-leaf text-emerald-400"></i>';
        dropText.innerText = "¡Hojas y Residuos cargados!";
        dropSubtext.innerText = "Biomasa blanda de rápida carbonización.";
    }

    dropZone.classList.remove('border-dashed', 'border-white/20');
    dropZone.classList.add('border-solid', 'border-bioAccent', 'bg-bioAccent/10');

    btn.disabled = false;
    btn.className = "w-full bg-bioAccent text-bioDark font-extrabold py-3.5 rounded-xl hover:bg-white transition-all cursor-pointer shadow-md";
}

function startPhase2() {
    document.getElementById('game-phase-1').classList.add('hidden');
    document.getElementById('game-phase-2').classList.remove('hidden');

    document.getElementById('step-badge-2').className = "w-8 h-8 rounded-full bg-bioAccent text-bioDark font-bold flex items-center justify-center";
    document.getElementById('step-title-2').className = "font-bold text-white";
}

function toggleValve() {
    valveClosed = !valveClosed;
    const txt = document.getElementById('valve-oxygen-text');
    const icon = document.getElementById('valve-icon');
    const btnLabel = document.getElementById('btn-valve-label');
    const btnNext = document.getElementById('btn-to-phase3');

    if (valveClosed) {
        txt.innerText = "0% (Válvula Cerrada - Anaeróbico)";
        txt.className = "text-2xl font-bold text-bioAccent";
        icon.className = "w-16 h-16 bg-bioAccent/20 text-bioAccent rounded-full flex items-center justify-center text-3xl border border-bioAccent";
        icon.innerHTML = '<i class="fa-solid fa-lock"></i>';
        btnLabel.innerText = "Abrir Válvula de Oxígeno";

        btnNext.disabled = false;
        btnNext.className = "w-full bg-bioAccent text-bioDark font-extrabold py-3.5 rounded-xl hover:bg-white transition-all cursor-pointer shadow-md";
    } else {
        txt.innerText = "100% (Abierto - Peligro de Ceniza)";
        txt.className = "text-2xl font-bold text-blue-400";
        icon.className = "w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-3xl border border-blue-400";
        icon.innerHTML = '<i class="fa-solid fa-wind"></i>';
        btnLabel.innerText = "Hacer clic para CERRAR Válvula";

        btnNext.disabled = true;
        btnNext.className = "w-full bg-stone-800 text-stone-500 font-bold py-3.5 rounded-xl cursor-not-allowed transition-all";
    }
}

function startPhase3() {
    document.getElementById('game-phase-2').classList.add('hidden');
    document.getElementById('game-phase-3').classList.remove('hidden');

    document.getElementById('step-badge-3').className = "w-8 h-8 rounded-full bg-bioFire text-white font-bold flex items-center justify-center";
    document.getElementById('step-title-3').className = "font-bold text-white";

    timingPos = 0;
    timingDirection = 1;
    isGameStopped = false;
    clearInterval(timingInterval);

    timingInterval = setInterval(() => {
        if (isGameStopped) return;

        timingPos += 2.2 * timingDirection;
        if (timingPos >= 95) timingDirection = -1;
        if (timingPos <= 1) timingDirection = 1;

        const indicator = document.getElementById('timing-indicator');
        if (indicator) indicator.style.left = `${timingPos}%`;

        const currentTemp = Math.round(100 + (timingPos / 95) * 700);
        const tempDisp = document.getElementById('live-temp-display');
        const tempStatus = document.getElementById('live-temp-status');

        if (tempDisp) tempDisp.innerText = `${currentTemp} °C`;

        if (tempStatus) {
            if (timingPos >= 35 && timingPos <= 65) {
                tempStatus.innerText = "¡ZONA VERDE OPTIMA!";
                tempStatus.className = "block text-xs font-bold text-bioAccent animate-pulse";
            } else if (timingPos < 35) {
                tempStatus.innerText = "Temperatura demasiado baja";
                tempStatus.className = "block text-xs text-blue-400";
            } else {
                tempStatus.innerText = "¡Peligro de Sobrecalentamiento!";
                tempStatus.className = "block text-xs text-red-400";
            }
        }
    }, 25);
}

function stopTimingGame() {
    if (isGameStopped) return;
    isGameStopped = true;
    clearInterval(timingInterval);

    document.getElementById('game-phase-3').classList.add('hidden');
    document.getElementById('game-phase-4').classList.remove('hidden');

    const resTitle = document.getElementById('res-title');
    const resDesc = document.getElementById('res-desc');
    const resStars = document.getElementById('res-stars');
    const resPorosity = document.getElementById('res-porosity');
    const resCarbon = document.getElementById('res-carbon');
    const resYield = document.getElementById('res-yield');
    const resIcon = document.getElementById('res-icon');
    const resIconWrapper = document.getElementById('res-icon-wrapper');

    if (timingPos >= 35 && timingPos <= 65) {
        resIconWrapper.className = "w-20 h-20 bg-bioAccent/20 border-2 border-bioAccent rounded-full flex items-center justify-center text-4xl mx-auto text-bioAccent shadow-lg";
        resIcon.className = "fa-solid fa-gem";
        resTitle.innerText = gameMaterial === 'wood' ? "¡Biochar Premium Estructural!" : "¡Biochar Poroso Excepcional!";
        resDesc.innerText = "¡Precisión impecable! Conseguiste el rango perfecto de pirólisis en ausencia total de oxígeno.";
        resStars.innerHTML = '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>';
        resPorosity.innerText = gameMaterial === 'wood' ? "98%" : "91%";
        resCarbon.innerText = "1.2 t / m³";
        resYield.innerText = "100% Óptimo";

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 }
            });
        }
    } else if (timingPos < 35) {
        resIconWrapper.className = "w-20 h-20 bg-blue-500/20 border-2 border-blue-400 rounded-full flex items-center justify-center text-4xl mx-auto text-blue-400";
        resIcon.className = "fa-solid fa-temperature-arrow-down";
        resTitle.innerText = "Biomasa Poco Procesada";
        resDesc.innerText = "Detuviste el ciclo demasiado pronto. La temperatura no alcanzó para abrir todos los poros del carbón.";
        resStars.innerHTML = '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i><i class="fa-regular fa-star"></i>';
        resPorosity.innerText = "35%";
        resCarbon.innerText = "0.4 t / m³";
        resYield.innerText = "Incompleto";
    } else {
        resIconWrapper.className = "w-20 h-20 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center text-4xl mx-auto text-red-500";
        resIcon.className = "fa-solid fa-volcano";
        resTitle.innerText = "¡Sobrecalentado!";
        resDesc.innerText = "Te pasaste de la zona verde. El calor excesivo desintegró la estructura esponjosa del material.";
        resStars.innerHTML = '<i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>';
        resPorosity.innerText = "12%";
        resCarbon.innerText = "0.1 t / m³";
        resYield.innerText = "Bajo";
    }
}

function resetGame() {
    clearInterval(timingInterval);
    gameMaterial = null;
    valveClosed = false;
    timingPos = 0;
    isGameStopped = false;

    document.getElementById('game-phase-4').classList.add('hidden');
    document.getElementById('game-phase-1').classList.remove('hidden');

    const dropZone = document.getElementById('drop-zone');
    dropZone.className = "border-2 border-dashed border-white/20 bg-black/40 rounded-3xl p-8 text-center transition-all flex flex-col items-center justify-center min-h-[200px]";
    document.getElementById('drop-icon').innerHTML = '<i class="fa-solid fa-inbox"></i>';
    document.getElementById('drop-text').innerText = "Suelta la biomasa aquí";
    document.getElementById('drop-subtext').innerText = "Zona de carga del Reactor de Pirólisis";

    const btn1 = document.getElementById('btn-to-phase2');
    btn1.disabled = true;
    btn1.className = "w-full bg-stone-800 text-stone-500 font-bold py-3.5 rounded-xl cursor-not-allowed transition-all";

    document.getElementById('valve-oxygen-text').innerText = "100% (Abierto)";
    document.getElementById('valve-oxygen-text').className = "text-2xl font-bold text-blue-400";
    document.getElementById('valve-icon').className = "w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-3xl border border-blue-400";
    document.getElementById('valve-icon').innerHTML = '<i class="fa-solid fa-wind"></i>';
    document.getElementById('btn-valve-label').innerText = "Hacer clic para CERRAR Válvula";
    const btn2 = document.getElementById('btn-to-phase3');
    btn2.disabled = true;
    btn2.className = "w-full bg-stone-800 text-stone-500 font-bold py-3.5 rounded-xl cursor-not-allowed transition-all";

    document.getElementById('step-badge-2').className = "w-8 h-8 rounded-full bg-white/10 text-stone-400 font-bold flex items-center justify-center";
    document.getElementById('step-title-2').className = "font-bold text-stone-400";
    document.getElementById('step-badge-3').className = "w-8 h-8 rounded-full bg-white/10 text-stone-400 font-bold flex items-center justify-center";
    document.getElementById('step-title-3').className = "font-bold text-stone-400";
}

// --- PESTAÑAS DE USOS ---
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

    const activeBtn = document.getElementById(`tab-${tabName}`);
    const activeContent = document.getElementById(`content-${tabName}`);
    if (activeBtn) activeBtn.classList.add('active');
    if (activeContent) activeContent.classList.remove('hidden');
}

// --- CALCULADORA DE IMPACTO ---
function calculateImpact() {
    const areaInput = document.getElementById('calc-area');
    if (!areaInput) return;
    const area = parseFloat(areaInput.value) || 0;
    const biocharNeeded = (area * 0.3).toFixed(1);
    const co2Captured = (biocharNeeded * 3).toFixed(1);

    const biocharEl = document.getElementById('calc-biochar');
    const co2El = document.getElementById('calc-co2');
    if (biocharEl) biocharEl.innerText = `${biocharNeeded} kg`;
    if (co2El) co2El.innerText = `${co2Captured} kg`;
}

// --- FORMULARIO DE CONTACTO ---
function handleContactSubmit(e) {
    e.preventDefault();
    const msg = document.getElementById('form-message');
    if (msg) {
        msg.classList.remove('hidden');
        e.target.reset();
        setTimeout(() => msg.classList.add('hidden'), 5000);
    }
}