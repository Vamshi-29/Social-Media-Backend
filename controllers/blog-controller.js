import mongoose from "mongoose";
import User from "../model/user";
import blog from "../model/blog"; // Corrected import

// Get All Blogs
export const getallblogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await blog.find();
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }

    if (!blogs || blogs.length === 0) {
        return res.status(404).json({ message: "No blogs found" });
    }

    return res.status(200).json({ blogs });
};

// Add New Blog
export const addblog = async (req, res, next) => {
    const { title, description, image, user: userId } = req.body;

    let existing_user;
    try {
        existing_user = await User.findById(userId);
    } catch (err) {
        return next(err);
    }

    if (!existing_user) {
        return res.status(400).json({ message: "User doesn't exist" });
    }

    const newBlog = new blog({
        title,
        description,
        image,
        user: userId 
    });

    const session = await mongoose.startSession(); // Removed duplicate declaration

    try {
        session.startTransaction();
        await newBlog.save({ session });
        existing_user.blogs.push(newBlog._id); // Corrected field name
        await existing_user.save({ session });
        await session.commitTransaction();
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }

    return res.status(201).json({ blog: newBlog });
};

// Update Blog
export const update = async (req, res, next) => {
    const blogid = req.params.id;
    const { title, description } = req.body;

    let blogup;
    try {
        blogup = await blog.findByIdAndUpdate(blogid, { // Corrected model usage
            title,
            description
        }, { new: true });
    } catch (err) {
        console.log("Error:", err); // Log the error for debugging
        return next(err);
    }

    if (!blogup) {
        return res.status(500).json({ message: "Invalid ID" });
    }

    return res.status(200).json({ blogup });
};

// Get Blog by ID
export const getbyid = async (req, res, next) => {
    const id = req.params.id;
    let blogfindid;

    try {
        blogfindid = await blog.findById(id);
    } catch (err) {
        return next(err);
    }

    if (!blogfindid) {
        return res.status(404).json({ message: "Can't find specified ID!!" });
    }

    return res.status(200).json({ blog: blogfindid });
};

// Delete Blog by ID
export const deletebyid = async (req, res, next) => {
    const id = req.params.id;
    let blogfindid;

    try {
        blogfindid = await blog.findByIdAndDelete(id).populate("user"); // Correctly use populate

        if (!blogfindid) {
            return res.status(404).json({ message: "Can't find the specified ID" });
        }

        await blogfindid.user.blogs.pull(blogfindid); // Remove blog from user's blogs array
        await blogfindid.user.save(); // Save the updated user document
    } catch (err) {
        return next(err);
    }

    return res.status(200).json({ message: "Success" });
};

export const getuserbyid = async (req, res, next) => {
    const uid = req.params.id;
    let ublocks;

    try {
        ublocks = await User.findById(uid).populate("blogs");
    } catch (err) {
        return res.status(500).json({ message: "Fetching user failed!", error: err.message });
    }

    if (!ublocks) {
        return res.status(404).json({ message: "No user found" });
    }

    return res.status(200).json({ blogs: ublocks.blogs });
};

