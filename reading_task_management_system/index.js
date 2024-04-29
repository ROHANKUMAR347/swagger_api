const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const userRouter = require("./router/user.route");
const { taskRouter } = require("./router/task.route");
//const { noteRouter } = require("./Routes/notes.router");
const app = express();
app.use(express.json());
require("dotenv").config();

const port = process.env.PORT || 8080;
const { connection } = require("./Config/db");
app.get("/", (req, res) => {
  res.status(201).send("This is the home page");
});
app.use("/users", userRouter);
app.use("/task", taskRouter);
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "welcome to swagger",
      version: "1.0.0",
    },
  },
  apis: ["./router/*.js"],
};

const openapiSpecification = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.listen(port, async () => {
  try {
    await connection;
    console.log("connected to db");
    console.log(`server is running at ${port}`);
  } catch (err) {
    console.log(err);
  }
});
