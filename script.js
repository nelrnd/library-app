const library = [];

function Book(title, author, pages, readYet) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readYet = readYet ? readYet : false;
}

Book.prototype.toggleRead = function() {
  this.readYet = this.readYet ? false : true;
}

Book.prototype.remove = function() {
  const findBookIndex = book => {
    return book.title === this.title && book.author === this.author;
  }
  const bookIndex = library.findIndex(findBookIndex);
  library.splice(bookIndex, 1);
}

function addBookToLibrary() {
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const pages = document.querySelector('#pages').value;
  const readYet = document.querySelector('#read-yet').checked;

  const newBook = new Book(title, author, pages, readYet);

  library.push(newBook);
  displayBooks();
}

document.querySelector('#add-book-form').addEventListener('submit', event => {
  event.preventDefault();
  addBookToLibrary();
  resetForm();
});

function displayBooks() {
  // Empty the list
  document.querySelector('#library-grid').innerHTML = '';

  library.forEach(book => {
    const item = document.createElement('div');
    item.classList.add('item');
    const title = document.createElement('h3');
    title.textContent = book.title;
    item.appendChild(title);
    const author = document.createElement('p');
    author.textContent = 'by ' + book.author;
    item.appendChild(author);
    const pages = document.createElement('p');
    pages.textContent = book.pages + ' pages';
    item.appendChild(pages);

    const readBtn = document.createElement('button');
    readBtn.textContent = book.readYet ? 'Already read' : 'Not read yet';
    if (book.readYet) readBtn.className = 'active';
    readBtn.addEventListener('click', () => {
      book.toggleRead();
      displayBooks();
    });
    item.appendChild(readBtn);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'remove';
    removeBtn.addEventListener('click', () => {
      book.remove();
      displayBooks();
    });
    item.appendChild(removeBtn);

    document.querySelector('#library-grid').appendChild(item);
  });

  updateTopBar();
}

function resetForm() {
  document.querySelector('#title').value = '';
  document.querySelector('#author').value = '';
  document.querySelector('#pages').value = '';
  document.querySelector('#read-yet').checked = false;
}

function displayForm() {
  document.querySelector('.add-book').classList.remove('hidden');
  document.querySelector('.add-book-background').classList.remove('hidden');
}
function hideForm() {
  document.querySelector('.add-book').classList.add('hidden');
  document.querySelector('.add-book-background').classList.add('hidden');
}

function updateGridStyle(type) {
  if (type == 'row') {
    document.querySelector('#library-grid').classList.remove('cols');
  } else {
    document.querySelector('#library-grid').classList.add('cols');
  }
}

function updateTopBar() {
  document.querySelector('#nb-of-books').textContent = library.length;
}