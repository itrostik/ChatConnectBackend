import express, { Request, response, Response } from "express";
import usersRoute from "./routes/user.route";
import dialogsRoute from "./routes/dialog.route";
import messagesRoute from "./routes/message.route";
import cors from "cors";

import multer from "multer";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", usersRoute);
app.use("/api", dialogsRoute);
app.use("/api", messagesRoute);

const imgAPIKey = process.env.IMG_API_KEY;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req: Request, res: Response) => {
  res.redirect("/api");
});

app.post("/api/upload", upload.single("image"), async (req, res) => {
  const file = req.file;
  try {
    const imgBBResponse = await axios.post(
      "https://api.imgbb.com/1/upload",
      {
        image: file?.buffer.toString("base64"),
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          key: imgAPIKey,
        },
      },
    );
    const imageUrl = imgBBResponse.data.data.url;
    res.json({ imageUrl });
  } catch (e) {
    console.error(e);
  }
});

app.listen(4444, () => {
  console.log("SERVER OK");
});
