// Handle modal logic

const addButton = document.getElementById('add-button');
const cancelButton = document.getElementById('cancel-button');
const modalWrapper = document.getElementById('modal-wrapper');

function openModal() {
  modalWrapper.classList.remove('hidden');
  console.log('hey');
}

function closeModal() {
  modalWrapper.classList.add('hidden');
}

addButton.addEventListener('click', openModal);
cancelButton.addEventListener('click', closeModal);
