// the array in which all book objects are stored
const library = [];

// constructor to build book objects
function Book(title, author, nbOfPages, readStatus) {
  this.title = title;
  this.author = author;
  this.nbOfPages = nbOfPages;
  this.readStatus = readStatus || false;
}

// create and return html card of the book object
Book.prototype.createCard = function() {
  const title = document.createElement('h2');
  title.textContent = this.title;
  const author = document.createElement('p');
  author.textContent = 'by ' + this.author;
  const nbOfPages = document.createElement('p');
  nbOfPages.textContent = this.nbOfPages + ' pages';

  const readButton = document.createElement('button');
  readButton.textContent = this.readStatus ? 'Already read' : 'Not read yet';
  readButton.classList.add('main', 'smaller');
  if (this.readStatus) readButton.classList.add('active');
  readButton.addEventListener('click', () => {
    this.toggleReadStatus();
    this.updateCard();
  });

  const removeButton = document.createElement('button');
  removeButton.textContent = 'remove';
  removeButton.classList.add('main', 'smaller');
  removeButton.addEventListener('click', () => {
    this.remove();
  });

  const card = document.createElement('div');
  card.classList.add('card');
  card.append(title, author, nbOfPages, readButton, removeButton);
  return card;
}

// update card when a change is made to book object
Book.prototype.updateCard = function() {
  const bookIndex = this.findIndex();
  document.querySelectorAll('.card')[bookIndex].replaceWith(this.createCard());
}

// toggle book read status
Book.prototype.toggleReadStatus = function() {
  this.readStatus = !this.readStatus;
}

// return position of the book in library array
Book.prototype.findIndex = function() {
  return library.findIndex(book => {
    return book.title === this.title && book.author === this.author;
  });
}

// delete book from library array and from html list
Book.prototype.remove = function() {
  console.log(this);
  const bookIndex = this.findIndex();
  library.splice(bookIndex, 1);
  document.querySelectorAll('.card')[bookIndex].remove();

  // Update number of books on top bar
  updateNbOfBooks();
}

const form = document.querySelector('#add-book-form');
form.addEventListener('submit', event => {
  // Prevent the form from submitting
  event.preventDefault();

  addBookToLibrary();

  // Clear all form inputs
  form.reset();
  // Close modal after submitting
  closeModal();
});

function addBookToLibrary() {
  // Gather input values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const nbOfPages = document.querySelector('#nb-of-pages').value;
  const readStatus = document.querySelector('#read-status').checked;

  // Create book object from user inputs and add it to library array
  const newBook = new Book(title, author, nbOfPages, readStatus);
  library.push(newBook);

  // Create an html card from book object and add it to html list
  const card = newBook.createCard();
  document.querySelector('#library-list').appendChild(card);

  // Update number of books on top bar
  updateNbOfBooks();
}


document.querySelector('#row-display-btn').addEventListener('click', () => {
  document.querySelector('#library-list').classList.remove('col-display');
});
document.querySelector('#col-display-btn').addEventListener('click', () => {
  document.querySelector('#library-list').classList.add('col-display');
});


function updateNbOfBooks() {
  document.querySelector('#nb-of-books').textContent = library.length;
}


function openModal() {
  document.querySelector('#modal').classList.remove('hidden');
}
function closeModal() {
  document.querySelector('#modal').classList.add('hidden');
}

const openModalButton = document.querySelector('#open-modal-btn');
openModalButton.addEventListener('click', openModal);

const closeModalButton = document.querySelector('#close-modal-btn');
closeModalButton.addEventListener('click', closeModal);

const modal = document.querySelector('#modal');
modal.addEventListener('click', event => {
  // If user clicks outside of modal content, close modal
  if (event.target === modal) closeModal();
});