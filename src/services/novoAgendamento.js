import { apiConfig } from "./api-config.js";

export async function novoAgendamento({  nome, pet, data, descricao, observacao }) {
    try {
      const response =  await fetch(`${apiConfig.baseURL}/agendamentos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({  nome, pet, data, descricao, observacao }),  // Incluindo o nome do pet
        });
        if (!response.ok) {
            throw new Error(`Erro ao agendar: ${response.statusText}`);
        }

        alert("Agendamento realizado. Obrigado");
    } catch (error) {
        console.log(error);
        alert("Não foi possível agendar.");
    }
}
