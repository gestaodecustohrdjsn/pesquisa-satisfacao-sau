const URL_APPS_SCRIPT = "COLE_AQUI_SUA_URL";

const perguntas = [
  { tipo: "escala", id: "recomendacao", texto: "Em uma escala de 0 a 10, o quanto você recomendaria este hospital?" },

  { tipo: "carinhas", id: "seguranca", texto: "Você se sentiu seguro durante o atendimento?" },

  { tipo: "carinhas", id: "clareza", texto: "Como você avalia a clareza das informações recebidas?" },

  { tipo: "simnao", id: "problema", texto: "Você teve algum problema ou dificuldade durante o atendimento?" },

  {
    tipo: "matriz",
    id: "impacto",
    texto: "Qual etapa mais impactou sua experiência?",
    opcoes: [
      "Recepção", "Enfermagem", "Médico",
      "Exames", "Hotelaria / Limpeza", "Alta / Orientações",
      "Tempo de Espera"
    ]
  }
];

let indice = 0;
let respostas = {};

const perguntaEl = document.getElementById("pergunta");
const opcoesEl = document.getElementById("opcoes");
const telaPergunta = document.getElementById("tela-pergunta");
const telaFinal = document.getElementById("tela-final");
const telaQR = document.getElementById("tela-qr");

mostrarPergunta();

function mostrarPergunta() {
  const p = perguntas[indice];
  perguntaEl.innerText = p.texto;
  opcoesEl.className = "opcoes";
  opcoesEl.innerHTML = "";

  if (p.tipo === "escala") {
    opcoesEl.classList.add("escala");
    for (let i = 0; i <= 10; i++) {
      criarBotao(i, i);
    }
  }

  if (p.tipo === "carinhas") {
    criarBotao("Muito seguro", "Muito seguro");
    criarBotao("Parcialmente seguro", "Parcialmente seguro");
    criarBotao("Nada seguro", "Nada seguro");
  }

  if (p.tipo === "simnao") {
    criarBotao("Sim", "Sim");
    criarBotao("Não", "Não");
  }

  if (p.tipo === "matriz") {
    opcoesEl.classList.add("matriz");
    p.opcoes.forEach(o => criarBotao(o, o));
  }
}

function criarBotao(texto, valor) {
  const btn = document.createElement("button");
  btn.innerText = texto;
  btn.onclick = () => responder(valor);
  opcoesEl.appendChild(btn);
}

function responder(valor) {
  const p = perguntas[indice];
  respostas[p.id] = valor;

  if (p.tipo === "simnao" && valor === "Não") {
    telaPergunta.classList.add("hidden");
    telaQR.classList.remove("hidden");
    setTimeout(reiniciar, 10000);
    return;
  }

  indice++;

  if (indice < perguntas.length) {
    mostrarPergunta();
  } else {
    enviar();
  }
}

function enviar() {
  const dados = new URLSearchParams(respostas);

  fetch(URL_APPS_SCRIPT, {
    method: "POST",
    body: dados,
    mode: "no-cors"
  });

  telaPergunta.classList.add("hidden");
  telaFinal.classList.remove("hidden");

  setTimeout(reiniciar, 3000);
}

function reiniciar() {
  indice = 0;
  respostas = {};
  telaFinal.classList.add("hidden");
  telaQR.classList.add("hidden");
  telaPergunta.classList.remove("hidden");
  mostrarPergunta();
}
