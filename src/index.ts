import express, {Request, Response} from "express";
import usersRoute from "./routes/user.route";

const app = express();

app.use(express.json());
app.use("/api", usersRoute);

app.get("/", (req: Request, res: Response) => {
  res.redirect("/api");
});

app.listen(4444, () => {
  console.log("SERVER OK")
});
