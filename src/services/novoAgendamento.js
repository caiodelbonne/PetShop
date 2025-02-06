import { apiConfig } from "./api-config.js";



export async function novoAgendamento({ id, nome, data, descricao, observacao }) {
    try {
        await fetch(`${apiConfig.baseURL}/agendamentos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, nome, data, descricao, observacao }),
        });

        alert("Agendamento realizado. Obrigado");
    } catch (error) {
        console.log(error);
        alert("Não foi possível agendar.");
    }
}
