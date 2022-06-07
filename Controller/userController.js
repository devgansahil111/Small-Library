const userModel = require("../Model/userModel");
const jwt = require("jsonwebtoken");

// --------------------------------------------------------------------------------------------- //
// Validation Format

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
};

// -------------------------------------------------------------------------------------------- //
// Create User

const createUser = async function (req, res) {
    try {
        let data = req.body;
        // Destructuring
        let { name, email, password, roles } = data;

        if (Object.keys(data).length == 0) {
            res.status(400).send({ status: false, msg: "BAD REQUEST" })
            return
        }
        if (!isValid(name)) {
            res.status(400).send({ status: false, msg: "Name is mandatory" })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "Email is mandatory" })
            return
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            res.status(400).send({ status: false, msg: "Invalid Email" })
            return
        }

        let isEmailAlreadyExist = await userModel.findOne({ email: email })

        if (isEmailAlreadyExist) {
            res.status(409).send({ status: false, msg: "This Email is Already Exists" })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: 'PassWord Is Required' })
            return
        }
        if (password.length < 6 || password.length > 15) {
            res.status(400).send({ status: false, msg: "Password length must be beetween 6 to 15 Characters" })
            return
        }
        if (!Array.isArray(roles)) {
            res.status(400).send({ status: false, msg: 'Invalid Role Choosen' })
            return
        } else {
            let createdUser = await userModel.create(data)
            res.status(201).send({ msg: "User Created Successfully", data: createdUser })
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message });
    }
};

// ----------------------------------------------------------------------------------------------- //
// Login User

const loginUser = async function (req, res) {
    try {
        
        let body = req.body;

        let { email, password } = body;

        if (Object.keys(body).length === 0) {
            res.status(400).send({ status: false, msg: "Invalid Input" })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "Email is required" })
            return
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            res.status(400).send({ status: false, msg: "Please Enter a Valid Email" })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "PassWord Is Required" })
            return
        }
        if (password.length < 6 || password.length > 15) {
            res.status(400).send({ status: false, msg: "Password length must be beetween 6 to 15 Character" })
            return
        }

        let isUserExist = await userModel.findOne({ email: email, password: password })
        if (!isUserExist) {
            res.status(404).send({ status: false, msg: "User Not Found Please Check Credentials" })
            return
        }

        let payload = {
            userId: isUserExist._id,
            role: isUserExist.roles
        }

        let secretKey = 'kuchhBhi'

        let token = jwt.sign(payload, secretKey, { expiresIn: '30m' })
        res.status(201).send({ msg: 'Login SuccessFull', body: token })
        return
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
};

// ------------------------------------------------------------------------------------------------ //
// Exporting it Publicly

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;