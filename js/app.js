const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbx6D4Kg6ZZHosbLveXr-LqgzDRO6O1ME7WffNo8pONYT4IBJmJFloPSk03juCpGoii0/exec";

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

  fetch(URL_APPS_SCRIPT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      setor: "Ambulatório",
      atendimento: respostas.atendimento || "",
      espera: respostas.espera || "",
      limpeza: respostas.limpeza || ""
    })
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
