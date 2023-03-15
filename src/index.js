import { initializeApp } from 'firebase/app';

const app = initializeApp({
  apiKey: 'AIzaSyDIhpv4gNVD3F_m6iQy6H2_rj-ZOwkLGVs',
  authDomain: 'libraryapp-e6f8d.firebaseapp.com',
  projectId: 'libraryapp-e6f8d',
  storageBucket: 'libraryapp-e6f8d.appspot.com',
  messagingSenderId: '778636653006',
  appId: '1:778636653006:web:563882c1ee68a1e0a8bb9f',
});

// the array in which all book objects are stored
const library = [];

class Book {
  constructor(title, author, nbOfPages, readStatus) {
    this.title = title;
    this.author = author;
    this.nbOfPages = nbOfPages;
    this.readStatus = readStatus || false;
  }

  createCard() {
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

  updateCard() {
    const bookIndex = this.findIndex();
    document
      .querySelectorAll('.card')
      [bookIndex].replaceWith(this.createCard());
  }

  toggleReadStatus() {
    this.readStatus = !this.readStatus;
  }

  findIndex() {
    return library.findIndex((book) => {
      return book.title === this.title && book.author === this.author;
    });
  }

  remove() {
    console.log(this);
    const bookIndex = this.findIndex();
    library.splice(bookIndex, 1);
    document.querySelectorAll('.card')[bookIndex].remove();

    updateNbOfBooks();
  }
}

const form = document.querySelector('#add-book-form');
form.addEventListener('submit', (event) => {
  // Prevent the form from submitting
  event.preventDefault();

  if (!form.checkValidity()) {
    validateForm();
  } else {
    const book = createBookFromInputs();
    addBookToLibrary(book);

    // Clear all form inputs
    form.reset();
    // Close modal after submitting
    closeModal();
  }
});

function addBookToLibrary(book) {
  // Add book to library array
  library.push(book);

  // Create an html card from book object and add it to html list
  const card = book.createCard();
  document.querySelector('#library-list').appendChild(card);

  // Update number of books on top bar
  updateNbOfBooks();
}

function createBookFromInputs() {
  // Gather input values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const nbOfPages = document.querySelector('#nb-of-pages').value;
  const readStatus = document.querySelector('#read-status').checked;

  // Create and return book object
  const book = new Book(title, author, nbOfPages, readStatus);
  return book;
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
modal.addEventListener('click', (event) => {
  // If user clicks outside of modal content, close modal
  if (event.target === modal) closeModal();
});

// Add some books for presentation purpose
addBookToLibrary(new Book('Deep Work', 'Cal Newport', 296, true));
addBookToLibrary(new Book('The Power of Now', 'Eckhart Tolle', 236, false));

// Form validation

const bookTitle = document.querySelector('#title');
const bookAuthor = document.querySelector('#author');
const nbOfPages = document.querySelector('#nb-of-pages');

function validateForm() {
  validateNbOfPages();
  nbOfPages.addEventListener('input', validateNbOfPages);

  validateBookAuthor();
  bookAuthor.addEventListener('input', validateBookAuthor);

  validateBookTitle();
  bookTitle.addEventListener('input', validateBookTitle);
}

function validateBookTitle() {
  if (bookTitle.validity.valueMissing) {
    bookTitle.setCustomValidity('You must specifity the title of the book');
    bookTitle.reportValidity();
  } else {
    bookTitle.setCustomValidity('');
  }
}

function validateBookAuthor() {
  if (bookAuthor.validity.valueMissing) {
    bookAuthor.setCustomValidity('You must specifity the author of the book');
    bookAuthor.reportValidity();
  } else {
    bookAuthor.setCustomValidity('');
  }
}

function validateNbOfPages() {
  if (nbOfPages.validity.valueMissing) {
    nbOfPages.setCustomValidity(
      'You must specifity the number of pages of the book'
    );
    nbOfPages.reportValidity();
  } else {
    nbOfPages.setCustomValidity('');
  }
}