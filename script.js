const library = [];

function Book(title, author, pages, readYet) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readYet = readYet ? readYet : false;
}

function addBookToLibrary() {
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const pages = document.querySelector('#pages').value;
  const readYet = document.querySelector('#read-yet').checked;

  const newBook = new Book(title, author, pages, readYet);

  library.push(newBook);
}

document.querySelector('#add-book-form').addEventListener('submit', event => {
  event.preventDefault();
  addBookToLibrary();
});