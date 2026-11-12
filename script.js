// Data Definitions
const wajibList = [
    { id: 'subuh', name: 'Subuh', icon: 'fa-cloud-sun' },
    { id: 'zuhur', name: 'Zuhur', icon: 'fa-sun' },
    { id: 'asar', name: 'Asar', icon: 'fa-cloud-sun' },
    { id: 'magrib', name: 'Magrib', icon: 'fa-moon' },
    { id: 'isya', name: 'Isya', icon: 'fa-star' }
];

const sunnahList = [
    { id: 'tahajud', name: 'Tahajud', icon: 'fa-moon', desc: 'Sepertiga malam' },
    { id: 'taubat', name: 'Salat Taubat', icon: 'fa-hands-praying', desc: 'Mohon ampun' },
    { id: 'hajat', name: 'Salat Hajat', icon: 'fa-bullseye', desc: 'Hajat & doa' },
    { id: 'duha', name: 'Salat Duha', icon: 'fa-sun', desc: 'Pagi hari' },
    { id: 'witir', name: 'Salat Witir', icon: 'fa-star-of-david', desc: 'Penutup malam' },
    { id: 'dzikir', name: 'Dzikir Harian', icon: 'fa-spa', desc: 'Pagi & petang' },
    { id: 'shalawat', name: 'Shalawat', icon: 'fa-heart', desc: 'Kepada Nabi SAW' },
    { id: 'quran', name: 'Tilawah Qur\'an', icon: 'fa-book-quran', desc: 'Membaca Al-Qur\'an' },
    { id: 'sedekah', name: 'Sedekah Harian', icon: 'fa-hand-holding-heart', desc: 'Infaq terbaik' }
];

const listDoa = [
    { title: 'Doa Sehari-hari (Sebelum & Bangun Tidur)', arabic: 'بِاسْمِكَ اللَّهُمَّ أَحْيَا وَأَمُوتُ', latin: 'Bismika allahumma ahya wa amuut', meaning: 'Dengan nama-Mu ya Allah, aku hidup dan aku mati.' },
    { title: 'Doa Setelah Salat Fardhu', arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ', latin: 'Allahumma a\'inni \'ala dzikrika, wa syukrika, wa husni \'ibadatik', meaning: 'Ya Allah, bantulah aku untuk senantiasa berdzikir, bersyukur, dan beribadah dengan baik kepada-Mu.' },
    { title: 'Doa Memohon Rezeki yang Halal', arabic: 'اللَّهُمَّ إِنِّى أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا', latin: 'Allahumma inni as\'aluka \'ilman nafi\'an, wa rizqan thayyiban, wa ' + 'amalan mutaqabbalan', meaning: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima.' },
    { title: 'Doa Memohon Ampunan (Sayyidul Istighfar)', arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ', latin: 'Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana \'abduka', meaning: 'Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan selain Engkau yang menciptakan aku dan aku adalah hamba-Mu.' },
    { title: 'Doa Kebaikan Dunia & Akhirat', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', latin: 'Rabbana atina fid dunya hasanah wa fil akhirati hasanah wa qina \'adzaban naar', meaning: 'Ya Allah, berikanlah kebaikan di dunia dan akhirat, serta peliharalah dari siksa neraka.' }
];

const motivasiList = [
    "“Amalan yang paling dicintai oleh Allah adalah amalan yang rutin meskipun sedikit.” (HR. Bukhari)",
    "“Sesungguhnya beserta kesulitan itu ada kemudahan.” (QS. Al-Insyirah: 6)",
    "“Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah mudahkan baginya jalan ke surga.” (HR. Muslim)"
];

// Global State
let selectedDate = new Date().toISOString().split('T')[0];
let weeklyChartInstance = null;

function getStorageKey(date) {
    return `muslim_habit_2027_${date}`;
}

function getQuranStorageKey() {
    return `muslim_habit_2027_quran`;
}

function loadDayData(date) {
    const raw = localStorage.getItem(getStorageKey(date));
    if (raw) {
        try { return JSON.parse(raw); } catch(e){}
    }
    return {
        wajib: { subuh: false, zuhur: false, asar: false, magrib: false, isya: false },
        sunnah: { tahajud: false, taubat: false, hajat: false, duha: false, witir: false, dzikir: false, shalawat: false, quran: false, sedekah: false },
        jurnal: { syukur: '', target: '', evaluasi: '', doa: '' }
    };
}

function saveDayData(date, data) {
    localStorage.setItem(getStorageKey(date), JSON.stringify(data));
}

function loadQuranDataStorage() {
    const raw = localStorage.getItem(getQuranStorageKey());
    if (raw) {
        try { return JSON.parse(raw); } catch(e){}
    }
    return { totalPages: 0, lastSurah: '-', lastAyat: 0 };
}

function saveQuranDataStorage(data) {
    localStorage.setItem(getQuranStorageKey(), JSON.stringify(data));
}

// Initialization
window.onload = function() {
    document.getElementById('global-date-picker').value = selectedDate;
    updateDateDisplay();
    setRandomMotivation();
    renderAll();
    initChart();
};

function setRandomMotivation() {
    const idx = Math.floor(Math.random() * motivasiList.length);
    document.getElementById('daily-motivation').innerText = motivasiList[idx];
    
    const hour = new Date().getHours();
    let greet = "Assalamu'alaikum, Sahabat";
    if (hour >= 3 && hour < 11) greet = "Selamat Pagi, Sahabat";
    else if (hour >= 11 && hour < 15) greet = "Selamat Siang, Sahabat";
    else if (hour >= 15 && hour < 18) greet = "Selamat Sore, Sahabat";
    else greet = "Selamat Malam, Sahabat";
    document.getElementById('greeting-text').innerText = greet;
}

function changeDate(dateStr) {
    if (!dateStr) return;
    selectedDate = dateStr;
    updateDateDisplay();
    renderAll();
}

function resetToToday() {
    selectedDate = new Date().toISOString().split('T')[0];
    document.getElementById('global-date-picker').value = selectedDate;
    updateDateDisplay();
    renderAll();
}

function updateDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const d = new Date(selectedDate + 'T00:00:00');
    document.getElementById('header-date-string').innerText = d.toLocaleDateString('id-ID', options);
}

