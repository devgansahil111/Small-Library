const mongoose = require("mongoose");
const bookModel = require("../Model/bookModel");
const ObjectId = mongoose.Schema.Types.ObjectId;

// ---------------------------------------------------------------------------------------------- //
// Validation Format

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
};

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

// ---------------------------------------------------------------------------------------------- //
// Create Book

const createBook = async function (req, res) {
    try {

        let { title, ISBN, category, userId } = req.body;

        if (Object.keys(req.body).length === 0) {
            res.status(400).send({ status: false, msg: "Invalid Input" })
            return
        }
        if (!isValid(userId)) {
            res.status(400).send({ status: false, msg: "Please Enter User ID" })
            return
        }
        if (!isValidObjectId(userId)) {
            res.status(400).send({ status: false, msg: "Invalid UserId" })
            return
        }

        //  --- Authorisation --- //

        if (userId != req['userId']) {
            res.status(401).send({ status: false, msg: "Unauthorised Access" })
            return
        }
        if (!req['roles'].includes('Creator')) {
            res.status(403).send({ status: false, msg: "Your Role IS Not Suitable For Create A Book" })
            return
        }
        if (!isValid(title)) {
            res.status(400).send({ status: false, msg: "Please Enter Title" })
            return
        }
        if (!isValid(ISBN)) {
            res.status(400).send({ status: false, msg: "Please Enter ISBN" })
            return
        }
        if (!Array.isArray(category)) {
            res.status(400).send({ status: false, msg: "Please Enter a Valid Category" })
            return
        }
        let validData = { title, ISBN, category, userId }

        let CreatedBook = await bookModel.create(validData)
        res.status(201).send({ msg: "New Book is Created", data: CreatedBook })
        return

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
};

// ------------------------------------------------------------------------------------------- //
// Get Data

const getBooks = async function (req, res) {
    try {
        let filterObj = {}

        if (req["roles"].indexOf('Viewer') != -1) {

            let userId = req['userId']
            filterObj['author'] = userId

            if (req.query.hasOwnProperty('old')) {
                filterObj['createdAt'] = { $lt: Date.now() - 10 * 60 * 60 }
            }
            if (req.query.hasOwnProperty('new')) {
                filterObj['createdAt'] = { $gt: Date.now() - 10 * 60 * 60 }
            }

            let booksFromUser = await bookModel.find(filterObj)
            res.status(200).send({ message: `List Of Books`, Data: booksFromUser })
            return
        }
        if (req["roles"].indexOf("View_All") != -1) {
            let booksFromUser = await bookModel.find()
            res.status(200).send({ msg: "List Of Books", data: booksFromUser })
            return
        }
        else {
            res.status(403).send({ msg: "Your role is not Suitable for view The Books" })
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
};

// ------------------------------------------------------------------------------------------ //
// Exporting it publicly

module.exports.createBook = createBook;
module.exports.getBooks = getBooks;