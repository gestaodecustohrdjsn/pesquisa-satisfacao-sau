const URL_SCRIPT = "COLE_AQUI_SUA_URL_DO_APPS_SCRIPT";

function responder(resposta) {

  fetch(URL_SCRIPT, {
    method: "POST",
    body: JSON.stringify({
      atendimento: resposta
    })
  });

  trocarTela("telaFinal");

  setTimeout(() => {
    location.reload();
  }, 4000);
}

function trocarTela(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}
