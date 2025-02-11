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

  // verifica se tudo que e obrigatorio foi preenchido
  if (!nome || !pet || !telefone || !servico || !data || !hora) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  // Criar um ID único para o agendamento (pode ser um timestamp)
  const id = Number(Date.now());

  // Corrigir a hora se necessário, garantindo que é no formato HH:mm
  const horaFormatada = formatarHora(hora);

  // Criar o objeto com os dados do agendamento
  const agendamento = {
    id,
    nome,
    pet,
    telefone,
    data: `${data} ${horaFormatada}`,
    descricao: servico,
    observacao,
  };

  // Carregar agendamentos existentes
  const agendamentosExistentes = await carregarAgendamentos();

  // Verificar se o horário já está ocupado
  const horarioExistente = agendamentosExistentes.some(
    (item) => item.data === agendamento.data
  );

  if (horarioExistente) {
    alert("Já existe um agendamento nesse horário. Escolha outro horário.");
    return; // Impede o envio se o horário já estiver ocupado
  }

  // Enviar os dados para a API
  const sucesso = await novoAgendamento(agendamento);

  if (sucesso) {
    // Limpar o formulário após o envio
    form.reset();

    // Fechar o modal após o agendamento ser feito
    document.querySelector(".modal").classList.remove("modal-aberto");

    // Adicionar o agendamento à interface do usuário
    adicionarAgendamento(nome, pet, horaFormatada, servico, observacao);
  } else {
    alert("Ocorreu um erro ao tentar agendar. Por favor, tente novamente.");
  }
});

// Função para formatar a hora no formato correto
function formatarHora(hora) {
  let [horaParte, minutoParte] = hora.split(":");
  horaParte = parseInt(horaParte);

  if (horaParte === 24) {
    horaParte = 0; // Corrige a hora de 24 para 0
  }

  return `${horaParte.toString().padStart(2, "0")}:${minutoParte}`;
}

// Função para adicionar agendamento na interface
function adicionarAgendamento(
  nomeUsuario,
  nomePet,
  hora,
  descricao,
  observacao
) {
  // Determinar em qual seção o agendamento deve aparecer
  let sectionId = "";
  const horaInt = parseInt(hora.split(":")[0]);

  if (horaInt >= 7 && horaInt < 12) {
    sectionId = "manha";
  } else if (horaInt >= 12 && horaInt < 18) {
    sectionId = "tarde";
  } else {
    sectionId = "noite";
  }

  // Cria um novo li para o agendamento
  const li = document.createElement("li");
  li.classList.add("agendamento-container");

  li.innerHTML = `
      <strong>${hora}</strong> 
      <strong>Pet: <span class="pet-nome">${nomePet}</span>  Tutor: ${nomeUsuario} </strong> 
      <span>Motivo: <span class="pet-motivo">${descricao}</span> </span>
      ${
        observacao
          ? `<p><strong>Observação:</strong> <span class="obs-pet">${observacao}</span> </p>`
          : ""
      }
      <button type="button" class="remover-agendamento">Remover agendamento</button>
  `;

  // Adiciona o novo agendamento na lista correta
  const ul = document.querySelector(`#${sectionId} ul`);
  ul.appendChild(li);

  // Adicionar funcionalidade para remover o agendamento
  const botaoRemover = li.querySelector(".remover-agendamento");
  botaoRemover.addEventListener("click", () => {
    li.remove();
  });
}

// Função para carregar agendamentos e exibi-los nas seções
async function carregarAgendamentos() {
  try {
    const response = await fetch("./server.json");
    const data = await response.json();

    // Mapeia os agendamentos para um formato consistente
    const agendamentos = data.agendamentos.map((agendamento) => ({
      id: agendamento.id,
      nome: agendamento.nome,
      pet: agendamento.pet,
      telefone: agendamento.telefone,
      data: agendamento.data,
      descricao: agendamento.descricao,
      observacao: agendamento.observacao,
    }));

    // Exibe os agendamentos carregados
    agendamentos.forEach((agendamento) => {
      const [dataAgendamento, horaAgendamento] = agendamento.data.split(" ");
      adicionarAgendamento(
        agendamento.nome,
        agendamento.pet,
        horaAgendamento,
        agendamento.descricao,
        agendamento.observacao
      );
    });

    return agendamentos; // Retorna os agendamentos para verificação
  } catch (error) {
    console.error("Erro ao carregar os agendamentos: ", error);
    return []; // Retorna um array vazio em caso de erro
  }
}

// Carregar os agendamentos ao carregar a página
document.addEventListener("DOMContentLoaded", carregarAgendamentos);
