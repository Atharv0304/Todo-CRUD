const express = require("express");
const cors = require("cors");
const { createTodo, updateTodo } = require("./types");
const { todo } = require("./db");
const app = express();

app.use(express.json());
app.use(cors());

// Create a new to-do
app.post("/todo", async function (req, res) {
    const createPayload = req.body;
    const parsePayload = createTodo.safeParse(createPayload);

    if (!parsePayload.success) {
        res.status(400).json({
            msg: "Invalid input",
            errors: parsePayload.error.errors,
        });
        return;
    }

    try {
        const newTodo = await todo.create({
            title: createPayload.title,
            description: createPayload.description,
            completed: false,
        });
        res.status(201).json({
            msg: "Todo created successfully",
            todo: newTodo,
        });
    } catch (error) {
        res.status(500).json({ msg: "Failed to create todo", error });
    }
});

// Get all to-dos
app.get("/todos", async function (req, res) {
    try {
        const todos = await todo.find({});
        res.json({ todos });
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch todos", error });
    }
});

// Update a to-do task
app.put("/todo/:id", async function (req, res) {
    const { id } = req.params;
    const updatePayload = req.body;

    const parsePayload = updateTodo.safeParse({ id });

    if (!parsePayload.success) {
        res.status(400).json({
            msg: "Invalid input",
            errors: parsePayload.error.errors,
        });
        return;
    }

    try {
        const updatedTodo = await todo.findByIdAndUpdate(id, updatePayload, {
            new: true, // Return the updated document
            runValidators: true, // Ensure updates are validated against the schema
        });

        if (!updatedTodo) {
            res.status(404).json({ msg: "Todo not found" });
            return;
        }

        res.json({
            msg: "Todo updated successfully",
            todo: updatedTodo,
        });
    } catch (error) {
        res.status(500).json({ msg: "Failed to update todo", error });
    }
});

// Delete a to-do
app.delete("/todo/:id", async function (req, res) {
    const { id } = req.params;

    try {
        const deletedTodo = await todo.findByIdAndDelete(id);

        if (!deletedTodo) {
            res.status(404).json({ msg: "Todo not found" });
            return;
        }

        res.json({ msg: "Todo deleted successfully", todo: deletedTodo });
    } catch (error) {
        res.status(500).json({ msg: "Failed to delete todo", error });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
