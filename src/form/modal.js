import { apiConfig } from "../services/api-config.js";
import { horarioAberto } from "../util/horariofuncionamento.js";

// Selecionando elementos do modal
const botaoNovoAgendamento = document.getElementById("btn-novo-agendamento");
const modal = document.querySelector(".modal");
const botaoFecharModal = document.querySelector(".close-modal");
const inputData = document.getElementById("data");
const inputHora = document.getElementById("hora");

// Lista para armazenar os horários já agendados
let horariosAgendados = []; // Declaração do array global

// Função para buscar os horários já agendados da API
async function carregarHorariosAgendados() {
  try {
    const response = await fetch(`${apiConfig.baseURL}/agendamentos`); // Ou ./server.json
    if (!response.ok) {
      throw new Error("Erro ao buscar os agendamentos");
    }

    const data = await response.json();
    // Extraímos os horários dos agendamentos já existentes
    horariosAgendados = data.agendamentos.map(
      (agendamento) => agendamento.data.split(" ")[1]
    ); // Apenas o horário
  } catch (error) {
    console.error("Erro ao carregar horários agendados: ", error);
    horariosAgendados = []; // Caso não consiga carregar, o array será vazio
  }
}

//  Atualiza os horários disponíveis com base nos horários já agendados

async function atualizarHorariosDisponiveis(dataSelecionada) {
  inputHora.innerHTML = ""; // Limpa a lista de horários

  // Pega os horários agendados
  await carregarHorariosAgendados(dataSelecionada); // Aguarda o carregamento correto dos horários

  // Percorre os horários definidos no horarioAberto
  horarioAberto.forEach((horario) => {
    // Só adiciona o horário se ele não estiver agendado
    if (!horariosAgendados.includes(horario)) {
      const option = document.createElement("option");
      option.value = horario;
      option.textContent = horario;
      inputHora.appendChild(option);
    }
  });
}

//  Bloquear datas passadas no input de data
function configurarDataMinima() {
  const hoje = new Date();
  const dataFormatada = hoje.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  inputData.setAttribute("min", dataFormatada);
}

// 🔹 Alternar exibição do modal
function toggleModal() {
  if (!modal) return;

  modal.classList.toggle("modal-aberto");
  document.body.classList.toggle("modal-aberto");

  if (modal.classList.contains("modal-aberto")) {
    configurarDataMinima(); // Atualiza a data mínima
    atualizarHorariosDisponiveis(); // Atualiza os horários ao abrir o modal
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
