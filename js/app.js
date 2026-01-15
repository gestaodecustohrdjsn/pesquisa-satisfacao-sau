const perguntas = [
  {
    tipo: "escala",
    texto: "Em uma escala de 0 a 10, o quanto você recomendaria este hospital?"
  },
  {
    tipo: "carinhas",
    texto: "Você se sentiu seguro durante o atendimento?",
    opcoes: [
      { label: "Muito seguro", img: "Muito Satisfeito.png" },
      { label: "Parcialmente seguro", img: "Satisfeito.png" },
      { label: "Nada seguro", img: "Insatisfeito.png" }
    ]
  },
  {
    tipo: "carinhas",
    texto: "Como você avalia a clareza das informações recebidas?",
    opcoes: [
      { label: "Muito satisfeito", img: "Muito Satisfeito.png" },
      { label: "Satisfeito", img: "Satisfeito.png" },
      { label: "Insatisfeito", img: "Insatisfeito.png" }
    ]
  },
  {
    tipo: "sim_nao",
    texto: "Você teve algum problema ou dificuldade durante o atendimento?"
  },
  {
    tipo: "matriz",
    texto: "Qual etapa mais impactou sua experiência?",
    opcoes: [
      "Recepção", "Enfermagem", "Médico",
      "Exames", "Hotelaria / Limpeza", "Alta / Orientações",
      "Tempo de espera"
    ]
  }
];

let indice = 0;

const textoPergunta = document.getElementById("texto-pergunta");
const respostas = document.getElementById("respostas");
const telaPergunta = document.getElementById("tela-pergunta");
const telaQRCode = document.getElementById("tela-qrcode");
const telaFinal = document.getElementById("tela-final");

function mostrarPergunta() {
  respostas.innerHTML = "";
  telaPergunta.classList.remove("hidden");
  telaQRCode.classList.add("hidden");
  telaFinal.classList.add("hidden");

  const p = perguntas[indice];
  textoPergunta.innerText = p.texto;

  if (p.tipo === "escala") {
    respostas.className = "escala";
    for (let i = 0; i <= 10; i++) {
      criarBotao(i);
    }
  }

  if (p.tipo === "carinhas") {
    respostas.className = "";
    p.opcoes.forEach(o => {
      const div = document.createElement("div");
      div.className = "carinha";
      div.innerHTML = `<img src="assets/images/${o.img}"><span>${o.label}</span>`;
      div.onclick = avancar;
      respostas.appendChild(div);
    });
  }

  if (p.tipo === "sim_nao") {
    respostas.className = "";
    criarBotao("Sim", () => mostrarQRCode());
    criarBotao("Não", avancar);
  }

  if (p.tipo === "matriz") {
    respostas.className = "matriz";
    p.opcoes.forEach(o => criarBotao(o, finalizar));
  }
}

function criarBotao(texto, acao = avancar) {
  const btn = document.createElement("button");
  btn.className = "botao";
  btn.innerText = texto;
  btn.onclick = acao;
  respostas.appendChild(btn);
}

function avancar() {
  indice++;
  if (indice < perguntas.length) mostrarPergunta();
}

function mostrarQRCode() {
  telaPergunta.classList.add("hidden");
  telaQRCode.classList.remove("hidden");

  setTimeout(() => {
    indice++;
    mostrarPergunta();
  }, 8000);
}

function finalizar() {
  telaPergunta.classList.add("hidden");
  telaFinal.classList.remove("hidden");
  setTimeout(() => location.reload(), 5000);
}

mostrarPergunta();
