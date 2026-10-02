// Gerenciamento de Estado do Portfólio
let agendaData = JSON.parse(localStorage.getItem('ure_agenda')) || [];
let relatoriosData = JSON.parse(localStorage.getItem('ure_relatorios')) || [];
let fotosData = JSON.parse(localStorage.getItem('ure_fotos')) || [];
let combinadosData = JSON.parse(localStorage.getItem('ure_combinados')) || [];

// Alternar entre as abas coloridas
function switchTab(tab) {
  const tabs = ['agenda', 'relatorios', 'fotos', 'combinados'];
  const colors = {
    agenda: ['bg-teal-700', 'text-white'],
    relatorios: ['bg-orange-700', 'text-white'],
    fotos: ['bg-emerald-700', 'text-white'],
    combinados: ['bg-amber-700', 'text-white']
  };

  tabs.forEach(t => {
    const sec = document.getElementById(`sec-${t}`);
    const btn = document.getElementById(`btn-${t}`);
    
    if (t === tab) {
      sec.classList.remove('hidden');
      btn.className = `tab-btn ${colors[t].join(' ')} font-medium text-sm px-5 py-2.5 rounded-t-xl flex items-center gap-2 transition-all shadow-sm`;
    } else {
      sec.classList.add('hidden');
      btn.className = 'tab-btn bg-stone-200 text-stone-700 hover:bg-stone-300 font-medium text-sm px-5 py-2.5 rounded-t-xl flex items-center gap-2 transition-all';
    }
  });
}

// Renderização Inicial das Seções
function renderAll() {
  renderAgenda();
  renderRelatorios();
  renderFotos();
  renderCombinados();
}

function renderAgenda() {
  const container = document.getElementById('lista-agenda');
  if (!agendaData.length) {
    container.innerHTML = `<p class="text-stone-400 text-sm col-span-2 text-center py-8 border-2 border-dashed border-stone-200 rounded-xl">Nenhuma sessão agendada.</p>`;
    return;
  }
  container.innerHTML = agendaData.map((item, idx) => `
    <div class="border border-teal-200 bg-teal-50/50 p-4 rounded-xl relative group">
      <div class="flex justify-between items-start">
        <span class="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-1 rounded-md">${item.data} - ${item.hora}</span>
        <button onclick="deleteItem('agenda', ${idx})" class="text-stone-400 hover:text-red-600 text-xs"><i class="fas fa-trash"></i></button>
      </div>
      <h4 class="font-bold text-stone-800 mt-2">${item.pauta}</h4>
      <p class="text-xs text-stone-600 mt-1"><i class="fas fa-user-friends mr-1"></i> Publico: ${item.publico}</p>
    </div>
  `).join('');
}

function renderRelatorios() {
  const container = document.getElementById('lista-relatorios');
  if (!relatoriosData.length) {
    container.innerHTML = `<p class="text-stone-400 text-sm text-center py-8 border-2 border-dashed border-stone-200 rounded-xl">Nenhum relatório registrado.</p>`;
    return;
  }
  container.innerHTML = relatoriosData.map((item, idx) => `
    <div class="border border-orange-200 bg-orange-50/30 p-4 rounded-xl">
      <div class="flex justify-between items-center mb-2">
        <h4 class="font-bold text-orange-950">${item.titulo}</h4>
        <button onclick="deleteItem('relatorios', ${idx})" class="text-stone-400 hover:text-red-600 text-xs"><i class="fas fa-trash"></i></button>
      </div>
      <p class="text-sm text-stone-700 whitespace-pre-line">${item.texto}</p>
    </div>
  `).join('');
}

function renderFotos() {
  const container = document.getElementById('galeria-fotos');
  if (!fotosData.length) {
    container.innerHTML = `<p class="text-stone-400 text-sm col-span-3 text-center py-8 border-2 border-dashed border-stone-200 rounded-xl">Nenhuma foto adicionada.</p>`;
    return;
  }
  container.innerHTML = fotosData.map((foto, idx) => `
    <div class="relative group rounded-xl overflow-hidden border border-emerald-200 shadow-sm bg-stone-100">
      <img src="${foto.src}" class="w-full h-40 object-cover">
      <button onclick="deleteItem('fotos', ${idx})" class="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');
}

function uploadFotos(e) {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      fotosData.push({ src: evt.target.result });
      localStorage.setItem('ure_fotos', JSON.stringify(fotosData));
      renderFotos();
    };
    reader.readAsDataURL(file);
  });
}

function renderCombinados() {
  const container = document.getElementById('lista-combinados');
  if (!combinadosData.length) {
    container.innerHTML = `<p class="text-stone-400 text-sm text-center py-8 border-2 border-dashed border-stone-200 rounded-xl">Nenhum combinado registrado.</p>`;
    return;
  }
  container.innerHTML = combinadosData.map((item, idx) => `
    <div class="flex items-center justify-between border border-amber-200 bg-amber-50/40 p-3 rounded-xl">
      <div class="flex items-center gap-3">
        <i class="fas fa-check-circle text-amber-600"></i>
        <span class="text-sm text-stone-800 font-medium">${item.texto}</span>
      </div>
      <button onclick="deleteItem('combinados', ${idx})" class="text-stone-400 hover:text-red-600 text-xs"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');
}

function addAgendaModal() {
  const pauta = prompt("Pauta do Acompanhamento:");
  const data = prompt("Data (ex: 15/04):");
  const publico = prompt("Público Alvo (ex: Professores, Coordenação):");
  if (pauta && data) {
    agendaData.push({ pauta, data, hora: "09:00", publico: publico || "Geral" });
    localStorage.setItem('ure_agenda', JSON.stringify(agendaData));
    renderAgenda();
  }
}

function addRelatorioModal() {
  const titulo = prompt("Título do Relatório:");
  const texto = prompt("Observações / Síntese:");
  if (titulo && texto) {
    relatoriosData.push({ titulo, texto });
    localStorage.setItem('ure_relatorios', JSON.stringify(relatoriosData));
    renderRelatorios();
  }
}

function addCombinadoModal() {
  const texto = prompt("Descrição do Combinado / Encaminhamento:");
  if (texto) {
    combinadosData.push({ texto });
    localStorage.setItem('ure_combinados', JSON.stringify(combinadosData));
    renderCombinados();
  }
}

function deleteItem(type, index) {
  if (confirm("Deseja remover este item?")) {
    if (type === 'agenda') agendaData.splice(index, 1);
    if (type === 'relatorios') relatoriosData.splice(index, 1);
    if (type === 'fotos') fotosData.splice(index, 1);
    if (type === 'combinados') combinadosData.splice(index, 1);
    localStorage.setItem(`ure_${type}`, JSON.stringify(eval(`${type}Data`)));
    renderAll();
  }
}

document.addEventListener('DOMContentLoaded', renderAll);