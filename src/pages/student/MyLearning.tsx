import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  FileText,
  ImageIcon,
  Video,
  File,
  X,
  Plus,
  PenTool,
  Calendar,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentLearnings,
  createStudentLearning,
  deleteStudentLearning,
  clearError,
  clearMessage,
} from "@/store/slices/studentSlice";
import type { RootState, AppDispatch } from "@/store";
import { toast } from "sonner";
import {
  uploadMultipleFilesToSupabase,
  validateFile,
  formatFileSize as utilFormatFileSize,
} from "@/utils/fileUpload";
import supabase from "@/lib/supabse";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
  uploadProgress?: number;
  isUploading?: boolean;
  uploadError?: string;
}

export default function StudentContentPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedSubject,
    learnings,
    isLoading,
    isSubmitting,
    error,
    message,
  } = useSelector((state: RootState) => state.student);

  const [isWritingModalOpen, setIsWritingModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Writing modal states
  const [writingTitle, setWritingTitle] = useState("");
  const [writingContent, setWritingContent] = useState("");

  // Upload modal states
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Fetch learnings when selected subject changes
  useEffect(() => {
    if (selectedSubject) {
      dispatch(fetchStudentLearnings(selectedSubject.id));
    }
  }, [dispatch, selectedSubject]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // show the success message when the learning is added, or deleted (since its sent for moderation)
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById(
      "modal-file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      // Validate file
      const validation = validateFile(file, 10); // 10MB max size
      if (!validation.isValid) {
        toast.error(validation.error || "Invalid file");
        return;
      }

      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        isUploading: false,
        uploadProgress: 0,
      };

      // Generate preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      setUploadedFiles((prev) => [...prev, newFile]);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
    if (type.startsWith("video/")) return <Video className="h-5 w-5" />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    return utilFormatFileSize(bytes);
  };

  const handleWritingSubmit = () => {
    if (!writingTitle || !writingContent || !selectedSubject) return;

    dispatch(
      createStudentLearning({
        subject_id: selectedSubject.id,
        title: writingTitle,
        content: writingContent,
      })
    );

    setWritingTitle("");
    setWritingContent("");
    setIsWritingModalOpen(false);
  };

  const handleUploadSubmit = async () => {
    if (!uploadTitle || uploadedFiles.length === 0 || !selectedSubject) return;

    try {
      // Mark files as uploading
      setUploadedFiles((prev) =>
        prev.map((file) => ({ ...file, isUploading: true, uploadProgress: 0 }))
      );

      // Convert File objects to actual File instances
      const fileInput = document.getElementById(
        "modal-file-upload"
      ) as HTMLInputElement;
      const files = Array.from(fileInput?.files || []);

      if (files.length === 0) {
        toast.error("No files selected");
        return;
      }
      const userData = await supabase.auth.getUser();
      if (!userData.data.user?.id) {
        toast.error("User is not authenticated");
        return;
      }
      // Upload files to Supabase
      const uploadResults = await uploadMultipleFilesToSupabase(
        files,
        "barrowford-school-uploads", // bucket name
        userData.data.user?.id, // folder path
        (fileIndex, progress) => {
          setUploadedFiles((prev) =>
            prev.map((file, index) =>
              index === fileIndex
                ? { ...file, uploadProgress: progress.percentage }
                : file
            )
          );
        }
      );

      // Check if all uploads were successful
      const successfulUploads = uploadResults.filter(
        (result) => result.success
      );
      const failedUploads = uploadResults.filter((result) => !result.success);

      if (failedUploads.length > 0) {
        toast.error(`${failedUploads.length} file(s) failed to upload`);

        return;
      }

      // Create learning with uploaded file URLs
      const fileUrls = successfulUploads.map((result) => result.url).join(", ");

      dispatch(
        createStudentLearning({
          subject_id: selectedSubject.id,
          title: uploadTitle,

          attachment_url: fileUrls, // Store URLs in attachment_url field
        })
      );

      setUploadTitle("");
      setUploadedFiles([]);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    }
  };

  const removeContentItem = (id: number) => {
    dispatch(deleteStudentLearning(id));
  };

  const getCardColors = (index: number) => {
    const colorSchemes = [
      {
        bg: "bg-pink-50",
        border: "border-pink-200",
        icon: "bg-pink-500",
        text: "text-pink-700",
      },
      {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "bg-blue-500",
        text: "text-blue-700",
      },
      {
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: "bg-orange-500",
        text: "text-orange-700",
      },
      {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "bg-green-500",
        text: "text-green-700",
      },
      {
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: "bg-purple-500",
        text: "text-purple-700",
      },
      {
        bg: "bg-cyan-50",
        border: "border-cyan-200",
        icon: "bg-cyan-500",
        text: "text-cyan-700",
      },
    ];
    return colorSchemes[index % colorSchemes.length];
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your learnings...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error loading learnings</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button onClick={() => dispatch(clearError())} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show no subject selected state
  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No Subject Selected
          </h2>
          <p className="text-gray-600 mb-4">
            Please select a subject from the sidebar to view your learnings.
          </p>
          <Button asChild>
            <a href="/">Go to Home</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      <div className="bg-green-500 text-white p-6 rounded-b-2xl">
        <h1 className="text-3xl font-bold">My Learning</h1>
        <p className="text-green-100 mt-2">Subject: {selectedSubject.name}</p>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Card className="border-2 border-dashed border-pink-300 hover:border-pink-400 transition-colors bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex justify-center gap-4">
                  <Dialog
                    open={isWritingModalOpen}
                    onOpenChange={setIsWritingModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                      >
                        <PenTool className="h-5 w-5" />
                        Write Something
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-pink-700">
                          Write Your Thoughts
                        </DialogTitle>
                        <DialogDescription>
                          Share your ideas, reflections, or anything on your
                          mind
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="writing-title"
                            className="text-gray-700 font-medium mb-2"
                          >
                            Title
                          </Label>
                          <Input
                            id="writing-title"
                            placeholder="What's this about?"
                            value={writingTitle}
                            onChange={(e) => setWritingTitle(e.target.value)}
                            className="border-pink-200 focus:border-pink-400"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="writing-content"
                            className="text-gray-700 font-medium mb-2"
                          >
                            Your thoughts
                          </Label>
                          <Textarea
                            id="writing-content"
                            placeholder="Write anything you want... your thoughts, discoveries, questions, or reflections"
                            value={writingContent}
                            onChange={(e) => setWritingContent(e.target.value)}
                            className="min-h-[200px] border-pink-200 focus:border-pink-400"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsWritingModalOpen(false)}
                            className="border-gray-300"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleWritingSubmit}
                            disabled={
                              !writingTitle || !writingContent || isSubmitting
                            }
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Adding...
                              </>
                            ) : (
                              "Add to Collection"
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={isUploadModalOpen}
                    onOpenChange={setIsUploadModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                      >
                        <Upload className="h-5 w-5" />
                        Upload Files
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-blue-700">
                          Upload Your Files
                        </DialogTitle>
                        <DialogDescription>
                          Share images, videos, documents, or any files you want
                          to keep
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="upload-title"
                            className="text-gray-700 font-medium mb-2"
                          >
                            Title
                          </Label>
                          <Input
                            id="upload-title"
                            placeholder="What are you uploading?"
                            value={uploadTitle}
                            onChange={(e) => setUploadTitle(e.target.value)}
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>

                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            isDragOver
                              ? "border-blue-400 bg-blue-50"
                              : "border-blue-300 hover:border-blue-400"
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <p className="font-medium text-gray-700 mb-1">
                            Drop files here or click to browse
                          </p>
                          <p className="text-sm text-gray-500">
                            Any file type supported
                          </p>
                          <Input
                            type="file"
                            multiple
                            onChange={handleFileInput}
                            className="hidden"
                            id="modal-file-upload"
                            accept="*/*"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer mt-2 border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                            onClick={triggerFileInput}
                          >
                            Choose Files
                          </Button>
                        </div>

                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {uploadedFiles.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center gap-3 p-2 bg-blue-50 rounded border border-blue-200"
                              >
                                {file.preview ? (
                                  <img
                                    src={file.preview || "/placeholder.svg"}
                                    alt={file.name}
                                    className="h-8 w-8 object-cover rounded"
                                  />
                                ) : (
                                  <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                                    {getFileIcon(file.type)}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate text-gray-700">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                  </p>
                                  {file.isUploading && (
                                    <div className="mt-1">
                                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div
                                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                          style={{
                                            width: `${
                                              file.uploadProgress || 0
                                            }%`,
                                          }}
                                        ></div>
                                      </div>
                                      <p className="text-xs text-blue-600 mt-1">
                                        Uploading... {file.uploadProgress || 0}%
                                      </p>
                                    </div>
                                  )}
                                  {file.uploadError && (
                                    <p className="text-xs text-red-600 mt-1">
                                      {file.uploadError}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(file.id)}
                                  disabled={file.isUploading}
                                  className="h-6 w-6 p-0 hover:bg-red-100 text-red-500 disabled:opacity-50"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsUploadModalOpen(false)}
                            className="border-gray-300"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleUploadSubmit}
                            disabled={
                              !uploadTitle ||
                              uploadedFiles.length === 0 ||
                              isSubmitting
                            }
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Adding...
                              </>
                            ) : (
                              "Add to Collection"
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-gray-600 mt-3 font-medium">
                  Click to add new content to your collection
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {learnings.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300">
              <CardContent className="pt-6 text-center">
                <div className="text-gray-500">
                  <Plus className="h-16 w-16 mx-auto mb-4 opacity-50 text-pink-400" />
                  <p className="text-xl font-medium mb-2 text-gray-700">
                    No learnings yet for {selectedSubject.name}
                  </p>
                  <p className="text-gray-600">
                    Start by writing something or uploading files above! 🚀
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learnings.map((learning, index) => {
                const colors = getCardColors(index);
                return (
                  <Card
                    key={learning.id}
                    className={`relative ${colors.bg} ${colors.border} border-2 hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`${colors.icon} rounded-full p-2 flex-shrink-0`}
                          >
                            <PenTool className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle
                              className={`text-lg font-bold ${colors.text} text-balance leading-tight`}
                            >
                              {learning.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="secondary"
                                className="bg-pink-100 text-pink-700 border-pink-200 text-xs font-medium"
                              >
                                ✍️ Learning
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContentItem(learning.id)}
                          disabled={isSubmitting}
                          className="h-7 w-7 p-0 hover:bg-red-100 text-red-400 hover:text-red-600 flex-shrink-0"
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <p
                          className={`${colors.text} leading-relaxed text-sm line-clamp-4`}
                        >
                          {learning.description}
                        </p>
                        {learning.attachment_url && (
                          <div className="mt-2 p-2 bg-white/60 rounded-lg border border-white/40">
                            <p className="text-xs font-medium text-gray-700 mb-1">
                              📎 Attachments:
                            </p>
                            <div className="space-y-1">
                              {learning.attachment_url
                                .split(",")
                                .map((url, index) => (
                                  <a
                                    key={index}
                                    href={url.trim()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 underline block truncate"
                                  >
                                    {url.trim().split("/").pop()}
                                  </a>
                                ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(learning.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
