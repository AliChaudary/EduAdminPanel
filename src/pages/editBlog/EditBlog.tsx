import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "../../db/config";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import Editor from "../../components/Editor";
import Loader from "../../components/Loader";

export default function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [editor, setEditor] = useState<EditorJS | null>(null);
  const [types, setTypes] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [content, setContent] = useState<any>({
    time: Date.now(),
    blocks: [],
    version: "2.26.5",
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(true); // show loader until data loads
  const [saving, setSaving] = useState(false);

  const editorRef = useRef<EditorJS | null>(null);

  // Fetch blog types
  useEffect(() => {
    const fetchTypes = async () => {
      const snapshot = await getDocs(collection(db, "blogTypes"));
      setTypes(snapshot.docs.map((doc) => doc.id));
    };
    fetchTypes();
  }, []);

  // Fetch blog by ID
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      try {
        const blogRef = doc(db, "blogs", id);
        const snapshot = await getDoc(blogRef);
        if (snapshot.exists()) {
          const blog = snapshot.data();
          setTitle(blog.title || "");
          setDescription(blog.description || "");
          setType(blog.type || "");
          setContent(
            blog.content || {
              time: Date.now(),
              blocks: [],
              version: "2.26.5",
            }
          );
        } else {
          setToast({ message: "Blog not found", type: "error" });
          setTimeout(() => navigate("/blogs"), 1500);
        }
      } catch (err) {
        console.error(err);
        setToast({ message: "Failed to load blog", type: "error" });
      } finally {
        setLoading(false); // stop loader
      }
    };
    fetchBlog();
  }, [id, navigate]);

  const handlePreview = async () => {
    if (!editor) return;
    const output = await editor.save();
    setContent(output);
    setPreviewOpen(true);
  };

  const handleUpdate = async () => {
    if (!title || !description || !type || content.blocks.length === 0) {
      setToast({ message: "Please fill all fields", type: "error" });
      return;
    }

    setSaving(true);
    try {
      if (type && !types.includes(type)) {
        await setDoc(doc(db, "blogTypes", type), {});
      }
      await updateDoc(doc(db, "blogs", id!), {
        title,
        description,
        type,
        content,
        updatedAt: new Date().toISOString(),
      });
      setToast({ message: "Blog updated successfully" });
      setTimeout(() => navigate("/dashboard/blog"), 1500);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to update blog", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-transparent">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Blog Preview"
      >
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </Modal>

      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      <input
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded mb-3"
      />
      <textarea
        placeholder="Short Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border rounded mb-3"
      />
      <input
        list="types"
        placeholder="Select or type new type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full p-3 border rounded mb-3"
      />
      <datalist id="types">
        {types.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>

      <div className="bg-white w-full p-4 rounded shadow-md">
        <Editor
          data={content}
          onChange={setContent}
          editorBlock={"edit-editor-block"}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        {/* <button
          onClick={handlePreview}
          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Preview
        </button> */}
        <button
          disabled={saving}
          onClick={handleUpdate}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Blog"}
        </button>
      </div>
    </div>
  );
}
