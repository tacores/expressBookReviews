const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(JSON.stringify({books}));
  });
  get_books
    .then((data) => res.send(data))
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });;
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const get_book = new Promise((resolve, reject) => {
    if (isbn in books) {
      resolve(JSON.stringify(books[isbn]));
    } else {
      reject("Unable to find the ISBN");
    }
  });
  get_book
    .then((data) => res.send(data))
    .catch((error) => {
      console.error('Error:', error);
      res.status(404).send(error);
    });;
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = decodeURIComponent(req.params.author);

  const get_books = new Promise((resolve, reject) => {
    let filtered_books = Object.values(books).filter((book) => author === book.author );
    if (filtered_books.length > 0) {
      return resolve(JSON.stringify(filtered_books));
    } else {
      return reject("Unable to find the book");
    }
  });
  get_books
    .then((data) => res.send(data))
    .catch((error) => {
      console.error('Error:', error);
      res.status(404).send(error);
    });;
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = decodeURIComponent(req.params.title);
  const get_books = new Promise((resolve, reject) => {
    let filtered_books = Object.values(books).filter((book) => title === book.title );
    if (filtered_books.length > 0) {
      return resolve(JSON.stringify(filtered_books));
    } else {
      return reject("Unable to find the book");
    }
  });
  get_books
    .then((data) => res.send(data))
    .catch((error) => {
      console.error('Error:', error);
      res.status(404).send(error);
    });;
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = decodeURIComponent(req.params.isbn);
  if (isbn in books) {
    return res.send(JSON.stringify(books[isbn].reviews));
  } else {
    return res.send("Unable to find the ISBN");
  }
});

module.exports.general = public_users;
