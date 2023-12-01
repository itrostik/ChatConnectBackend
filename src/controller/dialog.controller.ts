import database from "../utils/database";
import { Request, Response } from "express";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

class DialogController {
  async createDialog(req: Request, res: Response) {
    const { user_id, user2_id } = req.body;
    const docRef = await addDoc(collection(database, "dialogs"), {
      user_id,
      user2_id,
      messages: [],
    });
    const docSnap = await getDoc(docRef);
    const dialog = {
      ...docSnap.data(),
      id: docRef.id,
    };
    res.json({
      dialog,
    });
  }

  async getDialogsByUserId(req: Request, res: Response) {
    const user_id = req.params.id;
    const q = query(
      collection(database, "dialogs"),
      where("user_id", "in", [user_id]),
      where("user2_id", "==", user_id),
    );
    const userSnapshot = await getDocs(q);
    console.log(userSnapshot);
    res.json(userSnapshot.size);
  }

  async getDialogs(req: Request, res: Response) {
    const dialogsList = await getDocs(collection(database, "dialogs"));
    const dialogs: DocumentData[] = [];
    dialogsList.forEach((dialog) => {
      dialogs.push(dialog.data());
    });
    if (dialogsList) {
      res.json({ data: dialogs });
    } else {
      console.log("No such document!");
    }
  }

  async getDialog(req: Request, res: Response) {
    const dialog_id = req.params.id;
    const dialogRef = doc(database, "dialogs", dialog_id);
    const docSnap = await getDoc(dialogRef);
    res.json({ ...docSnap.data() });
  }

  // Возможно будет добавление диалога в избранное, поэтому этот метод закомментирован

  // async updateDialog(req: Request, res: Response) {
  //   const {username, id} = req.body;
  //   const user = await database.query("update users set username = $1 where id = $2 returning *", [username, id])
  //   res.json(user.rows[0])
  // }

  async deleteDialog(req: Request, res: Response) {
    const dialog_id = req.params.id;
    try {
      await deleteDoc(doc(database, "dialogs", dialog_id));
      res.json({
        message: "Удаление прошло успешно",
      });
    } catch (e) {
      res.json({
        message: "Что-то пошло не так при удалении...",
      });
    }
  }
}

export default new DialogController();
