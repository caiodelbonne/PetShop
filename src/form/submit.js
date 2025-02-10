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
  const id = Number(Date.now());

  // Criar um objeto com os dados do agendamento
  const agendamento = {
    id,
    nome,
    pet, // Adicionando nome do cachorro
    telefone,
    data: `${data} ${hora}`, // Concatenamos a data com a hora
    descricao: servico,
    observacao,
  };

  // Enviar os dados para a API
  await novoAgendamento(agendamento);

  // Limpar o formulário após o envio
  form.reset();

  // Fechar o modal após o agendamento ser feito
  document.querySelector(".modal").classList.remove("modal-aberto");

  // Adicionar o agendamento à interface do usuário
  adicionarAgendamento(nome, pet, hora, servico, observacao);
});

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
  li.classList.add("agendamento-container"); // Adicionando a classe de estilo
  // Adiciona o aria-label ao li para o nome do pet

  li.innerHTML = `
      <strong>${hora}</strong> 
      <strong>Pet: <span class="pet-nome">${nomePet}</span>  Tutor: ${nomeUsuario} </strong> 
      <span>Motivo: <span class="pet-motivo">${descricao}</span> </span>
      ${observacao ? `<p><strong>Observação:</strong> ${observacao}</p>` : ""}
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
    const response = await fetch("./server.json"); // ou a URL da sua API se for o caso
    const data = await response.json();

    data.agendamentos.forEach((agendamento) => {
      // Converte o id para número
      agendamento.id = Number(agendamento.id);

      // Determinar em qual seção o agendamento deve aparecer
      let sectionId = "";
      const horaInt = parseInt(agendamento.data.split(" ")[1].split(":")[0]);

      if (horaInt >= 7 && horaInt < 12) {
        sectionId = "manha";
      } else if (horaInt >= 12 && horaInt < 18) {
        sectionId = "tarde";
      } else {
        sectionId = "noite";
      }

      // Adicionar o agendamento à interface
      adicionarAgendamento(
        agendamento.nome,
        agendamento.pet,
        agendamento.data.split(" ")[1],
        agendamento.descricao,
        agendamento.observacao
      );
    });
  } catch (error) {
    console.error("Erro ao carregar os agendamentos: ", error);
  }
}

// Carregar os agendamentos ao carregar a página
document.addEventListener("DOMContentLoaded", carregarAgendamentos);
