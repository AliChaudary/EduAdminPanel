import { memo, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "./Tools";
import { cloudinaryUploader } from "../imagesCloud/imageUploade";

const Editor = ({
  data,
  onChange,
  editorBlock,
}: {
  data: any;
  onChange: (data: any) => void;
  editorBlock: string;
}) => {
  const ref = useRef<EditorJS | null>(null);

  useEffect(() => {
    const initEditor = () => {
      if (!ref.current && document.getElementById(editorBlock)) {
        const editor = new EditorJS({
          holder: editorBlock,
          data: data,
          tools: {
            ...EDITOR_JS_TOOLS,
            image: {
              class: EDITOR_JS_TOOLS.image.class,
              config: {
                uploader: {
                  uploadByFile: (file: File) =>
                    cloudinaryUploader.uploadByFile(
                      file,
                      editor.blocks.getCurrentBlockIndex().toString()
                    ),
                },
              },
            },
          },
          async onChange(api) {
            const saved = await api.saver.save();
            onChange(saved);
          },
        });
        ref.current = editor;
      } else if (ref.current && data) {
        // If editor exists, just render data
        ref.current.render(data);
      }
    };

    // Delay slightly to ensure DOM exists
    setTimeout(initEditor, 50);

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
        ref.current = null;
      }
    };
  }, [editorBlock]); // Only initialize when mounting

  return <div id={editorBlock} className="min-h-[300px]" />; // Ensure it's always rendered
};

export default memo(Editor);
