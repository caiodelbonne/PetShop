import { novoAgendamento } from "../services/novoAgendamento.js";

const form = document.getElementById("form-agendamento");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Captura os valores preenchidos no formulário
    const nome = document.getElementById("dono-dog").value;
    const pet = document.getElementById("dog-nome").value;
    const telefone = document.getElementById("telefone").value;
    const servico = document.getElementById("servico").value;
    const observacao = document.getElementById("observacao").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;

    // Criar um ID único para o agendamento (pode ser um timestamp)
    const id = Date.now();

    // Criar um objeto com os dados do agendamento
    const agendamento = {
        id,
        nome,
        pet,
        telefone,
        data: `${data} ${hora}`, // Concatenamos a data com a hora
        descricao: servico,
        observacao
    };

    // Enviar os dados para a API
    await novoAgendamento(agendamento);

    // Limpar o formulário após o envio
    form.reset();

    // Fechar o modal após o agendamento ser feito
    document.querySelector(".modal").classList.remove("modal-aberto");
});
