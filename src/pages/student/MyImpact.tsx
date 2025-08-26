import { useState } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function MyImpact() {
  // Initialize with empty content or provide default content
  const [editorContent, setEditorContent] = useState<any>({
    type: "doc",
    content: [
      {
        type: "paragraph",
        attrs: {
          textAlign: null,
        },
        content: [
          {
            type: "text",
            text: "Start writing your impact story...",
          },
        ],
      },
    ],
  });

  const handleContentChange = (newContent: any) => {
    setEditorContent(newContent);
    // You can also save to localStorage, send to API, etc.
    console.log("Content updated:", newContent);
  };

  return (
    <div className="">
      <div className="bg-cyan-500 text-white p-6 rounded-b-2xl">
        <h1 className="text-3xl font-bold">My Impact</h1>
      </div>
      <div className="mt-4">
        <SimpleEditor
          content={editorContent}
          onContentChange={handleContentChange}
        />
      </div>
    </div>
  );
}
