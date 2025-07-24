import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../db/config";

export default function CreateUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateUser = async () => {
    if (!email || !password) {
      setMessage("Please fill all fields.");
      return;
    }

    setLoading(true);
    const auth = getAuth();

    // Save the superadmin's session so we can log back in later
    const superAdmin = auth.currentUser;
    const superAdminEmail = superAdmin?.email;
    const superAdminPass = prompt(
      "Enter your Super Admin password to re-login after creating the user:"
    );

    try {
      // Create the new user (this will log in as the new user automatically)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;

      // Save user details in Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        email,
        role,
        createdAt: new Date().toISOString(),
      });

      setMessage(`User ${email} created successfully as ${role}`);

      // Log back in as Super Admin
      if (superAdminEmail && superAdminPass) {
        await signInWithEmailAndPassword(auth, superAdminEmail, superAdminPass);
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Create New User</h1>

      {message && (
        <div className="mb-3 p-2 text-sm text-white bg-blue-500 rounded">
          {message}
        </div>
      )}

      <input
        type="email"
        placeholder="User Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border rounded mb-3"
      />
      <input
        type="password"
        placeholder="User Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border rounded mb-3"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      >
        <option value="user">Normal User</option>
        <option value="admin">Admin</option>
        <option value="superadmin">Super Admin</option>
      </select>

      <button
        disabled={loading}
        onClick={handleCreateUser}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Creating..." : "Create User"}
      </button>
    </div>
  );
}