// Navigation Tabs
function switchTab(tabId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('text-brandLavender'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.add('text-slate-400'));

    document.getElementById(`view-${tabId}`).classList.remove('hidden');
    document.getElementById(`nav-${tabId}`).classList.remove('text-slate-400');
    document.getElementById(`nav-${tabId}`).classList.add('text-brandLavender');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabId === 'rekap') {
        updateChartData();
    }
}

// Toast helper
function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toast-message').innerText = msg;
    t.classList.remove('translate-y-[-200%]');
    setTimeout(() => t.classList.add('translate-y-[-200%]', 2500));
}

// Render All Components
function renderAll() {
    const data = loadDayData(selectedDate);
    renderDashboard(data);
    renderIbadahView(data);
    renderJournalView(data);
    renderDoaView('');
    renderQuranView();
    updateStatsSummary(data);
}

// 1. Dashboard Render
function renderDashboard(data) {
    let wGrid = document.getElementById('dash-wajib-grid');
    wGrid.innerHTML = '';
    let wCount = 0;
    wajibList.forEach(item => {
        const checked = data.wajib[item.id] || false;
        if (checked) wCount++;
        wGrid.innerHTML += `
            <div onclick="toggleWajib('${item.id}')" class="cursor-pointer p-2.5 rounded-2xl border text-center transition ${checked ? 'bg-brandLavender/20 border-brandLavender text-white shadow' : 'bg-brandBg border-brandBorder text-slate-300'}">
                <i class="fa-solid ${item.icon} text-sm mb-1 ${checked ? 'text-brandLavender' : 'text-slate-400'}"></i>
                <div class="text-[10px] font-semibold truncate">${item.name}</div>
            </div>
        `;
    });
    document.getElementById('dash-wajib-count').innerText = `${wCount} / 5`;

    let sGrid = document.getElementById('dash-sunnah-grid');
    sGrid.innerHTML = '';
    let sCount = 0;
    sunnahList.forEach(item => {
        const checked = data.sunnah[item.id] || false;
        if (checked) sCount++;
        sGrid.innerHTML += `
            <div onclick="toggleSunnah('${item.id}')" class="cursor-pointer p-3 rounded-2xl border flex items-center justify-between transition ${checked ? 'bg-brandLavender/20 border-brandLavender text-white' : 'bg-brandBg border-brandBorder text-slate-300'}">
                <div class="flex items-center gap-2">
                    <i class="fa-solid ${item.icon} text-xs ${checked ? 'text-brandLavender' : 'text-slate-400'}"></i>
                    <span class="text-xs font-medium">${item.name}</span>
                </div>
                <div class="w-4 h-4 rounded border flex items-center justify-center ${checked ? 'bg-brandLavender border-brandLavender text-white text-[9px]' : 'border-brandBorder'}">
                    ${checked ? '<i class="fa-solid fa-check"></i>' : ''}
                </div>
            </div>
        `;
    });
    document.getElementById('dash-sunnah-count').innerText = `${sCount} / 9`;

    document.getElementById('dash-syukur-input').value = data.jurnal.syukur || '';

    const totalComp = wCount + sCount;
    const pct = Math.round((totalComp / 14) * 100);
    document.getElementById('dash-progress-pct').innerText = `${pct}%`;

    calculateStreak();
}

