// Firebase logic

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDIhpv4gNVD3F_m6iQy6H2_rj-ZOwkLGVs',
  authDomain: 'libraryapp-e6f8d.firebaseapp.com',
  projectId: 'libraryapp-e6f8d',
  storageBucket: 'libraryapp-e6f8d.appspot.com',
  messagingSenderId: '778636653006',
  appId: '1:778636653006:web:563882c1ee68a1e0a8bb9f',
};

const app = initializeApp(firebaseConfig);

// Signs-in Library App
async function signIn() {
  // Sign in Firebase using popup auth and Google as the provider
  const provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

// Signs-out of Library App
function signOutUser() {
  // Sign out of Firebase
  signOut(getAuth());
}

// Initialize firebase auth
function initFirebaseAuth() {
  // Listen to auth state changes
  onAuthStateChanged(getAuth(), authStateObserver);
}

// Returns the signed-in user's profile picture URL
function getProfilePicUrl() {
  return getAuth().currentUser.photoURL || '/assets/profile_placeholder.png';
}

// Returns the signed-in user's display name
function getUserName() {
  return getAuth().currentUser.displayName;
}

// Saves a new book to Firestore database
async function saveBook(book) {
  try {
    await addDoc(collection(getFirestore(), getAuth().currentUser.uid), {
      title: book.title,
      author: book.author,
      pages: book.pages,
      read: book.read,
    });
  } catch (error) {
    console.error('Error saving book to database: ', error);
  }
}

// App logic

const books = [];

function createBook(title, author, pages, read) {
  return { title, author, pages, read };
}

function createBookElem(book) {
  const bookElem = document.createElement('div');
  const titleElem = document.createElement('h2');
  const authorElem = document.createElement('p');
  const pagesElem = document.createElement('p');
  const buttons = document.createElement('div');
  const readButton = document.createElement('button');
  const removeButton = document.createElement('button');

  bookElem.className = 'book card';
  buttons.className = 'buttons';
  readButton.className = 'book-button' + (book.read ? ' filled' : '');
  removeButton.className = 'book-button';

  titleElem.textContent = book.title;
  authorElem.textContent = book.author;
  pagesElem.textContent = book.pages + (book.pages === 1 ? ' page' : ' pages');
  readButton.textContent = book.read ? 'Already read' : 'Not read yet';
  removeButton.textContent = 'Remove';

  readButton.addEventListener('click', () => {
    book.read = !book.read;
    readButton.className = 'book-button' + (book.read ? ' filled' : '');
    readButton.textContent = book.read ? 'Already read' : 'Not read yet';
  });

  removeButton.addEventListener('click', () => {
    bookElem.remove();
    removeBook(book);
  });

  buttons.appendChild(readButton);
  buttons.appendChild(removeButton);
  bookElem.appendChild(titleElem);
  bookElem.appendChild(authorElem);
  bookElem.appendChild(pagesElem);
  bookElem.appendChild(buttons);

  return bookElem;
}

const booksElem = document.getElementById('books');

function displayBookElem(bookElem) {
  booksElem.appendChild(bookElem);
}

// Handle adding book logic

const addBookForm = document.getElementById('add-form');
const titleField = document.getElementById('title');
const authorField = document.getElementById('author');
const pagesField = document.getElementById('pages');
const readCheckbox = document.getElementById('read');

function addBookFromForm() {
  const title = titleField.value;
  const author = authorField.value;
  const pages = parseInt(pagesField.value);
  const read = readCheckbox.checked;

  // Create book object and add it to books array
  const book = createBook(title, author, pages, read);
  books.push(book);

  // Create book element and display it
  const bookElem = createBookElem(book);
  displayBookElem(bookElem);

  // Update number of books
  updateBooksNumber();

  // Save book in database
  saveBook(book);

  // Clear form fields and close modal
  clearFields();
  closeModal();
}

function clearFields() {
  titleField.value = '';
  authorField.value = '';
  pagesField.value = '';
  readCheckbox.checked = false;
}

addBookForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addBookFromForm();
});

// Handle removing book logic

function removeBook(book) {
  const index = books.findIndex((b) => b === book);
  books.splice(index, 1);
  updateBooksNumber();
}

// Handle modal logic

const addButton = document.getElementById('add-button');
const cancelButton = document.getElementById('cancel-button');
const modalWrapper = document.getElementById('modal-wrapper');

function openModal() {
  modalWrapper.classList.remove('hidden');
}

function closeModal() {
  modalWrapper.classList.add('hidden');
  clearFields();
}

addButton.addEventListener('click', openModal);
cancelButton.addEventListener('click', closeModal);

// Handle book display mode

const rowsButton = document.getElementById('rows-button');
const gridButton = document.getElementById('grid-button');

function displayAsRows() {
  booksElem.classList.remove('grid-display');
  booksElem.classList.add('rows-display');
}

function displayAsGrid() {
  booksElem.classList.remove('rows-display');
  booksElem.classList.add('grid-display');
}

rowsButton.addEventListener('click', displayAsRows);
gridButton.addEventListener('click', displayAsGrid);

// Handle updating number of books info

const booksNumberElem = document.getElementById('books-number');

function updateBooksNumber() {
  booksNumberElem.textContent =
    books.length + (books.length < 2 ? ' book' : ' books');
}

// Handle sign-in and sign-out

const signInButton = document.getElementById('sign-in-button');
const signOutButton = document.getElementById('sign-out-button');
const userInfo = document.getElementById('user-info');
const userPictureElem = document.getElementById('user-picture');
const userNameElem = document.getElementById('user-name');

signInButton.addEventListener('click', signIn);
signOutButton.addEventListener('click', signOutUser);

function authStateObserver(user) {
  if (user) {
    const profilePicUrl = getProfilePicUrl();
    const userName = getUserName();

    userPictureElem.style.backgroundImage = `url(${profilePicUrl})`;
    userNameElem.textContent = userName;

    userInfo.classList.remove('hidden');
    signInButton.classList.add('hidden');
    signOutButton.classList.remove('hidden');
  } else {
    userInfo.classList.add('hidden');
    signInButton.classList.remove('hidden');
    signOutButton.classList.add('hidden');
  }
}

initFirebaseAuth();
