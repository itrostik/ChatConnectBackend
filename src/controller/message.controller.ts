import database from "../utils/database";
import { Request, Response } from "express";
import { addDoc, collection, getDoc, doc, setDoc } from "firebase/firestore";

class MessageController {
  async createMessage(req: Request, res: Response) {
    const { dialog_id, sender_id, recipient_id, messageText } = req.body;
    const docRef = doc(database, "dialogs", dialog_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const messagesList = docSnap.data().messages;
      messagesList.push(messageText);
      const messageSnap = await setDoc(docRef, {
        sender_id,
        recipient_id,
        messages: messagesList,
      });
      const docSnapBuf = await getDoc(docRef);
      const dialog = {
        ...docSnapBuf.data(),
        id: docRef.id,
      };
      res.json({
        dialog,
      });
    }
  }

  async getMessagesByUserId(req: Request, res: Response) {
    const sender_id = req.params.id;
    const messages = await database.query(
      "select * from messages where sender_id = $1",
      [sender_id],
    );
    res.json(messages.rows);
  }

  async getMessagesByDialogId(req: Request, res: Response) {
    const dialog_id = req.params.id;
    const messages = await database.query(
      "select * from messages where dialog_id = $1",
      [dialog_id],
    );
    res.json(messages.rows);
  }

  async getMessages(_req: Request, res: Response) {
    const messages = await database.query("select * from messages");
    res.json(messages.rows);
  }

  async getMessage(req: Request, res: Response) {
    const message_id = req.params.id;
    const message = await database.query(
      "select * from messages where id = $1",
      [message_id],
    );
    res.json(message.rows[0]);
  }

  async updateMessage(req: Request, res: Response) {
    const { textMessage, id } = req.body;
    const message = await database.query(
      "update messages set text_message = $1 where id = $2 returning *",
      [textMessage, id],
    );
    res.json(message.rows[0]);
  }

  async deleteMessage(req: Request, res: Response) {
    const message_id = req.params.id;
    const message = await database.query(
      "DELETE from messages where id = $1 returning *",
      [message_id],
    );
    res.json(message.rows[0]);
  }
}

export default new MessageController();
