import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
  fetchStudentImpact,
  updateStudentImpact,
  clearError,
  clearMessage,
} from "@/store/slices/studentSlice";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MyImpact() {
  const dispatch = useDispatch<AppDispatch>();
  const { impact, isLoading, isSubmitting, error, message } = useSelector(
    (state: RootState) => state.student
  );

  // Initialize with empty content or provide default content
  const [editorContent, setEditorContent] = useState<null | any>(null);

  // Load impact data on component mount
  useEffect(() => {
    dispatch(fetchStudentImpact());
  }, [dispatch]);

  // Update editor content when impact data is loaded
  useEffect(() => {
    console.log("impact", impact);
    if (impact && impact.content) {
      try {
        const parsedContent = JSON.parse(impact.content);
        console.log("parsedContent setting to :--", parsedContent);
        setEditorContent(parsedContent);
      } catch (error) {
        console.error("Error parsing impact content:", error);
        // If parsing fails, keep the default content
      }
    }
  }, [impact]);

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
    dispatch(updateStudentImpact({ content: contentString }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your impact...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="bg-cyan-500 text-white p-6 rounded-b-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Impact</h1>
          <Button
            onClick={handleSave}
            loading={isSubmitting}
            className="bg-white text-cyan-500 hover:bg-gray-100"
          >
            Save Impact
          </Button>
        </div>
      </div>
      <div className="mt-4">
        {/* I want to re-redner it when ever editorContent changes */}
        {editorContent && (
          <SimpleEditor
            key={editorContent.id}
            content={editorContent}
            onContentChange={handleContentChange}
          />
        )}
      </div>
    </div>
  );
}