function toggleWajib(id) {
    let data = loadDayData(selectedDate);
    data.wajib[id] = !data.wajib[id];
    saveDayData(selectedDate, data);
    renderAll();
    showToast('Progres salat wajib diperbarui');
}

function toggleSunnah(id) {
    let data = loadDayData(selectedDate);
    data.sunnah[id] = !data.sunnah[id];
    saveDayData(selectedDate, data);
    renderAll();
    showToast('Progres amalan diperbarui');
}

function saveDashSyukur() {
    let val = document.getElementById('dash-syukur-input').value;
    let data = loadDayData(selectedDate);
    data.jurnal.syukur = val;
    saveDayData(selectedDate, data);
    showToast('Catatan syukur disimpan');
}

// 2. Ibadah View Render
function renderIbadahView(data) {
    let wList = document.getElementById('full-wajib-list');
    wList.innerHTML = '';
    wajibList.forEach(item => {
        const checked = data.wajib[item.id] || false;
        wList.innerHTML += `
            <div onclick="toggleWajib('${item.id}')" class="cursor-pointer p-3.5 rounded-2xl border flex items-center justify-between transition ${checked ? 'bg-brandLavender/20 border-brandLavender text-white' : 'bg-brandBg border-brandBorder text-slate-300'}">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-brandBg flex items-center justify-center text-brandLavender">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div>
                        <div class="font-bold text-xs">Salat ${item.name}</div>
                        <div class="text-[10px] text-slate-400">Salat wajib 5 waktu</div>
                    </div>
                </div>
                <div class="w-5 h-5 rounded-md border flex items-center justify-center ${checked ? 'bg-brandLavender border-brandLavender text-white text-xs' : 'border-brandBorder'}">
                    ${checked ? '<i class="fa-solid fa-check"></i>' : ''}
                </div>
            </div>
        `;
    });

    let sList = document.getElementById('full-sunnah-list');
    sList.innerHTML = '';
    sunnahList.forEach(item => {
        const checked = data.sunnah[item.id] || false;
        sList.innerHTML += `
            <div onclick="toggleSunnah('${item.id}')" class="cursor-pointer p-3.5 rounded-2xl border flex items-center justify-between transition ${checked ? 'bg-brandLavender/20 border-brandLavender text-white' : 'bg-brandBg border-brandBorder text-slate-300'}">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-brandBg flex items-center justify-center text-brandLavender">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div>
                        <div class="font-bold text-xs">${item.name}</div>
                        <div class="text-[10px] text-slate-400">${item.desc}</div>
                    </div>
                </div>
                <div class="w-5 h-5 rounded-md border flex items-center justify-center ${checked ? 'bg-brandLavender border-brandLavender text-white text-xs' : 'border-brandBorder'}">
                    ${checked ? '<i class="fa-solid fa-check"></i>' : ''}
                </div>
            </div>
        `;
    });
}

function toggleAllIbadah(status) {
    let data = loadDayData(selectedDate);
    wajibList.forEach(i => data.wajib[i.id] = status);
    sunnahList.forEach(i => data.sunnah[i.id] = status);
    saveDayData(selectedDate, data);
    renderAll();
    showToast('Semua amalan dicentang');
}

// 3. Rekap & Statistics
function calculateStreak() {
    let streak = 0;
    let d = new Date();
    for (let i = 0; i < 30; i++) {
        const dateStr = d.toISOString().split('T')[0];
        const dayData = loadDayData(dateStr);
        let comp = 0;
        Object.values(dayData.wajib).forEach(v => { if(v) comp++; });
        Object.values(dayData.sunnah).forEach(v => { if(v) comp++; });
        if (comp >= 5) streak++;
        else if (i > 0) break;
        d.setDate(d.getDate() - 1);
    }
    document.getElementById('stat-streak').innerText = `${streak} Hari`;
}

