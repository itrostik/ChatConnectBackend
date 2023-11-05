import database from "../utils/database";
import {Request, Response} from "express";

class MessageController {
  async createMessage(req: Request, res: Response) {
    const {dialog_id, sender_id, recipient_id, messageText} = req.body;
    const newMessage = await database.query('insert into messages (dialog_id, sender_id, recipient_id, text_message) values ($1, $2, $3, $4) returning *', [dialog_id, sender_id, recipient_id, messageText])
    res.json(newMessage.rows[0])
  }

  async getMessagesByUserId(req: Request, res: Response) {
    const sender_id = req.params.id
    const messages = await database.query("select * from messages where sender_id = $1", [sender_id])
    res.json(messages.rows)
  }

  async getMessagesByDialogId(req: Request, res: Response) {
    const dialog_id = req.params.id
    const messages = await database.query("select * from messages where dialog_id = $1", [dialog_id])
    res.json(messages.rows)
  }
  async getMessages(_req: Request, res: Response) {
    const messages = await database.query("select * from messages")
    res.json(messages.rows)
  }

  async getMessage(req: Request, res: Response) {
    const message_id = req.params.id;
    const message = await database.query("select * from messages where id = $1", [message_id])
    res.json(message.rows[0])
  }

  async updateMessage(req: Request, res: Response) {
    const {textMessage, id} = req.body;
    const message = await database.query("update messages set text_message = $1 where id = $2 returning *", [textMessage, id])
    res.json(message.rows[0])
  }

  async deleteMessage(req: Request, res: Response) {
    const message_id = req.params.id;
    const message = await database.query("DELETE from messages where id = $1 returning *", [message_id])
    res.json(message.rows[0])
  }
}

export default new MessageController();