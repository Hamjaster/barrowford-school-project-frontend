import React, { useState, useRef, useEffect } from "react";
import Masonry from "react-masonry-css";
import {
  Upload,
  Download,
  Trash2,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import {
  fetchStudentImages,
  uploadStudentImage,
  deleteStudentImage,
  refreshStudentImages,
  clearError,
  clearMessage,
} from "@/store/slices/studentSlice";
import {
  validateFile,
  downloadImage,
  uploadFileToSupabase,
} from "@/utils/fileUpload";
import type { StudentImage } from "@/types";
import supabase from "@/lib/supabse";
import DeleteConfirmationDialog from "@/components/ui/DeleteConfirmationDialogProps";

// Convert StudentImage to ImageItem for display
interface ImageItem {
  id: string;
  url: string;
  title: string;
  uploadDate: string;
  status: "pending" | "approved" | "rejected" | "pending_deletion";
}

const convertToImageItem = (studentImage: StudentImage): ImageItem => ({
  id: studentImage.id,
  url: studentImage.image_url,
  title: `Image ${studentImage.id}`,
  uploadDate: studentImage.created_at.split("T")[0],
  status: studentImage.status,
});

export default function MyImages() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    images: studentImages,
    selectedYearGroup,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    message,
  } = useSelector((state: RootState) => state.student);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImageItem | null>(null);
  // Convert student images to display format
  const images = studentImages.map(convertToImageItem);

  // Fetch images on component mount and when year group changes
  useEffect(() => {
    dispatch(fetchStudentImages(selectedYearGroup?.id));
  }, [dispatch, selectedYearGroup]);

  // Handle error and message display
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [error, message, dispatch]);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      toast.error("Please select valid image files");
      return;
    }

    // Get user ID from Supabase auth (same as MyLearning.tsx)
    const userData = await supabase.auth.getUser();
    if (!userData.data.user?.id) {
      toast.error("User is not authenticated");
      return;
    }
    const userId = userData.data.user.id;

    for (const file of imageFiles) {
      // Validate file
      const validation = validateFile(file, 10, [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ]);
      if (!validation.isValid) {
        toast.error(validation.error);
        continue;
      }

      try {
        // Upload to Supabase
        const uploadResult = await uploadFileToSupabase(
          file,
          "barrowford-school-uploads",
          userId
        );
        console.log(uploadResult, "upload result here !!");

        if (uploadResult.success && uploadResult.url) {
          // Upload to backend API with year group ID
          dispatch(
            uploadStudentImage({
              imageUrl: uploadResult.url,
              yearGroupId: selectedYearGroup?.id,
            })
          )
            .unwrap()
            .then(() => {
              // Reset file input and close modal
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
              console.log("UPLOADED !");
              setIsUploadModalOpen(false);
            });
        } else {
          toast.error(uploadResult.error || "Failed to upload image");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
      }
    }
  };

  const handleDeleteClick = (image: ImageItem) => {
    setImageToDelete(image);
    setDeleteDialogOpen(true);
  };
  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;
    try {
      await dispatch(deleteStudentImage(imageToDelete.id)).unwrap();
      toast.success("Image deleted successfully!");
      setSelectedImage(null);
    } catch (error) {
      toast.error("Failed to delete image");
      console.error("Delete error:", error);
    } finally {
      setImageToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Helper function to get status styling and info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          overlayClass: "bg-yellow-500/20",
          icon: Clock,
          iconColor: "text-yellow-600",
          text: "Approval Pending",
          textColor: "text-yellow-700",
          blurClass: "blur-sm",
          borderClass: "border-yellow-300",
        };
      case "approved":
        return {
          overlayClass: "bg-green-500/10",
          icon: CheckCircle,
          iconColor: "text-green-600",
          text: "Approved",
          textColor: "text-green-700",
          blurClass: "",
          borderClass: "border-green-300",
        };
      case "rejected":
        return {
          overlayClass: "bg-red-500/20",
          icon: XCircle,
          iconColor: "text-red-600",
          text: "Rejected",
          textColor: "text-red-700",
          blurClass: "blur-sm",
          borderClass: "border-red-300",
        };
      case "pending_deletion":
        return {
          overlayClass: "bg-orange-500/20",
          icon: AlertTriangle,
          iconColor: "text-orange-600",
          text: "Deletion Pending",
          textColor: "text-orange-700",
          blurClass: "blur-sm",
          borderClass: "border-orange-300",
        };
      default:
        return {
          overlayClass: "",
          icon: CheckCircle,
          iconColor: "text-gray-600",
          text: "Unknown",
          textColor: "text-gray-700",
          blurClass: "",
          borderClass: "border-gray-300",
        };
    }
  };

  return (
    <div className="">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-b-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Images</h1>
              {selectedYearGroup && (
                <p className="text-orange-100 mt-1">
                  Showing images for {selectedYearGroup.name}
                </p>
              )}
            </div>

            <div>
              <Button
                onClick={openUploadModal}
                className="bg-white text-orange-500 hover:bg-orange-50 font-semibold shadow-lg cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Images
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Images Grid */}
      <div className="mt-6 px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-500 mr-4 mb-5">Loading images...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedYearGroup
                ? `No images for ${selectedYearGroup.name}`
                : "No images yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {selectedYearGroup
                ? `Upload images for ${selectedYearGroup.name} to get started`
                : "Upload your first image to get started"}
            </p>
            <Button
              onClick={openUploadModal}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Upload Images
            </Button>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {images.map((image) => {
              const statusInfo = getStatusInfo(image.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className="relative mb-4 group cursor-pointer"
                >
                  <div
                    className={`aspect-square overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 border-2 ${statusInfo.borderClass}`}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${statusInfo.blurClass}`}
                      loading="lazy"
                    />

                    {/* Status Overlay */}
                    <div
                      className={`absolute inset-0 ${statusInfo.overlayClass} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></div>

                    {/* Status Badge - Always visible */}
                    <div className="absolute top-2 right-2">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.textColor} bg-white/90 backdrop-blur-sm`}
                      >
                        <StatusIcon
                          className={`w-3 h-3 inline mr-1 ${statusInfo.iconColor}`}
                        />
                        {statusInfo.text}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Masonry>
        )}
      </div>

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Upload Images
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-gray-600 mb-4">
                Select images to upload to{" "}
                {selectedYearGroup?.name || "your year group"}
              </p>
              <Button
                onClick={triggerFileInput}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Images
                  </>
                )}
              </Button>
            </div>
            <div className="text-xs text-gray-500 text-center">
              Supported formats: JPEG, PNG, GIF, WebP (Max 10MB each)
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-5xl max-h-[90vh] p-0">
            <div className="relative">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedImage.title}
                      </h2>
                      {(() => {
                        const statusInfo = getStatusInfo(selectedImage.status);
                        const StatusIcon = statusInfo.icon;
                        return (
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.textColor} bg-white border ${statusInfo.borderClass}`}
                          >
                            <StatusIcon
                              className={`w-4 h-4 inline mr-1 ${statusInfo.iconColor}`}
                            />
                            {statusInfo.text}
                          </div>
                        );
                      })()}
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      Uploaded on{" "}
                      {new Date(selectedImage.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        downloadImage(
                          selectedImage.url,
                          selectedImage.title,
                          true
                        )
                      }
                      disabled={selectedImage.status === "rejected"}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(selectedImage)}
                      loading={isDeleting}
                      className="text-red-500 flex justify-center items-center hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteImage}
        title="Delete Image"
        description={
          imageToDelete
            ? `Are you sure you want to delete "${imageToDelete.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this image?"
        }
      />
    </div>
  );
}
