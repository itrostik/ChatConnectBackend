import Router from "express";
import messageController from "../controller/message.controller";

// @ts-ignore
const messagesRoute = new Router();

messagesRoute.get(
  "/messages/dialog/:id",
  messageController.getMessagesByDialogId,
);
messagesRoute.post("/messages", messageController.createMessage);
messagesRoute.put("/messages", messageController.updateMessage);
messagesRoute.patch("/messages", messageController.readMessage);
messagesRoute.delete("/messages", messageController.deleteMessage);

export default messagesRoute;
