import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../db/config";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import Loader from "../../components/Loader";

interface Blog {
  id: string;
  title: string;
  type: string;
  createdAt: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(true); // loader state
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "blogs"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Blog, "id">),
      }));
      setBlogs(data);
      setLoading(false); // stop loader after data is fetched
    });

    return () => unsub();
  }, []);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteDoc(doc(db, "blogs", selectedId));
      setToast({ message: "Blog deleted successfully" });
    } catch {
      setToast({ message: "Error deleting blog", type: "error" });
    } finally {
      setSelectedId(null);
    }
  };

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  // Loader screen
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-transparent">
        <Loader />
      </div>
    );
  }

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
        <p>Are you sure you want to delete this blog?</p>
      </Modal>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => navigate("/dashboard/add-blog")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Blog
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((blog) => (
                <tr
                  key={blog.id}
                  className="border-b hover:bg-gray-50 transition group"
                >
                  <td className="p-4">{blog.title}</td>
                  <td className="p-4">{blog.type}</td>
                  <td className="p-4">{blog.createdAt}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/edit-blog/${blog.id}`)
                        }
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setSelectedId(blog.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
