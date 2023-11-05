import database from "../utils/database";
import {Request, Response} from "express";

class DialogController {
  async createDialog(req: Request, res: Response) {
    const {user_id, user2_id} = req.body;
    const newDialog = await database.query('insert into dialogs (user_id, user2_id) values ($1, $2) returning *', [user_id, user2_id])
    res.json(newDialog.rows[0])
  }

  async getDialogsByUserId(req: Request, res: Response) {
    const user_id = req.params.id
    const dialogs = await database.query("select * from dialogs where user_id = $1 OR user2_id = $1", [user_id])
    res.json(dialogs.rows)
  }

  async getDialogs(req: Request, res: Response) {
    const dialogs = await database.query("select * from dialogs")
    res.json(dialogs.rows)
  }

  async getDialog(req: Request, res: Response) {
    const dialog_id = req.params.id;
    const dialog = await database.query("select * from dialogs where id = $1", [dialog_id])
    res.json(dialog.rows[0])
  }


  // Возможно будет добавление диалога в избранное, поэтому этот метод закомментирован

  // async updateDialog(req: Request, res: Response) {
  //   const {username, id} = req.body;
  //   const user = await database.query("update users set username = $1 where id = $2 returning *", [username, id])
  //   res.json(user.rows[0])
  // }

  async deleteDialog(req: Request, res: Response) {
    const dialog_id = req.params.id;
    const dialog = await database.query("DELETE from dialogs where id = $1 returning *", [dialog_id])
    res.json(dialog.rows[0])
  }
}

export default new DialogController();