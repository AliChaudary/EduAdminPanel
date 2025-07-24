import React, { useRef } from "react";
import { createReactEditorJS } from "react-editor-js";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";
import EditorJS from "@editorjs/editorjs";

type Props = {
  editorRef: React.MutableRefObject<EditorJS | null>;
};

const EDITOR_JS_TOOLS = {
  header: Header,
  paragraph: Paragraph,
  image: ImageTool,
};
const ReactEditorJS = createReactEditorJS();
const BlogEditor: React.FC<Props> = () => {
  const editorRef = useRef<EditorJS | null>(null);
  return (
    <div className="bg-gray-50 border p-4 rounded mb-6">
      <ReactEditorJS
        tools={EDITOR_JS_TOOLS}
        instanceRef={(instance: EditorJS) => (editorRef.current = instance)}
      />
    </div>
  );
};

export default BlogEditor;
