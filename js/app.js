// 🔗 URL do Apps Script (Web App)
const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbx6D4Kg6ZZHosbLveXr-LqgzDRO6O1ME7WffNo8pONYT4IBJmJFloPSk03juCpGoii0/exec";

// Torna a função visível para o HTML
window.responder = function(resposta) {
  console.log("Clique detectado:", resposta);

  enviarDados(resposta);
  trocarTela("telaFinal");

  setTimeout(() => {
    location.reload();
  }, 4000);
};

function enviarDados() {
  fetch(URL_APPS_SCRIPT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      setor: setorSelecionado,
      atendimento: respostaAtendimento,
      espera: respostaEspera,
      limpeza: respostaLimpeza
    })
  });
}


window.trocarTela = function(id) {
  document.querySelectorAll(".tela").forEach(t =>
    t.classList.remove("ativa")
  );
  document.getElementById(id).classList.add("ativa");
};
