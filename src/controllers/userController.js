const userModel = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SECRET_KEY;


const signUp = async (req, res) => {

    const { userName, password, email } = req.body;
    try {
        const existingUser = await userModel.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const result = await userModel.create({
            email: email,
            password: hashPassword,
            userName: userName
        });

        const jwtToken = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY)
        res.status(201).json({ user: result, token: jwtToken });


    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }

}


const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ email: email })
        if (!existingUser) {
            return res.status(404).json({ message: "User Not Found!" })
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password)

        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        const jwtToken = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET_KEY)
        res.status(200).json({ user: existingUser, token: jwtToken });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
}

module.exports = { signUp, signIn };