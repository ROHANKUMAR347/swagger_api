const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const taskmodel = mongoose.model("tasks", userSchema);
module.exports = {
  taskmodel,
};
