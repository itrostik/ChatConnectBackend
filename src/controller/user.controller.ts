import database from "../utils/database";
import { Request, Response } from "express";
import { checkPassword, hashPassword } from "../utils/password.hash";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { getToken } from "../utils/jwt";

class UserController {
  async createUser(req: Request, res: Response) {
    const { firstName, lastName, username, login, password, avatarUrl } =
      req.body;
    const q = query(collection(database, "users"), where("login", "==", login));
    const userSnapshot = await getDocs(q);
    if (userSnapshot.empty) {
      const passwordHash = await hashPassword(password);
      try {
        const docRef = await addDoc(collection(database, "users"), {
          firstName,
          lastName,
          username,
          login,
          passwordHash,
          avatarUrl,
        });
        const docSnap = await getDoc(docRef);
        const user = {
          ...docSnap.data(),
          id: docRef.id,
        };
        const token = getToken(user);
        res.json({
          token,
        });
      } catch (error) {
        res.status(400).json({
          message: "Произошла ошибка при регистрации",
        });
      }
    } else {
      res.status(400).json({
        message: "Такой пользователь уже есть в системе",
      });
    }
  }

  async getUsers(req: Request, res: Response) {
    const userList = await getDocs(collection(database, "users"));
    const users: DocumentData[] = [];
    userList.forEach((user) => {
      users.push({ ...user.data(), id: user.id });
    });
    if (userList) {
      res.json(users);
    } else {
      console.log("No such document!");
    }
  }

  async getUser(req: Request, res: Response) {
    const user_id = req.params.id;
    const userRef = doc(database, "users", user_id);
    const docSnap = await getDoc(userRef);
    res.json({ ...docSnap.data() });
  }

  async updateUser(req: Request, res: Response) {
    const { firstName, lastName, username, login, password, id } = req.body;
    const passwordHash = await hashPassword(password);
    const userRef = doc(database, "users", id);
    await setDoc(userRef, {
      firstName,
      lastName,
      username,
      login,
      passwordHash,
      id,
    });
    const docSnap = await getDoc(userRef);
    res.json({
      ...docSnap.data(),
    });
  }
  async deleteUser(req: Request, res: Response) {
    const user_id = req.params.id;
    try {
      await deleteDoc(doc(database, "users", user_id));
      res.json({
        message: "Удаление прошло успешно",
      });
    } catch (e) {
      res.json({
        message: "Что-то пошло не так при удалении...",
      });
    }
  }

  async checkUser(req: Request, res: Response) {
    const { login, password } = req.body;
    try {
      const q = query(
        collection(database, "users"),
        where("login", "==", login),
      );
      const userSnapshot = await getDocs(q);
      if (userSnapshot.empty) {
        res.json({
          message: "неверный логин или пароль",
        });
      } else {
        userSnapshot.forEach(async (doc) => {
          const user = doc.data();
          if (await checkPassword(password, user.passwordHash)) {
            const token = getToken(user);
            res.json({
              token,
            });
          } else {
            res.status(400).json({
              message: "неверный логин или пароль",
            });
          }
        });
      }
    } catch (err) {
      res.status(400).json({
        message: "неверный логин или пароль",
      });
    }
  }
}

export default new UserController();
