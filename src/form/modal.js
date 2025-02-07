const botaoNovoAgendamento = document.getElementById("btn-novo-agendamento");
const modal = document.querySelector(".modal")
const botaoFecharModal = document.querySelector(".close-modal");

function toggleModal () {
    modal.classList.toggle("modal-aberto")
}

botaoNovoAgendamento.addEventListener("click", toggleModal);
botaoFecharModal.addEventListener("click", toggleModal);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        toggleModal();
    }
});