import crypto from "crypto";

export function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    crypto.scrypt(password.normalize(), salt, 64, (err, hash) => {
      if (err) return reject(err);
      resolve(hash.toString("hex").normalize());
    });
  });
}

export function generateSalt() {
  return crypto.randomBytes(16).toString("hex").normalize();
}

export async function comparePasswords({
  hashedPassword,
  password,
  salt,
}: {
  hashedPassword: string;
  password: string;
  salt: string;
}) {
  const inputHashedPassword = await hashPassword(password, salt);
  // Using timingSafeEqual to prevent timing attacks 
  // what it does is it compares two buffers in a way that takes the same amount of time regardless of how similar the buffers are
  return crypto.timingSafeEqual(
    Buffer.from(hashedPassword, "hex"),
    Buffer.from(inputHashedPassword, "hex")
  );
}
