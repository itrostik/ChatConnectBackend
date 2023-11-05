import Router from "express";
import dialogController from "../controller/dialog.controller";

// @ts-ignore
const dialogsRoute  = new Router();

dialogsRoute.get("/dialogs", dialogController.getDialogs);
dialogsRoute.get("/dialogs/:id", dialogController.getDialog);
dialogsRoute.get("/dialogs/user/:id", dialogController.getDialogsByUserId);
dialogsRoute.post("/dialogs", dialogController.createDialog);

// Возможно будет добавление диалога в избранное, поэтому этот метод закомментирован
// dialogsRoute.put("/dialogs", dialogController.updateDialog);

dialogsRoute.delete("/dialogs/:id", dialogController.deleteDialog);

export default dialogsRoute;