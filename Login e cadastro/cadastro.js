
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbyhtD-cfIPDFJ3J-2Zs6lSIMBy3Dr71HDQp6pjZEo0CSlffSP6DSnVjY_khSqi8m2ol/exec";


// MOSTRAR SENHA

function mostrarSenha() {

    var inputPass = document.getElementById("Senha");
    var btnShowPass = document.getElementById("btn-senha");

    if (inputPass.type === "password") {

        inputPass.setAttribute("type", "text");
        btnShowPass.classList.replace(
            "bi-eye-fill",
            "bi-eye-slash-fill"
        );

    } else {

        inputPass.setAttribute("type", "password");
        btnShowPass.classList.replace(
            "bi-eye-slash-fill",
            "bi-eye-fill"
        );
    }
}


// MOSTRAR CONFIRMAÇÃO

function mostrarConfirmarSenha() {

    var inputConfirmarSenha =
        document.getElementById("ConfirmarSenha");

    var btnConfirmarSenha =
        document.getElementById("btn-confirmar-senha");

    if (inputConfirmarSenha.type === "password") {

        inputConfirmarSenha.setAttribute("type", "text");

        btnConfirmarSenha.classList.replace(
            "bi-eye-fill",
            "bi-eye-slash-fill"
        );

    } else {

        inputConfirmarSenha.setAttribute("type", "password");

        btnConfirmarSenha.classList.replace(
            "bi-eye-slash-fill",
            "bi-eye-fill"
        );
    }
}


// CADASTRO

document.getElementById("btnCadastro").addEventListener("click", async function () {

    var nome = document.getElementById("Nome").value;
    var usuario = document.getElementById("Usuario").value;
    var senha = document.getElementById("Senha").value;
    var confirmarSenha =
        document.getElementById("ConfirmarSenha").value;


    // Verifica campos vazios
    if (
        nome === "" ||
        usuario === "" ||
        senha === "" ||
        confirmarSenha === ""
    ) {

        alert("Preencha todos os campos!");
        return;
    }


    // Verifica se as senhas são iguais
    if (senha !== confirmarSenha) {

        alert("As senhas não são iguais!");
        return;
    }


    try {

        var resposta = await fetch(
            URL_APPS_SCRIPT +
            "?acao=cadastro" +
            "&nome=" + encodeURIComponent(nome) +
            "&usuario=" + encodeURIComponent(usuario) +
            "&senha=" + encodeURIComponent(senha)
        );


        var dados = await resposta.json();


        if (dados.sucesso) {

            alert("Cadastro realizado com sucesso!");

            // Volta para o login
            window.location.href = "login.html";

        } else {

            alert(dados.mensagem);
        }


    } catch (erro) {

        console.error(erro);

        alert("Erro ao conectar com o banco de dados.");
    }

});

