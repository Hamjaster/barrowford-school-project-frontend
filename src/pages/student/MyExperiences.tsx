import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
  fetchStudentExperience,
  updateStudentExperience,
  clearError,
  clearMessage,
} from "@/store/slices/studentSlice";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MyExperiences() {
  const dispatch = useDispatch<AppDispatch>();
  const { experience, isLoading, isSubmitting, error, message } = useSelector(
    (state: RootState) => state.student
  );

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
            text: "Tell us about your experiences...",
          },
        ],
      },
    ],
  });

  // Load experience data on component mount
  useEffect(() => {
    dispatch(fetchStudentExperience());
  }, [dispatch]);

  // Update editor content when experience data is loaded
  useEffect(() => {
    if (experience && experience.content) {
      try {
        const parsedContent = JSON.parse(experience.content);
        setEditorContent(parsedContent);
      } catch (error) {
        console.error("Error parsing experience content:", error);
        // If parsing fails, keep the default content
      }
    }
  }, [experience]);

  // Handle success/error messages
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [message, error, dispatch]);

  const handleContentChange = (newContent: any) => {
    setEditorContent(newContent);
  };

  const handleSave = () => {
    const contentString = JSON.stringify(editorContent);
    dispatch(updateStudentExperience({ content: contentString }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="bg-purple-500 text-white p-6 rounded-b-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Experiences</h1>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-white text-purple-500 hover:bg-gray-100"
          >
            {isSubmitting ? "Saving..." : "Save Experiences"}
          </Button>
        </div>
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
