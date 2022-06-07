let jwt = require('jsonwebtoken');

// ------------------------------------------------------------------------------------------ //
// Authentication

const auth = async function (req, res, next) {
    try {
        const token = req.headers["indianarmy"]
        const secretKey = "kuchhBhi"

        if (!token) {
            res.status(400).send({ status: false, msg: "Please Provide Token" })
            return
        }

        const decodeToken = jwt.verify(token, secretKey)

        if (!decodeToken) {
            res.status(400).send({ status: false, msg: "Invalid Token" })
            return
        }
        req["userId"] = decodeToken.userId;
        req["roles"] = decodeToken.role;

        next()

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.Message })
    }
};

// ------------------------------------------------------------------------------------------- //
// Exporting it Publicly

module.exports.auth = auth;