/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const Book = require("../models/book");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({})
        .then((books) => {
          res.send(books);
        })
        .catch((error) => {
          res.send({ error: error });
        });
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.send("missing required field title");
        return;
      }
      const book = new Book({ title: title });
      book
        .save()
        .then((newBook) => {
          if (!newBook) {
            res.send({ error: "could not create book" });
          } else {
            res.send(newBook);
          }
        })
        .catch((error) => {
          res.send({ error: error });
        });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({})
        .then(() => {
          res.send("complete delete successful");
        })
        .catch((error) => {
          res.send({ error: error });
        });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findOne({ _id: bookid })
        .then((book) => {
          if (!book) {
            res.send("no book exists");
          } else {
            res.json(book);
          }
        })
        .catch((error) => {
          res.send("no book exists");
        });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      Book.findOne({ _id: bookid })
        .then((book) => {
          if (!book) {
            res.send("no book exists");
          } else {
            if (!comment) {
              res.send("missing required field comment");
            } else {
              book.comments.push(comment);
              book.commentcount = book.commentcount + 1;
              book
                .save()
                .then((bookUpdated) => {
                  res.json(bookUpdated);
                })
                .catch((error) => {
                  res.send({ error: error });
                });
            }
          }
        })
        .catch((error) => {
          res.send({ error: error });
        });
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findOne({ _id: bookid })
        .then((book) => {
          if (!book) {
            res.send("no book exists");
          } else {
            Book.deleteOne({ _id: bookid })
              .then(() => {
                res.send("delete successful");
              })
              .catch((error) => {
                res.send({ error: error });
              });
          }
        })
        .catch((error) => {
          res.send({ error: error });
        });
    });
};
