const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbyGMuzVVrpv4iMM9WTm_4nqRjh3HBCKcnRfqOd9Dfdgq0uPHv04e0Qi-gEEymiTBUn7/exec";

const params = new URLSearchParams(window.location.search);
const SETOR = params.get("setor") || "Ambulatório";

console.log("Setor ativo:", SETOR);

console.log("Ok - JS carregado com sucesso");

/* =========================
   CONFIGURAÇÃO DAS PERGUNTAS
========================= */
const perguntas = [
  { id: "atendimento", texto: "Como você avalia o atendimento?" },
  { id: "espera", texto: "Como você avalia o tempo de espera?" },
  { id: "limpeza", texto: "Como você avalia a limpeza do setor?" }
];

/* =========================
   MAPA DE RESPOSTAS
========================= */
const mapaRespostas = {
  1: "Insatisfeito",
  2: "Satisfeito",
  3: "Muito satisfeito"
};

console.log("Mapa ativo:", mapaRespostas);

/* =========================
   VARIÁVEIS DE CONTROLE
========================= */
let indice = 0;
let respostas = {};
let bloqueado = false;

/* =========================
   ELEMENTOS DA TELA
========================= */
const perguntaEl = document.getElementById("pergunta");
const telaPergunta = document.getElementById("tela-pergunta");
const telaFinal = document.getElementById("tela-final");

/* =========================
   INICIALIZA
========================= */
mostrarPergunta();
console.log("JS carregado com sucesso");

/* =========================
   MOSTRAR PERGUNTA
========================= */
function mostrarPergunta() {
  perguntaEl.innerText = perguntas[indice].texto;
}

/* =========================
   RESPONDER (CLIQUES)
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
      enviarDados();
    }
  });
}

/* =========================
   ANIMAÇÃO ENTRE PERGUNTAS
========================= */
function animarTrocaPergunta(callback) {
  telaPergunta.classList.add("saindo");

  setTimeout(() => {
    telaPergunta.classList.remove("saindo");
    telaPergunta.classList.add("entrando");

    setTimeout(() => {
      telaPergunta.classList.remove("entrando");
      callback();
    }, 100);
  }, 350);
}

/* =========================
   ENVIO (ONLINE / OFFLINE)
========================= */
function enviarDados() {

  const dados = new URLSearchParams();
  dados.append("setor", SETOR);
  dados.append("atendimento", respostas.atendimento || "");
  dados.append("espera", respostas.espera || "");
  dados.append("limpeza", respostas.limpeza || "");

  fetch(URL_APPS_SCRIPT, {
    method: "POST",
    body: dados,
    mode: "no-cors" // 👈 mantém isso
  }).catch(() => salvarOffline(dados.toString()));

  mostrarTelaFinal();
}

/* =========================
   OFFLINE
========================= */
function salvarOffline(dadosString) {
  const fila = JSON.parse(localStorage.getItem("fila_respostas")) || [];
  fila.push(dadosString);
  localStorage.setItem("fila_respostas", JSON.stringify(fila));
}

window.addEventListener("online", enviarFilaOffline);

function enviarFilaOffline() {
  const fila = JSON.parse(localStorage.getItem("fila_respostas")) || [];
  if (!fila.length) return;

  fila.forEach((dados, index) => {
    fetch(URL_APPS_SCRIPT, {
      method: "POST",
      body: dados,
      mode: "no-cors"
    }).then(() => {
      fila.splice(index, 1);
      localStorage.setItem("fila_respostas", JSON.stringify(fila));
    });
  });
}


/* =========================
   TELA FINAL + RESET
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



