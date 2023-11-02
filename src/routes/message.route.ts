import Router from "express";
import messageController from "../controller/message.controller";

// @ts-ignore
const messagesRoute  = new Router();

messagesRoute.get("/messages", messageController.getMessages);
messagesRoute.get("/messages/:id", messageController.getMessage);
messagesRoute.get("/messages/user/:id", messageController.getMessagesByUserId);
messagesRoute.get("/messages/dialog/:id", messageController.getMessagesByDialogId);
messagesRoute.post("/messages", messageController.createMessage);
messagesRoute.put("/messages", messageController.updateMessage);
messagesRoute.delete("/messages/:id", messageController.deleteMessage);

export default messagesRoute;