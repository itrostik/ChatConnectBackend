import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function checkPassword(password: string, hashPassword: string) {
  return bcrypt.compare(password, hashPassword);
}
