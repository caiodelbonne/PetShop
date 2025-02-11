document.addEventListener("DOMContentLoaded", () => {
    const filterDateInput = document.getElementById("filter-date");
    const agendamentosContainer = document.getElementById("agendamentos-container");

    // Função para formatar a data no padrão YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Definir a data atual no campo de filtro
    const today = new Date();
    filterDateInput.value = formatDate(today);

    // Função para carregar agendamentos do server.json
    const carregarAgendamentos = async () => {
        try {
            const response = await fetch("./server.json");
            const data = await response.json();
            return data.agendamentos || [];
        } catch (error) {
            console.error("Erro ao carregar os agendamentos: ", error);
            return [];
        }
    };

    // Função para exibir agendamentos na interface
    const exibirAgendamentos = (agendamentos, dataSelecionada) => {
        // Limpar o contêiner de agendamentos
        agendamentosContainer.innerHTML = "";

        // Filtrar agendamentos pela data selecionada
        const agendamentosFiltrados = agendamentos.filter((agendamento) =>
            agendamento.data.startsWith(dataSelecionada)
        );

        if (agendamentosFiltrados.length === 0) {
            agendamentosContainer.innerHTML = "<p>Nenhum agendamento para esta data.</p>";
            return;
        }

        // Criar elementos para cada agendamento filtrado
        agendamentosFiltrados.forEach((agendamento) => {
            const agendamentoDiv = document.createElement("div");
            agendamentoDiv.classList.add("agendamento-item");

            agendamentoDiv.innerHTML = `
                <p><strong>Hora:</strong> ${agendamento.data.split(" ")[1]}</p>
                <p><strong>Pet:</strong> ${agendamento.pet}</p>
                <p><strong>Tutor:</strong> ${agendamento.nome}</p>
                <p class="line" class="line" ><strong>Serviço:</strong> ${agendamento.descricao}</p>
                ${agendamento.observacao ? `<p class="line" ><strong class="line" >Observação:</strong> ${agendamento.observacao}</p>` : ""}
            `;

            agendamentosContainer.appendChild(agendamentoDiv);
        });
    };

    // Carregar e exibir agendamentos ao carregar a página
    carregarAgendamentos().then((agendamentos) => {
        exibirAgendamentos(agendamentos, filterDateInput.value);
    });

    // Atualizar exibição ao mudar a data no filtro
    filterDateInput.addEventListener("change", () => {
        carregarAgendamentos().then((agendamentos) => {
            exibirAgendamentos(agendamentos, filterDateInput.value);
        });
    });
});
