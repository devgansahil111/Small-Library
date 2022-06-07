const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const bookController = require("../Controller/bookController");
const { auth } = require("../Middleware/midd");

// ------------------------------------------------------------------------------------------- //
// API's

router.post('/user', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/books', auth, bookController.createBook);
router.get('/books', auth, bookController.getBooks);

// ------------------------------------------------------------------------------------------- //
// Exporting it Publicly

module.exports = router;