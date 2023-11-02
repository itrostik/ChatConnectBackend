import database from "../utils/database";
import {Request, Response} from "express";

class UserController {
  async createUser(req: Request, res: Response) {
    const {username} = req.body;
    const newUser = await database.query('insert into users (username) values ($1) returning *', [username])
    res.json(newUser.rows[0])
  }

  async getUsers(req: Request, res: Response) {
    const users = await database.query("select * from users")
    res.json(users.rows)
  }

  async getUser(req: Request, res: Response) {
    const user_id = req.params.id;
    const user = await database.query("select * from users where id = $1", [user_id])
    res.json(user.rows[0])
  }

  async updateUser(req: Request, res: Response) {
    const {username, id} = req.body;
    const user = await database.query("update users set username = $1 where id = $2 returning *", [username, id])
    res.json(user.rows[0])
  }

  async deleteUser(req: Request, res: Response) {
    const user_id = req.params.id;
    const user = await database.query("DELETE from users where id = $1", [user_id])
    res.json(user.rows[0])
  }
}

export default new UserController();
