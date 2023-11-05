import database from "../utils/database";
import { Request, Response } from "express";
import { checkPassword, hashPassword } from "../utils/password.hash";
class UserController {
  async createUser(req: Request, res: Response) {
    const { firstName, lastName, username, login, password } = req.body;
    const user = await database.query("select * from users where login = $1", [
      login,
    ]);
    if (!user.rows[0]) {
      const passwordHash = await hashPassword(password);
      const newUser = await database.query(
        "insert into users (first_name, last_name, username, login, password_hash) values ($1, $2, $3, $4, $5) returning *",
        [firstName, lastName, username, login, passwordHash],
      );
      res.json({
        ...newUser.rows[0],
        password,
      });
    } else {
      res.json({
        message: "Такой пользователь уже есть в системе",
      });
    }
  }

  async getUsers(req: Request, res: Response) {
    const users = await database.query("select * from users");
    res.json(users.rows);
  }

  async getUser(req: Request, res: Response) {
    const user_id = req.params.id;
    const user = await database.query("select * from users where id = $1", [
      user_id,
    ]);
    res.json(user.rows[0]);
  }

  async updateUser(req: Request, res: Response) {
    const { firstName, lastName, username, login, password, id } = req.body;
    const userLogin = await database.query(
      "select * from users where login = $1",
      [login],
    );
    if (!userLogin.rows[0]) {
      const passwordHash = await hashPassword(password);
      const user = await database.query(
        "update users set first_name = $1, last_name = $2, username = $3, login = $4, password_hash = $5 where id = $6 returning *",
        [firstName, lastName, username, login, passwordHash, id],
      );
      res.json({
        ...user.rows[0],
        password,
      });
    } else {
      res.json({
        message: "такой логин уже занят",
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const user_id = req.params.id;
    const user = await database.query(
      "DELETE from users where id = $1 returning *",
      [user_id],
    );
    res.json(user.rows[0]);
  }

  async checkUser(req: Request, res: Response) {
    const { login, password } = req.body;
    try{
      const user = await database.query("select * from users where login = $1", [
        login,
      ]);
      const userPasswordHash = user.rows[0]["password_hash"];
      if (await checkPassword(password, userPasswordHash)) {
        res.json({
          ...user.rows[0],
          password,
        });
      } else {
        res.json({
          message: "неверный логин или пароль",
        });
      }
    }
    catch (err) {
      res.json({
        message: "неверный логин или пароль",
      })
    }
  }
}

export default new UserController();
