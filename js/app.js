/* =========================
   CONFIG GERAL
========================= */
const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbx7iYRrxsWgPkuZz3j-qw_Demn5-fMRzhxbiuYdMbnMHf5grvxJpEFkXqyprGG5M6PM/exec";

// setor via URL ?setor=Ambulatorio | ?setor=Pronto%20Socorro
const params = new URLSearchParams(window.location.search);
const SETOR = params.get("setor") || "Ambulatório";

console.log("Setor ativo:", SETOR);

/* =========================
   PERGUNTAS
========================= */
const perguntas = [
  { id: "avaliacao_geral", texto: "1 - Qual sua Avaliação Geral do Hospital?" },
  { id: "recepcao", texto: "2 - Como você avalia o atendimento da Recepção?" },
  { id: "enfermagem", texto: "3 - Como você avalia o atendimento da Enfermagem e Triagem?" },
  { id: "medico", texto: "4 - Como você avalia o atendimento Médico?" },
  { id: "limpeza", texto: "5 - Como você avalia a Limpeza do ambiente?" },
  { id: "tempo", texto: "6 - Como você avalia o Tempo de Espera?" },
  { id: "educacao", texto: "7 - Como você avalia a Educação e Respeito dos profissionais?" }
];

/* =========================
   MAPA DE RESPOSTAS
========================= */
const mapaRespostas = {
  1: "Insatisfeito",
  2: "Satisfeito",
  3: "Muito satisfeito"
};

/* =========================
   CONTROLE
========================= */
let indice = 0;
let respostas = {};
let bloqueado = false;

/* =========================
   ELEMENTOS
========================= */
const perguntaEl = document.getElementById("pergunta");
const telaPergunta = document.getElementById("tela-pergunta");
const telaFinal = document.getElementById("tela-final");

/* =========================
   INICIALIZA
========================= */
mostrarPergunta();
reenviarFilaOffline();
console.log("JS carregado com sucesso");

/* =========================
   MOSTRAR PERGUNTA
========================= */
function mostrarPergunta() {
  perguntaEl.innerText = perguntas[indice].texto;
}

/* =========================
   RESPONDER
========================= */
function responder(valor) {
  if (bloqueado) return;
  bloqueado = true;

  const chave = perguntas[indice].id;
  respostas[chave] = mapaRespostas[valor];

  animarTrocaPergunta(() => {
    indice++;

    if (indice < perguntas.length) {
      mostrarPergunta();
      bloqueado = false;
    } else {
      finalizarPesquisa();
    }
  });
}

/* =========================
   ANIMAÇÃO
========================= */
function animarTrocaPergunta(callback) {
  telaPergunta.classList.add("saindo");

  setTimeout(() => {
    telaPergunta.classList.remove("saindo");
    telaPergunta.classList.add("entrando");

    setTimeout(() => {
      telaPergunta.classList.remove("entrando");
      callback();
    }, 120);
  }, 300);
}

/* =========================
   FINALIZAR
========================= */
function finalizarPesquisa() {
  mostrarTelaFinal();
  enviarDados(); // envio nunca bloqueia UI
}

/* =========================
   ENVIO
========================= */
function enviarDados() {
  const dados = new URLSearchParams();
  dados.append("setor", SETOR);

  perguntas.forEach(p => {
    dados.append(p.id, respostas[p.id] || "");
  });

  fetch(URL_APPS_SCRIPT, {
    method: "POST",
    body: dados,
    mode: "no-cors"
  }).catch(() => salvarOffline(dados.toString()));
}

/* =========================
   OFFLINE
========================= */
function salvarOffline(payload) {
  const fila = JSON.parse(localStorage.getItem("fila_respostas") || "[]");
  fila.push(payload);
  localStorage.setItem("fila_respostas", JSON.stringify(fila));
}

window.addEventListener("online", reenviarFilaOffline);

function reenviarFilaOffline() {
  const fila = JSON.parse(localStorage.getItem("fila_respostas") || "[]");
  if (!fila.length) return;

  const restante = [];

  fila.forEach(payload => {
    fetch(URL_APPS_SCRIPT, {
      method: "POST",
      body: payload,
      mode: "no-cors"
    }).catch(() => restante.push(payload));
  });

  localStorage.setItem("fila_respostas", JSON.stringify(restante));
}

/* =========================
   TELA FINAL / RESET
========================= */
function mostrarTelaFinal() {
  telaPergunta.classList.add("hidden");
  telaFinal.classList.remove("hidden");

  setTimeout(reiniciar, 3000);
}

function reiniciar() {
  indice = 0;
  respostas = {};
  bloqueado = false;

  telaFinal.classList.add("hidden");
  telaPergunta.classList.remove("hidden");

  mostrarPergunta();
}
