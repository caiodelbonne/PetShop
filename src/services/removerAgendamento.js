// Função para remover agendamento do servidor
export async function removerAgendamento(id) {
    try {
      const response = await fetch(`http://localhost:3333/agendamentos/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao remover agendamento com ID ${id}`);
      }
  
      return true;
    } catch (error) {
      console.error("Erro ao remover o agendamento:", error);
      return false;
    }
  }
  