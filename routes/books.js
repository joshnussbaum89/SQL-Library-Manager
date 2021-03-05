const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require('sequelize');

/* Handler function to wrap each route. */
const asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}

// Home route
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

// Shows the full list of books (homepage)
router.get('/books/', asyncHandler(async (req, res) => {
  
  // Search for books
  let { search } = req.query;
  let books;

  if (search) {
    books = await Book.findAll({
      attributes: ['id', 'title', 'author', 'genre', 'year'],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${search}%`
            }
          },
          {
            author: {
              [Op.like]: `%${search}%`
            }
          },
          {
            genre: {
              [Op.like]: `%${search}%`
            }
          },
          {
            year: {
              [Op.like]: `%${search}%`
            }
          },

        ]
      }
    });
  } else {
    books = await Book.findAll({
      order: [
        [
          "createdAt",
          "ASC"
        ]
      ]
    });
  }

  // Check to see if there are results from search
  if (books.length < 1) {
    res.render('index', {
      books,
      title: 'Try another search...',
    });
  } else {
    res.render('index', {
      books,
      title: 'Library Application',
      id: books.id
    });
  }
}));

// 'Create new book' route 
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { title: 'New Book' });
}));

// Post a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("error", { error });
    } else {
      throw err;
    }
  }
}));

// Edit/update book route
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", {
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.year,
      id: book.id
    });
  } else {
    const error = new Error();
    error.message = "Whoops, page not found.";
    error.status = 404;
    throw error;
  }
}));

// Update book info in the database
router.post('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/books/');
}));

// Delete a book
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy(req.body);
  res.redirect('/books/');
}));

module.exports = router;
