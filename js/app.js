const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbz37vCcKamK_c4AtNUP3Bz0UlbjVj183XtQ9RTly1FWNte7X5ZJ0uHLFKlhGDQ9WYEa/exec";

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
  respostas[chave] = valor;

  indice++;

  if (indice < perguntas.length) {
    mostrarPergunta();
  } else {
    enviarDados();
  }
}

function enviarDados() {

  const dados = new URLSearchParams({
    setor: "Ambulatório",
    atendimento: respostas.atendimento || "",
    espera: respostas.espera || "",
    limpeza: respostas.limpeza || ""
  });

  fetch(URL_APPS_SCRIPT, {
    method: "POST",
    body: dados
  })
  .then(() => console.log("Dados enviados com sucesso"))
  .catch(err => console.error("Erro no envio", err));

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

console.log("JS carregado com sucesso");

