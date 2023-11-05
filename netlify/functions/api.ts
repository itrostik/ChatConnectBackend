import express from "express";
import usersRoute from "../../src/routes/user.route";
import dialogsRoute from "../../src/routes/dialog.route";
import messagesRoute from "../../src/routes/message.route";
import serverless from "serverless-http";

import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", usersRoute);
app.use("/api/", dialogsRoute)
app.use("/api/", messagesRoute)

export const handler = serverless(app);