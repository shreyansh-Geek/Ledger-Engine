const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

/**
* - user register controller
* - POST /api/auth/register
*/
const userRegistrationController = async (req, res) => {
    const { email, password, name } = req.body;

    const isExists = await userModel.findOne({ email });

    if (isExists) {
        return res.status(422).json({
            message: "User already exists with email.",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email,
        password,
        name
    })
    
    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET_KEY)

    res.cookie("token", token)

    return res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })
}

/**
 * - User Login Controller
 * - POST /api/auth/login
  */
const userLoginController = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        return res.status(404).json({
            message: "User not found.",
            status: "failed"
        })
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid credentials.",
            status: "failed"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET_KEY)

    res.cookie("token", token)

    return res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })
}



module.exports = {
    userRegistrationController,
    userLoginController
}