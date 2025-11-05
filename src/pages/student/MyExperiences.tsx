import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { ReadOnlyTipTap } from "@/components/ReadOnlyTipTap";
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
  Globe,
} from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentExperiences,
  createStudentExperience,
  deleteStudentExperience,
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
import { Link } from "react-router-dom";

// Helper function to extract text from TipTap JSON
const extractTextFromTiptapJSON = (node: any): string => {
  if (!node) return "";
  if (node.type === "text") return node.text || "";
  if (node.content && Array.isArray(node.content)) {
    return node.content.map(extractTextFromTiptapJSON).join("");
  }
  return "";
};

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

export default function MyExperiences() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    experiences,
    selectedYearGroupForExperiences,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    message,
  } = useSelector((state: RootState) => state.student);

  const [isWritingModalOpen, setIsWritingModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Writing modal states
  const [writingTitle, setWritingTitle] = useState("");
  const [writingContent, setWritingContent] = useState<any>(null);

  // Upload modal states
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [itemBeingDeleted, setItemBeingDeleted] = useState<number | null>(null);

  // View modal state
  const [selectedExperience, setSelectedExperience] = useState<any>(null);

  // Fetch experiences when selected year group changes
  useEffect(() => {
    if (selectedYearGroupForExperiences) {
      void (dispatch as any)(
        fetchStudentExperiences(selectedYearGroupForExperiences.id)
      );
    }
  }, [dispatch, selectedYearGroupForExperiences]);

  // Clear editor when modal closes
  useEffect(() => {
    if (!isWritingModalOpen) {
      setWritingContent(null);
    }
  }, [isWritingModalOpen]);

  // Handle content change from SimpleEditor
  const handleWritingContentChange = (content: any) => {
    setWritingContent(content);
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // show the success message when the experience is added, or deleted (since its sent for moderation)
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
    // Only take the first file if multiple are selected
    const file = files[0];

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

    // Replace any existing file with the new one (only one file allowed)
    setUploadedFiles([newFile]);
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
    if (!writingTitle || !writingContent || !selectedYearGroupForExperiences)
      return;

    // Stringify the TipTap JSON content
    const contentString = JSON.stringify(writingContent);

    void (dispatch as any)(
      createStudentExperience({
        experienceData: {
          title: writingTitle,
          content: contentString,
        },
        yearGroupId: selectedYearGroupForExperiences.id,
      })
    )
      .unwrap()
      .then(() => {
        setWritingTitle("");
        setWritingContent(null);
        setIsWritingModalOpen(false);
        if (selectedYearGroupForExperiences) {
          void (dispatch as any)(
            fetchStudentExperiences(selectedYearGroupForExperiences.id)
          );
        }
      })
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create experience";
        toast.error(errorMessage);
      });
  };

  const handleUploadSubmit = async () => {
    if (!uploadTitle || uploadedFiles.length === 0) return;

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
        toast.error("No file selected");
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
        toast.error("File failed to upload");
        return;
      }

      // Create experience with uploaded file URL
      const fileUrl = successfulUploads[0].url;

      if (!selectedYearGroupForExperiences) {
        toast.error("Please select a year group first");
        return;
      }

      void (dispatch as any)(
        createStudentExperience({
          experienceData: {
            title: uploadTitle,
            attachment_url: fileUrl, // Store URL in attachment_url field
          },
          yearGroupId: selectedYearGroupForExperiences.id,
        })
      )
        .unwrap()
        .then(() => {
          setUploadTitle("");
          setUploadedFiles([]);
          setIsUploadModalOpen(false);
          if (selectedYearGroupForExperiences) {
            void (dispatch as any)(
              fetchStudentExperiences(selectedYearGroupForExperiences.id)
            );
          }
        })
        .catch((error: unknown) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to create experience";
          toast.error(errorMessage);
        });
    } catch (error: unknown) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    }
  };

  const removeContentItem = (id: number) => {
    setItemBeingDeleted(id);
    void (dispatch as any)(deleteStudentExperience(id))
      .unwrap()
      .then(() => {
        if (selectedYearGroupForExperiences) {
          void (dispatch as any)(
            fetchStudentExperiences(selectedYearGroupForExperiences.id)
          );
        }
      })
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to delete experience";
        toast.error(errorMessage);
      });
  };

  const handleViewExperience = (experience: any) => {
    setSelectedExperience(experience);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedExperience(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs"
          >
            ⏳ Pending Review
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 border-green-200 text-xs"
          >
            ✅ Approved
          </Badge>
        );
      case "pending_deletion":
        return (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-700 border-red-200 text-xs"
          >
            🗑️ Pending Deletion
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-700 border-gray-200 text-xs"
          >
            ❌ Rejected
          </Badge>
        );
      default:
        return null;
    }
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

  // Show no year selected state
  if (!selectedYearGroupForExperiences) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No Year Group Selected
          </h2>
          <p className="text-gray-600 mb-4">
            Please select a year group from the sidebar to view your
            experiences.
          </p>
          <Button asChild>
            <Link to="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading your experiences...</p>
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
            <p className="font-bold">Error loading experiences</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button onClick={() => dispatch(clearError())} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-b-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Experiences</h1>
              <p className="text-orange-100 mt-1">
                {selectedYearGroupForExperiences?.name || "Select a year group"}
              </p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
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
                    <DialogContent className="!max-w-7xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-pink-700">
                          Write Your Experience
                        </DialogTitle>
                        <DialogDescription>
                          Share a meaningful experience you've had
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
                            placeholder="What was your experience?"
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
                            Description
                          </Label>
                          <SimpleEditor
                            key={isWritingModalOpen ? "open" : "closed"}
                            content={writingContent || ""}
                            onContentChange={handleWritingContentChange}
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
                              !writingTitle ||
                              !writingContent ||
                              !selectedYearGroupForExperiences
                            }
                            loading={isSubmitting}
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            {isSubmitting ? "Adding..." : "Add to Collection"}
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
                        Upload File
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl text-blue-700">
                          Upload Your Experience
                        </DialogTitle>
                        <DialogDescription>
                          Share one image, video, document, or any file
                          showcasing your experience
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
                            placeholder="What experience are you showcasing?"
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
                            Drop a file here or click to browse
                          </p>
                          <p className="text-sm text-gray-500">
                            One file only - any file type supported
                          </p>
                          <Input
                            type="file"
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
                            Choose File
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
                                  loading={file.isUploading}
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
                              !selectedYearGroupForExperiences
                            }
                            loading={isSubmitting}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            {isSubmitting ? "Adding..." : "Add to Collection"}
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
          {experiences.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300">
              <CardContent className="pt-6 text-center">
                <div className="text-gray-500">
                  <Plus className="h-16 w-16 mx-auto mb-4 opacity-50 text-pink-400" />
                  <p className="text-xl font-medium mb-2 text-gray-700">
                    No experiences yet for{" "}
                    {selectedYearGroupForExperiences?.name}
                  </p>
                  <p className="text-gray-600">
                    Start by writing something or uploading files above! 🚀
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((experience, index) => {
                const colors = getCardColors(index);
                return (
                  <Card
                    key={experience.id}
                    className={`relative ${colors.bg} ${
                      colors.border
                    } border-2 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer ${
                      experience.status === "rejected" ? "opacity-60" : ""
                    } ${
                      experience.status === "pending_deletion"
                        ? "opacity-75"
                        : ""
                    }`}
                    onClick={() => handleViewExperience(experience)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`${colors.icon} rounded-full p-2 flex-shrink-0`}
                          >
                            <Globe className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle
                              className={`text-lg font-bold ${colors.text} text-balance leading-tight`}
                            >
                              {experience.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge
                                variant="secondary"
                                className="bg-pink-100 text-pink-700 border-pink-200 text-xs font-medium flex-shrink-0"
                              >
                                🌍 Experience
                              </Badge>
                              <div className="flex-shrink-0">
                                {getStatusBadge(experience.status)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeContentItem(experience.id);
                          }}
                          disabled={
                            isSubmitting ||
                            experience.status === "pending_deletion" ||
                            experience.status === "rejected"
                          }
                          className="  h-7 w-7 p-0 hover:bg-red-100 text-red-400 hover:text-red-600 flex-shrink-0 disabled:opacity-50"
                        >
                          {isDeleting && itemBeingDeleted === experience.id ? (
                            <Spinner size="sm" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div
                          className={`${colors.text} leading-relaxed text-sm line-clamp-4`}
                        >
                          {(() => {
                            try {
                              // Try to parse as JSON (TipTap content)
                              const parsed =
                                typeof experience.description === "string"
                                  ? JSON.parse(experience.description)
                                  : experience.description;
                              // If it's a valid TipTap JSON object, render it
                              if (
                                parsed &&
                                typeof parsed === "object" &&
                                parsed.type
                              ) {
                                // For display, we'll show a simplified version
                                // You could use a read-only TipTap editor here if needed
                                const textContent =
                                  extractTextFromTiptapJSON(parsed);
                                return textContent || "No content";
                              }
                              // Otherwise, treat as plain text
                              return experience.description || "No description";
                            } catch {
                              // If parsing fails, treat as plain text
                              return experience.description || "No description";
                            }
                          })()}
                        </div>
                        {experience.attachment_url && (
                          <div className="mt-2 p-2 bg-white/60 rounded-lg border border-white/40">
                            <p className="text-xs font-medium text-gray-700 mb-1">
                              📎 Attachment:
                            </p>
                            <div className="space-y-1">
                              <a
                                href={experience.attachment_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 underline block truncate"
                              >
                                {experience.attachment_url.split("/").pop()}
                              </a>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(experience.created_at).toLocaleDateString()}
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

      {/* View Experience Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="!max-w-7xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-pink-700">
              {selectedExperience?.title || "Experience"}
            </DialogTitle>
            <DialogDescription>View your experience details</DialogDescription>
          </DialogHeader>
          {selectedExperience && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-700 font-medium mb-2">Title</Label>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-900 font-medium">
                    {selectedExperience.title}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Description
                </Label>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200 min-h-[200px]">
                  {(() => {
                    try {
                      // Try to parse as JSON (TipTap content)
                      const parsed =
                        typeof selectedExperience.description === "string"
                          ? JSON.parse(selectedExperience.description)
                          : selectedExperience.description;
                      // If it's a valid TipTap JSON object, use ReadOnlyTipTap
                      if (parsed && typeof parsed === "object" && parsed.type) {
                        return (
                          <div className="max-h-96 overflow-y-scroll">
                            <ReadOnlyTipTap
                              key="view-experience"
                              content={parsed}
                              className="p-4"
                            />
                          </div>
                        );
                      }
                      // Otherwise, treat as plain text
                      return (
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedExperience.description || "No description"}
                        </p>
                      );
                    } catch {
                      // If parsing fails, treat as plain text
                      return (
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedExperience.description || "No description"}
                        </p>
                      );
                    }
                  })()}
                </div>
              </div>
              {selectedExperience.attachment_url && (
                <div>
                  <Label className="text-gray-700 font-medium mb-2">
                    Attachment
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <a
                      href={selectedExperience.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FileText className="h-4 w-4" />
                      {selectedExperience.attachment_url.split("/").pop()}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  Created:{" "}
                  {new Date(selectedExperience.created_at).toLocaleDateString()}
                </span>
                <div className="ml-auto">
                  {getStatusBadge(selectedExperience.status)}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCloseViewModal}
                  className="border-gray-300"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
