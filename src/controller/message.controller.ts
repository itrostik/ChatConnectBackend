import database from "../utils/database";
import { Request, Response } from "express";
import {
  getDoc,
  doc,
  setDoc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";

type Message = {
  id: string;
  sender_id: string;
  messageText: string;
  created: string;
  updated: boolean;
  imageUrl: string | null;
  read: boolean;
};

class MessageController {
  async createMessage(req: Request, res: Response) {
    const { newMessage, dialog_id } = req.body;
    const docRef = doc(database, "dialogs", dialog_id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const messagesList = [
          ...docSnap.data().messages,
          { ...newMessage, isLoading: false },
        ];
        await updateDoc(docRef, {
          messages: messagesList,
        });
        res.json({ newMessage });
      } else {
        res.status(404).json("Document not found");
      }
    } catch (error) {
      res.status(500).json(error);
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
    const { messageText, sender_id, dialog_id, message_id, imageUrl } =
      req.body;
    const docRef = doc(database, "dialogs", dialog_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const messages = docSnap.data().messages;
      messages.forEach((message: Message) => {
        if (message.id === message_id && message.sender_id === sender_id) {
          message.messageText = messageText;
          message.updated = true;
          message.imageUrl = imageUrl;
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

  async readMessage(req: Request, res: Response) {
    const { dialog_id, readMessages } = req.body;
    if (readMessages) {
      const docRef = doc(database, "dialogs", dialog_id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const messages = docSnap.data().messages;
        messages.forEach((message: Message) => {
          if (readMessages.includes(message.id)) {
            message.read = true;
          }
        });
        await updateDoc(docRef, {
          messages,
        });
      }
      res.json({
        data: dialog_id,
      });
    }
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
