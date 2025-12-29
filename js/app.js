// 🔗 URL do seu Apps Script publicado como Web App
const URL_SCRIPT = "COLE_AQUI_SUA_URL_DO_APPS_SCRIPT";

// ⚠️ Torna a função visível para o HTML
window.responder = function(resposta) {
  console.log("Clique detectado:", resposta);

  enviarDados(resposta);
  trocarTela("telaFinal");

  setTimeout(() => {
    location.reload();
  }, 4000);
};

function enviarDados(resposta) {
  fetch(URL_SCRIPT, {
    method: "POST",
    body: JSON.stringify({
      atendimento: resposta
    })
  })
  .then(r => r.text())
  .then(r => console.log("Resposta do servidor:", r))
  .catch(err => console.error("Erro no envio:", err));
}

window.trocarTela = function(id) {
  document.querySelectorAll(".tela").forEach(t =>
    t.classList.remove("ativa")
  );
  document.getElementById(id).classList.add("ativa");
};
