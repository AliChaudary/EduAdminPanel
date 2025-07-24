import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Header from "@editorjs/header";
import Image from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import AttachesTool from "@editorjs/attaches";
import LinkTool from "@editorjs/link";
import Warning from "@editorjs/warning";
// import alertTool from "@editorjs/alert";
import CheckList from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import ImageTool from "@editorjs/image";
import { storage } from "../db/config";

export const EDITOR_JS_TOOLS = {
  header: {
    class: Header as any,
    inlineToolbar: true,
    config: {
      placeholder: "Enter a header",
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  paragraph: {
    class: Paragraph as any,
    inlineToolbar: true,
  },
  image: {
    class: ImageTool as any,
    // config: {
    //   captionPlaceholder: "Add a caption",
    //   buttonContent: "Select an image",
    //   uploader: {
    //     uploadByFile: async (file: File) => {
    //       const storageRef = ref(
    //         storage,
    //         `blog-images/${Date.now()}-${file.name}`
    //       );
    //       await uploadBytes(storageRef, file);
    //       const url = await getDownloadURL(storageRef);

    //       return {
    //         success: 1,
    //         file: { url },
    //       };
    //     },
    //   },
    // },
  },
  list: {
    class: List as any,
    inlineToolbar: true,
  },
  checklist: {
    class: CheckList as any,
    inlineToolbar: true,
  },
  quote: {
    class: Quote as any,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote author",
    },
  },
  warning: {
    class: Warning as any,
    inlineToolbar: false,
    config: {
      titlePlaceholder: "Warning title",
      messagePlaceholder: "Warning message",
    },
  },
  linkTool: {
    class: LinkTool as any,
    config: {
      endpoint: "/api/fetchUrlData",
    },
  },
  attaches: {
    class: AttachesTool as any,
    config: {
      endpoint: "/api/uploadFile",
    },
  },
} as any;
