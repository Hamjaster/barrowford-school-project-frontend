import React, { useState, useRef, useEffect } from "react";
import Masonry from "react-masonry-css";
import { Upload, Download, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import {
  fetchStudentImages,
  uploadStudentImage,
  deleteStudentImage,
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

// Convert StudentImage to ImageItem for display
interface ImageItem {
  id: string;
  url: string;
  title: string;
  uploadDate: string;
}

const convertToImageItem = (studentImage: StudentImage): ImageItem => ({
  id: studentImage.id,
  url: studentImage.image_url,
  title: `Image ${studentImage.id}`,
  uploadDate: studentImage.created_at.split("T")[0],
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          );
        } else {
          toast.error(uploadResult.error || "Failed to upload image");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (imageId: string) => {
    const data = dispatch(deleteStudentImage(imageId));
    // wait for the delete function, then set the selected image to null
    data.then(() => {
      setSelectedImage(null);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
                onClick={triggerFileInput}
                disabled={isSubmitting}
                className="bg-white text-orange-500 hover:bg-orange-50 font-semibold shadow-lg cursor-pointer"
              >
                {isSubmitting ? <></> : <Upload className="w-4 h-4 mr-2" />}
                {isSubmitting ? "Uploading..." : "Upload Images"}
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
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading images...</p>
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
              onClick={triggerFileInput}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Upload Images"}
            </Button>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {images.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="relative mb-4 group cursor-pointer"
              >
                <div className="aspect-square overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                {/* Overlay on hover */}
              </div>
            ))}
          </Masonry>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedImage.title}
                    </h2>
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
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(selectedImage.id)}
                      disabled={isDeleting}
                      className="text-red-500 flex justify-center items-center hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
