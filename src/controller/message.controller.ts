import database from "../utils/database";
import { Request, Response } from "express";
import { getDoc, doc, setDoc } from "firebase/firestore";

type Message = {
  id: string;
  sender_id: string;
  messageText: string;
  created: string;
  updated: boolean;
};

class MessageController {
  async createMessage(req: Request, res: Response) {
    const { dialog_id, sender_id, messageText } = req.body;
    const docRef = doc(database, "dialogs", dialog_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const messagesList = docSnap.data().messages;
      const message = {
        messageText,
        id: Math.random().toString(16).slice(2),
        sender_id,
        created: Date.now(),
        updated: false,
      };
      messagesList.push(message);
      await setDoc(docRef, {
        ...docSnap.data(),
        messages: messagesList,
      });
      res.json({ message });
    }
  }

  async getMessagesByDialogId(req: Request, res: Response) {
    const dialog_id = req.params.id;
    const docRef = doc(database, "dialogs", dialog_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const messages = docSnap.data().messages;
      res.json({ data: messages });
    }
  }

  async updateMessage(req: Request, res: Response) {
    const { messageText, sender_id, dialog_id, message_id } = req.body;
    const docRef = doc(database, "dialogs", dialog_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const messages = docSnap.data().messages;
      messages.forEach((message: Message) => {
        if (message.id === message_id && message.sender_id === sender_id) {
          message.messageText = messageText;
          message.updated = true;
        }
      });
      await setDoc(docRef, {
        ...docSnap.data(),
        messages,
      });
    }
    res.json({
      data: message_id,
    });
    // res.status(404).json({
    //   message: "такого сообщения не существует",
    // });
  }
  async deleteMessage(req: Request, res: Response) {
    const { message_id, dialog_id } = req.body;
    console.log(message_id, dialog_id);
    try {
      const docRef = doc(database, "dialogs", dialog_id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const messages = docSnap.data().messages;
        const newMessages = messages.filter(
          (message: Message) => message.id !== message_id,
        );
        await setDoc(docRef, {
          ...docSnap.data(),
          messages: newMessages,
        });
        res.json({
          message: "Удаление прошло успешно",
        });
      }
    } catch (e) {
      res.json({
        message: "Что-то пошло не так при удалении...",
      });
    }
  }
}

export default new MessageController();
