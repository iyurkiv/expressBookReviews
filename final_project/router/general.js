const express = require('express');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// promise code
function getBooks(){
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

function getBookByISBN(isbn){
  return new Promise((resolve, reject) => {
    resolve(books[isbn]);
  });
}

function getBookByAuthor(author){
  return new Promise((resolve, reject) => {
    const result = (Object.values(books)).filter((book) => book.author == author)
    resolve(result);
  });
}

function getBookByTitle(title){
  return new Promise((resolve, reject) => {
    const result = (Object.values(books)).filter((book) => book.title == title)
    resolve(result);
  });
}



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
public_users.get('/', function (req, res) {
  // res.send(JSON.stringify(books,null,1));

  getBooks().then((sucessMessage) => {
    res.send(JSON.stringify(sucessMessage,null,1));
  });

});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  // return res.send(books[isbn]);
  getBookByISBN(isbn).then((sucessMessage) => {
    res.send(JSON.stringify(sucessMessage,null,1));
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  // const result = (Object.values(books)).filter((book) => book.author == author);
  // return res.send(JSON.stringify(result,null,1));


  // promise rewrite
  getBookByAuthor(author).then((sucessMessage) => {
    res.send(JSON.stringify(sucessMessage,null,1));
  });


});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  // const result = (Object.values(books)).filter((book) => book.title == title);

  // return res.send(JSON.stringify(result,null,1));

  // promise rewrite
  getBookByTitle(title).then((sucessMessage) => {
    res.send(JSON.stringify(sucessMessage,null,1));
  });

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

//  Get book review
public_users.get('/users',function (req, res) {
  //Write your code here
  return res.status(300).json({message: JSON.stringify(users,null,1)});
});

module.exports.general = public_users;
