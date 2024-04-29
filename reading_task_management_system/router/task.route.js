const express = require("express");
const { taskmodel } = require("../model/task.model");
const { auth } = require("../middlewere/auth.middlewere");
const taskRouter = express.Router();

const checkAccess = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).send({ error: "Access denied" });
    }
    next();
  };
};

taskRouter.post("/", auth, checkAccess("admin"), async (req, res) => {
  try {
    const newTask = new taskmodel(req.body);
    await newTask.save();
    res.status(201).send({ message: "Task added successfully", newTask });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
taskRouter.get("/", auth, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "admin") {
      tasks = await taskmodel.find();
    } else {
      tasks = await taskmodel.find({ userId: userId });
    }
    res.status(200).send({ tasks });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

taskRouter.delete("/:id", auth, checkAccess("admin"), async (req, res) => {
  try {
    const taskId = req.params.id;
    const deletedTask = await taskmodel.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.status(200).send({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
module.exports = {
  taskRouter,
};
