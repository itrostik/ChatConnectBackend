import express, {Request, Response} from "express";
import usersRoute from "./routes/user.route";
import dialogsRoute from "./routes/dialog.route";
import messagesRoute from "./routes/message.route";

const app = express();
app.use(express.json());

app.use("/api", usersRoute);
app.use("/api", dialogsRoute)
app.use("/api", messagesRoute)

app.get("/", (req: Request, res: Response) => {
  res.redirect("/api");
});

app.listen(4444, () => {
  console.log("SERVER OK")
});
