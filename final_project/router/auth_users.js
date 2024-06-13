const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.body.username;
  const isbn = req.params.isbn;
  const review_text = req.body.review;

  if (isbn in books) {
    if(username in books[isbn].reviews) {
      books[isbn].reviews[username] = review_text;
    } else {
      books[isbn].reviews[username] = review_text;
    }
    return res.send("successfully saved your review");
  } else {
    return res.send("Unable to find the ISBN");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.body.username;
  const isbn = req.params.isbn;
  const review_text = req.body.review;

  if (isbn in books) {
    if(username in books[isbn].reviews) {
      delete books[isbn].reviews[username];
    } else {
      return res.send("Unable to fine your review");
    }
    return res.send("successfully deleted your review");
  } else {
    return res.send("Unable to find the ISBN");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
