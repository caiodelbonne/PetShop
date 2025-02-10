import { horarioAberto} from "../util/horariofuncionamento.js";

const botaoNovoAgendamento = document.getElementById("btn-novo-agendamento");
const modal = document.querySelector(".modal");
const botaoFecharModal = document.querySelector(".close-modal");
const inputData = document.getElementById("data");
const inputHora = document.getElementById("hora");


// 🔹 Bloquear datas passadas no input de data
function configurarDataMinima() {
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split("T")[0]; // Pega a data no formato YYYY-MM-DD
    inputData.setAttribute("min", dataFormatada);
}


// 🔹 Atualiza os horários disponíveis com base na data escolhida
function atualizarHorariosDisponiveis() {
    inputHora.innerHTML = ""; // Limpa opções anteriores

    horarioAberto.forEach((horario) => {
        const option = document.createElement("option");
        option.value = horario;
        option.textContent = horario;
        inputHora.appendChild(option);
    });
}

function toggleModal () {
    if (!modal) return;

    modal.classList.toggle("modal-aberto");
    document.body.classList.toggle("modal-aberto");

    if (modal.classList.contains("modal-aberto")) {
        configurarDataMinima(); // Define a data mínima quando o modal é aberto
        atualizarHorariosDisponiveis(); // Atualiza horários ao abrir o modal
    }
}

// 🔹 Eventos para abrir e fechar o modal
botaoNovoAgendamento?.addEventListener("click", toggleModal);
botaoFecharModal?.addEventListener("click", toggleModal);

modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
        toggleModal();
    }
});

// 🔹 Fechar modal ao pressionar "Esc"
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("modal-aberto")) {
        toggleModal();
    }
});