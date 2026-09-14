
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbyhtD-cfIPDFJ3J-2Zs6lSIMBy3Dr71HDQp6pjZEo0CSlffSP6DSnVjY_khSqi8m2ol/exec";


// Mostrar / esconder senha
function mostrarSenha() {
    var inputPass = document.getElementById("Senha");
    var btnShowPass = document.getElementById("btn-senha");

    if (inputPass.type === "password") {
        inputPass.setAttribute("type", "text");
        btnShowPass.classList.replace("bi-eye-fill", "bi-eye-slash-fill");
    } else {
        inputPass.setAttribute("type", "password");
        btnShowPass.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
    }
}


// Fazer login
document.getElementById("btnLogin").addEventListener("click", async function () {

    var usuario = document.getElementById("Usuario").value;
    var senha = document.getElementById("Senha").value;

    // Verifica se os campos estão preenchidos
    if (usuario === "" || senha === "") {
        alert("Preencha usuário e senha!");
        return;
    }

    try {

        // Envia usuário e senha para o Google Apps Script
        var resposta = await fetch(
            URL_APPS_SCRIPT +
            "?acao=login" +
            "&usuario=" + encodeURIComponent(usuario) +
            "&senha=" + encodeURIComponent(senha)
        );

        var dados = await resposta.json();

        // Verifica a resposta
        if (dados.sucesso) {

            // O Apps Script deve retornar o campo "nome" na resposta do login.
            sessionStorage.setItem("nomeUsuario", dados.nome || dados.usuario || usuario);
            sessionStorage.setItem("idUsuario", usuario);

            alert("Login realizado com sucesso!");

            // Vai para a página principal
            window.location.href = "../Usuario/index.html";

        } else {

            alert("Usuário ou senha incorretos!");

        }

    } catch (erro) {

        console.error(erro);
        alert("Erro ao conectar com o banco de dados.");

    }

});

