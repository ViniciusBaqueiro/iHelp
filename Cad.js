const formulario = document.getElementById("form-cadastro");
const caixaErros = document.getElementById("erros");
const listaErros = document.getElementById("erros-lista");


const PADRAO_NOME = /^\p{L}[\p{L}'’-]*(?:\s+\p{L}[\p{L}'’-]*)*$/u;
const PADRAO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


function validarNome(input) {
    const nome = input.value.trim().replace(/\s+/g, " ");
    if (nome === "") {
        return "Não foi preenchido.";
    }
    if (!PADRAO_NOME.test(nome)) {
        return "use apenas letras.";
    }
    return "";
}
function validarEmail(input) {
    const email = input.value.trim();
    if (email === "") {
        return "Não foi preenchido.";
    }
    if (!PADRAO_EMAIL.test(email)) {
        return "formato inválido (use o modelo exemplo@email.com).";
    }
    return "";
}
function dataDeHoje() {
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${hoje.getFullYear()}-${mes}-${dia}`;
}
function validarNascimento(input) {
    if (input.validity.badInput) {
        return "Data está incompleta.";
    }
    if (input.value === "") {
        return "Não foi preenchido.";
    }
    if (input.value > dataDeHoje()) {
        return "Data inválida.";
    }
    return "";
}


const campos = [
    { id: "nome",       rotulo: "Nome completo",      validar: validarNome },
    { id: "email",      rotulo: "E-mail",             validar: validarEmail },
    { id: "nascimento", rotulo: "Data de nascimento", validar: validarNascimento }
];


function mostrarResultado(campo) {
    const input = document.getElementById(campo.id);
    const mensagem = document.getElementById(campo.id + "-msg");
    const erro = campo.validar(input);
    const correto = erro === "";

    input.classList.toggle("campo--ok", correto);
    input.classList.toggle("campo--erro", !correto);
    input.setAttribute("aria-invalid", String(!correto));

    mensagem.textContent = correto
        ? "Campo preenchido corretamente."
        : erro;
    mensagem.className = "campo__msg " + (correto ? "campo__msg--ok" : "campo__msg--erro");
}


function coletarErros() {
    const erros = [];

    campos.forEach((campo) => {
        const erro = campo.validar(document.getElementById(campo.id));
        if (erro !== "") {
            erros.push(`${campo.rotulo}: ${erro}`);
        }
    });

    return erros;
}

function exibirErros(erros) {
    listaErros.replaceChildren();

    erros.forEach((texto) => {
        const item = document.createElement("li");
        item.textContent = texto;
        listaErros.appendChild(item);
    });

    caixaErros.hidden = false;
}

function atualizarResumo() {
    if (caixaErros.hidden) {
        return;
    }

    const erros = coletarErros();

    if (erros.length === 0) {
        caixaErros.hidden = true;
    } else {
        exibirErros(erros);
    }
}

function limparTudo() {
    campos.forEach((campo) => {
        const input = document.getElementById(campo.id);
        const mensagem = document.getElementById(campo.id + "-msg");

        input.classList.remove("campo--ok", "campo--erro");
        input.removeAttribute("aria-invalid");
        mensagem.textContent = "";
        mensagem.className = "campo__msg";
    });

    caixaErros.hidden = true;
    listaErros.replaceChildren();
}


formulario.addEventListener("submit", (evento) => {
    campos.forEach(mostrarResultado);

    const erros = coletarErros();

    if (erros.length > 0) {
        evento.preventDefault();
        exibirErros(erros);

        const primeiroComErro = formulario.querySelector(".campo--erro");
        if (primeiroComErro) {
            primeiroComErro.focus();
        }
    } else {
        caixaErros.hidden = true;
    }
});


formulario.addEventListener("reset", limparTudo);


campos.forEach((campo) => {
    const input = document.getElementById(campo.id);

    input.addEventListener("blur", () => {
        mostrarResultado(campo);
        atualizarResumo();
    });

    input.addEventListener("input", () => {
        const jaFoiVerificado = input.classList.contains("campo--ok")
            || input.classList.contains("campo--erro");

        if (jaFoiVerificado) {
            mostrarResultado(campo);
            atualizarResumo();
        }
    });
});
