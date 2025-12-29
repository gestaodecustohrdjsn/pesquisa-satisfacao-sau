const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbyGMuzVVrpv4iMM9WTm_4nqRjh3HBCKcnRfqOd9Dfdgq0uPHv04e0Qi-gEEymiTBUn7/exec";

// 🔹 AQUI VOCÊ CONTROLA AS PERGUNTAS
const perguntas = [
  { id: "atendimento", texto: "Como você avalia o atendimento?" },
  { id: "espera", texto: "Como você avalia o tempo de espera?" },
  { id: "limpeza", texto: "Como você avalia a limpeza do setor?" }
];

let indice = 0;
let respostas = {};

const perguntaEl = document.getElementById("pergunta");
const telaPergunta = document.getElementById("tela-pergunta");
const telaFinal = document.getElementById("tela-final");

mostrarPergunta();

function mostrarPergunta() {
  perguntaEl.innerText = perguntas[indice].texto;
}

function responder(valor) {
  const chave = perguntas[indice].id;
  respostas[chave] = mapaRespostas[valor];

  indice++;

  if (indice < perguntas.length) {
    mostrarPergunta();
  } else {
    enviarDados();
  }
}

function enviarDados() {

  const dados = new URLSearchParams();
  dados.append("setor", "Ambulatório");
  dados.append("atendimento", respostas.atendimento || "");
  dados.append("espera", respostas.espera || "");
  dados.append("limpeza", respostas.limpeza || "");

  fetch(URL_APPS_SCRIPT, {
    method: "POST",
    body: dados,
    mode: "no-cors"   // 👈 ISSO RESOLVE
  });

  telaPergunta.classList.add("hidden");
  telaFinal.classList.remove("hidden");

  setTimeout(reiniciar, 3000);
}


function reiniciar() {
  indice = 0;
  respostas = {};
  telaFinal.classList.add("hidden");
  telaPergunta.classList.remove("hidden");
  mostrarPergunta();
}

console.log("Ok - JS carregado com sucesso");

// 🔹 Mapeamento de valores para texto
const mapaRespostas = {
  1: "Insatisfeito",
  2: "Satisfeito",
  3: "Muito satisfeito"
};


