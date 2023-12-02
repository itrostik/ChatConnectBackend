import jwt from "jsonwebtoken";

export function getToken(user: object): string {
  return jwt.sign(user, "userToken", { expiresIn: "30d" });
}
