import Router from "express";
import userController from "../controller/user.controller";

// @ts-ignore
const usersRoute = new Router();

usersRoute.get("/users", userController.getUsers);
usersRoute.get("/users/:id", userController.getUser);
usersRoute.post("/users", userController.createUser);
usersRoute.put("/users", userController.updateUser);
usersRoute.delete("/users/:id", userController.deleteUser);
usersRoute.post("/users/check", userController.checkUser);

export default usersRoute;