function updateStatsSummary(data) {
    let comp = 0;
    Object.values(data.wajib).forEach(v => { if(v) comp++; });
    Object.values(data.sunnah).forEach(v => { if(v) comp++; });
    document.getElementById('stat-completed').innerText = `${comp}/14`;
    const pct = Math.round((comp / 14) * 100);
    document.getElementById('stat-consistency').innerText = `${pct}%`;
}

function initChart() {
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    weeklyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Progres (%)',
                data: [],
                borderColor: '#8B6CF6',
                backgroundColor: 'rgba(139, 108, 246, 0.1)',
                fill: true,
                tension: 0.3,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: '#3d3278' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            },
            plugins: { legend: { display: false } }
        }
    });
    updateChartData();
}

function updateChartData() {
    if (!weeklyChartInstance) return;
    let labels = [];
    let dataPts = [];
    for (let i = 6; i >= 0; i--) {
        let d = new Date();
        d.setDate(d.getDate() - i);
        let dateStr = d.toISOString().split('T')[0];
        let dayData = loadDayData(dateStr);
        let comp = 0;
        Object.values(dayData.wajib).forEach(v => { if(v) comp++; });
        Object.values(dayData.sunnah).forEach(v => { if(v) comp++; });
        let pct = Math.round((comp / 14) * 100);
        labels.push(d.toLocaleDateString('id-ID', { weekday: 'short' }));
        dataPts.push(pct);
    }
    weeklyChartInstance.data.labels = labels;
    weeklyChartInstance.data.datasets[0].data = dataPts;
    weeklyChartInstance.update();
}

// 4. Journal View
function renderJournalView(data) {
    document.getElementById('jurnal-syukur').value = data.jurnal.syukur || '';
    document.getElementById('jurnal-target').value = data.jurnal.target || '';
    document.getElementById('jurnal-evaluasi').value = data.jurnal.evaluasi || '';
    document.getElementById('jurnal-doa').value = data.jurnal.doa || '';
}

function saveJournalField(field) {
    let val = document.getElementById(`jurnal-${field}`).value;
    let data = loadDayData(selectedDate);
    data.jurnal[field] = val;
    saveDayData(selectedDate, data);
}

// 5. Doa View
function renderDoaView(query) {
    let container = document.getElementById('doa-container');
    container.innerHTML = '';
    const filtered = listDoa.filter(d => d.title.toLowerCase().includes(query.toLowerCase()) || d.meaning.toLowerCase().includes(query.toLowerCase()));
    
    if (filtered.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-400 text-center py-6">Doa tidak ditemukan.</p>`;
        return;
    }

    filtered.forEach(doa => {
        container.innerHTML += `
            <div class="bg-brandCard p-5 rounded-3xl border border-brandBorder shadow-lg space-y-3">
                <h4 class="font-bold text-xs text-brandLavender">${doa.title}</h4>
                <p class="text-lg font-arabic text-right text-slate-100 font-semibold leading-loose">${doa.arabic}</p>
                <p class="text-xs text-brandLavender italic">${doa.latin}</p>
                <p class="text-xs text-slate-300"><strong>Artinya:</strong> "${doa.meaning}"</p>
            </div>
        `;
    });
}

function filterDoa(val) {
    renderDoaView(val);
}

// 6. Quran View
function renderQuranView() {
    const q = loadQuranDataStorage();
    document.getElementById('quran-surah').value = q.lastSurah !== '-' ? q.lastSurah : '';
    document.getElementById('quran-ayat').value = q.lastAyat !== 0 ? q.lastAyat : '';
    document.getElementById('quran-pages').value = q.totalPages !== 0 ? q.totalPages : '';

    document.getElementById('quran-total-halaman').innerText = q.totalPages;
    const pct = Math.min(Math.round((q.totalPages / 604) * 100), 100);
    document.getElementById('quran-pct-label').innerText = `${pct}%`;
    document.getElementById('quran-posisi').innerText = q.lastSurah !== '-' ? `${q.lastSurah} : ${q.lastAyat}` : '-';
    document.getElementById('quran-progress-bar').style.width = `${pct}%`;
}

function saveQuranData() {
    const surah = document.getElementById('quran-surah').value || '-';
    const ayat = parseInt(document.getElementById('quran-ayat').value) || 0;
    const pages = parseInt(document.getElementById('quran-pages').value) || 0;

    saveQuranDataStorage({ totalPages: pages, lastSurah: surah, lastAyat: ayat });
    renderQuranView();
    showToast('Progres Qur\'an disimpan');
}
