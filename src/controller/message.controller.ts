import database from "../utils/database";
import { Request, Response } from "express";
import { getDoc, doc, setDoc } from "firebase/firestore";

type Message = {
  id: string;
  sender_id: string;
  messageText: string;
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
      };
      messagesList.push(message);
      const messageSnap = await setDoc(docRef, {
        ...docSnap.data(),
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
    const { messageText, dialog_id, message_id } = req.body;
    const docRef = doc(database, "dialogs", dialog_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const messages = docSnap.data().messages;
      messages.forEach((message: Message) => {
        if (message.id === message_id) {
          message.messageText = messageText;
        }
      });
      await setDoc(docRef, {
        ...docSnap.data(),
        messages,
      });
    }
    const newDocSnap = await getDoc(docRef);
    res.json({
      ...newDocSnap.data(),
    });
  }
  async deleteMessage(req: Request, res: Response) {
    const { message_id, dialog_id } = req.body;
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
