import User from "../model/user";
import bcrypt from "bcrypt";

// Get All Users
export const getAllUser = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }

    if (!users) {
        return res.status(404).json({ message: "No user found" });
    }

    return res.status(200).json({ users });
};

// User Signup
export const signup = async (req, res, next) => {
    const { name, password, email } = req.body;

    let existing_user;
    try {
        existing_user = await User.findOne({ email });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err }); // Changed to proper error response
    }

    if (existing_user) {
        return res.status(400).json({ message: "User Already Exist, Login instead!" });
    }

    let hashedpassword = bcrypt.hashSync(password, 10);
    const user = new User({
        name,
        email,
        password: hashedpassword,
        blogs: []
    });

    try {
        await user.save();
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err }); // Changed to proper error response
    }

    return res.status(201).json({ user });
};

// User Login
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existing_user;
    try {
        existing_user = await User.findOne({ email });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err }); // Changed to proper error response
    }

    if (!existing_user) {
        return res.status(400).json({ message: "Couldn't find the user with the given email!" });
    }

    const ispassword = bcrypt.compareSync(password, existing_user.password);
    if (!ispassword) {
        return res.status(400).json({ message: "Password is incorrect" });
    }

    return res.status(200).json({ message: "Login Successful" });
};
