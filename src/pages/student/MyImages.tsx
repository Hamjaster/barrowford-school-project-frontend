import React, { useState, useRef } from "react";
import Masonry from "react-masonry-css";
import { Upload, X, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ImageItem {
  id: string;
  url: string;
  title: string;
  uploadDate: string;
}

// Mock data for demonstration
const mockImages: ImageItem[] = [
  {
    id: "1",
    url: "https://picsum.photos/300/400?random=1",
    title: "Art Project - Landscape Painting",
    uploadDate: "2024-01-15",
  },
  {
    id: "2",
    url: "https://picsum.photos/300/500?random=2",
    title: "Science Fair Display",
    uploadDate: "2024-01-14",
  },
  {
    id: "3",
    url: "https://picsum.photos/300/350?random=3",
    title: "My Garden Project",
    uploadDate: "2024-01-13",
  },
  {
    id: "4",
    url: "https://picsum.photos/300/450?random=4",
    title: "Math Competition Certificate",
    uploadDate: "2024-01-12",
  },
  {
    id: "5",
    url: "https://picsum.photos/300/300?random=5",
    title: "Sports Day Victory",
    uploadDate: "2024-01-11",
  },
  {
    id: "6",
    url: "https://picsum.photos/300/550?random=6",
    title: "Class Performance",
    uploadDate: "2024-01-10",
  },
  {
    id: "7",
    url: "https://picsum.photos/300/550?random=7",
    title: "Class Performance",
    uploadDate: "2024-01-10",
  },
  {
    id: "8",
    url: "https://picsum.photos/300/550?random=8",
    title: "Class Performance",
    uploadDate: "2024-01-10",
  },
  {
    id: "9",
    url: "https://picsum.photos/300/550?random=9",
    title: "Class Performance",
    uploadDate: "2024-01-10",
  },
  {
    id: "10",
    url: "https://picsum.photos/300/550?random=10",
    title: "Class Performance",
    uploadDate: "2024-01-10",
  },
  {
    id: "11",
    url: "https://picsum.photos/300/550?random=11",
    title: "Class Performance",
    uploadDate: "2024-01-10",
  },
];

export default function MyImages() {
  const [images, setImages] = useState<ImageItem[]>(mockImages);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: ImageItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string,
            title: file.name.replace(/\.[^/.]+$/, ""),
            uploadDate: new Date().toISOString().split("T")[0],
          };
          setImages((prev) => [newImage, ...prev]);
        };
        reader.readAsDataURL(file);
      }
    });

    setIsUploading(false);
    toast.success("Images uploaded successfully!");

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    setSelectedImage(null);
    toast.success("Image deleted successfully!");
  };

  const handleDownload = (image: ImageItem) => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.title || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <h1 className="text-3xl font-bold">My Images</h1>

            <div>
              <Button
                onClick={triggerFileInput}
                disabled={isUploading}
                className="bg-white text-orange-500 hover:bg-orange-50 font-semibold shadow-lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Images"}
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
        {images.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No images yet
            </h3>
            <p className="text-gray-500 mb-6">
              Upload your first image to get started
            </p>
            <Button
              onClick={triggerFileInput}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
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
                onClick={() => setSelectedImage(image)}
                className="relative mb-4"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-auto object-cover  transition-transform duration-300 cursor-pointer"
                  loading="lazy"
                />
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
                      onClick={() => handleDownload(selectedImage)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(selectedImage.id)}
                      className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
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
