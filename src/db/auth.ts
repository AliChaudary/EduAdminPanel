import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config";

/**
 * Log in user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
