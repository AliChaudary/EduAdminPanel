import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../db/config";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import Editor from "../../components/Editor";

export default function AddBlog() {
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
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<EditorJS | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      const snapshot = await getDocs(collection(db, "blogTypes"));
      setTypes(snapshot.docs.map((doc) => doc.id));
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    console.log("Content", content);
  }, [content]);

  const handlePreview = async () => {
    if (!editor) return;
    const output = await editor.save();
    setContent(output);
    setPreviewOpen(true);
  };

  const handleSave = async () => {
    if (!title || !description || !type || content.blocks.length === 0) {
      setToast({ message: "Please fill all fields", type: "error" });
      return;
    }
    setLoading(true);
    try {
      if (type && !types.includes(type)) {
        await setDoc(doc(db, "blogTypes", type), {});
      }
      await addDoc(collection(db, "blogs"), {
        title,
        description,
        type,
        content,
        createdAt: new Date().toISOString(),
      });
      setToast({ message: "Blog added successfully" });
      setTimeout(() => navigate("/dashboard/blogs"), 1500);
    } catch {
      setToast({ message: "Failed to save blog", type: "error" });
    } finally {
      setLoading(false);
    }
  };

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
          {/* {content && <EditorJsRenderer data={content} />} */}
        </div>
      </Modal>

      <h1 className="text-2xl font-bold mb-4">Add Blog</h1>
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
          editorBlock={"editor-block"}
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
          disabled={loading}
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Blog"}
        </button>
      </div>
    </div>
  );
}
