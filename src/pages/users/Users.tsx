import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../db/config";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import useRoleProtection from "../../hooks/userRoleProtection";

interface User {
  id: string;
  name: string;
  email: string;
  role: "normal" | "admin" | "superadmin";
  createdAt: any; // Firestore Timestamp (seconds, nanoseconds)
}

export default function UserList() {
  const loading = useRoleProtection(["superadmin"]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const userData = doc.data() as Partial<User>;

        // Ensure defaults for missing fields
        return {
          id: doc.id,
          name: userData.name || "Unnamed User",
          email: userData.email || "unknown@example.com",
          role: (userData.role as User["role"]) || "normal",
          createdAt: userData.createdAt || null,
        } as User;
      });
      setUsers(data);
    });
    return () => unsub();
  }, [loading]);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      const userDoc = await getDoc(doc(db, "users", selectedId));
      const userData = userDoc.data() as User;

      if (userData.role === "superadmin") {
        setToast({ message: "Cannot delete Super Admin", type: "error" });
        return;
      }

      await deleteDoc(doc(db, "users", selectedId));
      setToast({ message: "User deleted successfully" });
    } catch {
      setToast({ message: "Error deleting user", type: "error" });
    } finally {
      setSelectedId(null);
    }
  };

  // Filter with safe checks for undefined fields
  const filtered = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <Modal
        isOpen={!!selectedId}
        onClose={() => setSelectedId(null)}
        title="Confirm Deletion"
        showFooter
        onConfirm={handleDelete}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>

      <div className="flex justify-between items-center mb-6">
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={() => navigate("/dashboard/add-users")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-4"
        >
          + Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition group"
              >
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 capitalize">{user.role}</td>
                <td className="p-4">
                  {user.createdAt?.seconds
                    ? new Date(
                        user.createdAt.seconds * 1000
                      ).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => setSelectedId(user.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
