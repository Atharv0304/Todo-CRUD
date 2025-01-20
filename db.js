const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://atharvsatghare:Pass%40123@cluster0.a5hao.mongodb.net/todos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const todo = mongoose.model("Todo", todoSchema);

module.exports = { todo };
