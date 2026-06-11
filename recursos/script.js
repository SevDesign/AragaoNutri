/* FUNÇÃO DE SLEEP */
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));



/* LÓGICA DO SLIDESHOW */
let indiceAtual = 0;
let tempoIndice = [10000, 18000, 18000, 18000, 18000];
let timer;

const slides = document.querySelectorAll('.slide');
const texto_primario = document.querySelectorAll('.texto-primario');
const texto_secundario = document.querySelectorAll('.texto-secundario');
const btnProximo = document.getElementById('btn-proximo-slide');
const btnVoltar = document.getElementById('btn-voltar-slide');

function irParaSlide(novoIndice) {
    slides[indiceAtual].classList.remove('ativo');
    if(texto_primario[indiceAtual]) texto_primario[indiceAtual].classList.remove('t-ativo');
    if(texto_secundario[indiceAtual]) texto_secundario[indiceAtual].classList.remove('t-ativo');

    indiceAtual = novoIndice;

    slides[indiceAtual].classList.add('ativo');
    if(texto_primario[indiceAtual]) texto_primario[indiceAtual].classList.add('t-ativo');
    if(texto_secundario[indiceAtual]) texto_secundario[indiceAtual].classList.add('t-ativo');

    resetarTimer();
}

function proximoSlide() {
    let proximo = (indiceAtual + 1) % slides.length;
    irParaSlide(proximo);
}

function slideAnterior() {
    let anterior = (indiceAtual - 1 + slides.length) % slides.length;
    irParaSlide(anterior);
}

function resetarTimer() {
    clearTimeout(timer);
    let tempoDestaVez = tempoIndice[indiceAtual] || 5000;
    timer = setTimeout(proximoSlide, tempoDestaVez);
}

slides[indiceAtual].classList.add('ativo');
if(texto_primario[indiceAtual]) texto_primario[indiceAtual].classList.add('t-ativo');
if(texto_secundario[indiceAtual]) texto_secundario[indiceAtual].classList.add('t-ativo');

if(btnProximo) {
    btnProximo.addEventListener('click', proximoSlide);
}

if(btnVoltar) {
    btnVoltar.addEventListener('click', slideAnterior);
}

resetarTimer();



/* EXIBIR INFORMAÇÕES OCULTAS */
const btnAgendamento = document.getElementById('btn-agendamento');
const btnLocalizacao = document.getElementById('btn-localizacao');

const agendamentoContainer = document.getElementById('contato');
const localizacaoContainer = document.getElementById('localizacao');

let agendamento = false;
let localizacao = false;

function mostrarAgendamento() {
    agendamento = true;
    agendamentoContainer.classList.add('ativo-agendamento');
}

function mostrarMapa() {
    localizacao = true;
    localizacaoContainer.classList.add('ativo');
}

function ocultarAgendamento() {
    if (!agendamento) return;

    agendamento = false;
    agendamentoContainer.classList.remove('ativo-agendamento');
}

function ocultarMapa() {
    if (!localizacao) return;

    localizacao = false;
    localizacaoContainer.classList.remove('ativo');
}

btnAgendamento.addEventListener('click', () => {
    if (!agendamento)
        mostrarAgendamento();
    else
        ocultarAgendamento();
});

btnLocalizacao.addEventListener('click', () => {
    if (!localizacao)
        mostrarMapa();
    else 
        ocultarMapa();
});




/* LÓGICA DE SELEÇÃO DOS BOTÕES (CHIPS) */
// --- 1. SELEÇÃO ÚNICA (Rádio Button Visual) ---
// Para Objetivo e Turno
const setupSingleSelect = (containerId, inputId) => {
    const container = document.getElementById(containerId);
    const inputHidden = document.getElementById(inputId);
    const chips = container.querySelectorAll('.chip');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('selecionado'));
            chip.classList.add('selecionado');
            inputHidden.value = chip.getAttribute('data-value');
        });
    });
};

// --- 2. SELEÇÃO MÚLTIPLA (Checkbox Visual) ---
// Para Dias da Semana
const setupMultiSelect = (containerId) => {
    const container = document.getElementById(containerId);
    const chips = container.querySelectorAll('.chip');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Toggle: Se tem, tira. Se não tem, coloca.
            chip.classList.toggle('selecionado');
        });
    });
};

// Inicializa as lógicas
setupSingleSelect('objetivo-options', 'objetivo-selecionado');
setupSingleSelect('turno-options', 'turno-selecionado');
setupMultiSelect('dias-options'); // Dias usa a nova lógica


// --- 3. ENVIO INTELIGENTE ---
document.getElementById('form-agendamento').addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const objetivo = document.getElementById('objetivo-selecionado').value || "Não informado";
    const turno = document.getElementById('turno-selecionado').value || "Indiferente";

    // Captura os dias selecionados
    // Pega todos os chips dentro de #dias-options que tenham a classe .selecionado
    const diasElements = document.querySelectorAll('#dias-options .selecionado');
    // Transforma os elementos em um texto separado por vírgula (ex: "Seg, Qua, Sex")
    let diasSelecionados = Array.from(diasElements).map(el => el.getAttribute('data-value')).join(', ');
    
    if(diasSelecionados === "") diasSelecionados = "A combinar";

    // Número do Nutricionista
    const telefoneNutri = "558597029871"; 

    // Monta a mensagem
    const mensagem = `Olá Arthur! Me chamo ${nome} (${idade} anos).%0A%0A` +
                     `Gostaria de agendar uma consultoria.%0A` +
                     `*Objetivo:* ${objetivo}%0A` +
                     `*Dias:* ${diasSelecionados}%0A` +
                     `*Turno:* ${turno}%0A`;

    const link = `https://wa.me/${telefoneNutri}?text=${mensagem}`;
    window.open(link, '_blank');
});