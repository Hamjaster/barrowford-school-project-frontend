"use client";

import { useState } from "react";
import { Camera, ImageIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DEFAULT_AVATAR_URL } from "@/constants";
import FilterDropdown from "./FilterDropdown";

interface ImageItem {
  id: string;
  url: string;
  title: string;
  uploadDate: string;
  yearGroup: string;
}

interface PhotosTabProps {
  images: ImageItem[];
  yearGroups: any[];
  yearFilter: string;
  onYearFilterChange: (value: string) => void;
  isLoadingYearGroups: boolean;
}

// Color mapping for year groups
const yearColorMap: { [key: string]: string } = {
  default: "border-orange-300 shadow-orange-100",
  "year 1": "border-blue-300 shadow-blue-100",
  "year 2": "border-green-300 shadow-green-100",
  "year 3": "border-purple-300 shadow-purple-100",
  "year 4": "border-pink-300 shadow-pink-100",
  "year 5": "border-yellow-300 shadow-yellow-100",
  "year 6": "border-red-300 shadow-red-100",
};

const getYearColor = (yearGroup?: string) => {
  if (!yearGroup) return yearColorMap.default;
  const key = yearGroup.toLowerCase();
  return yearColorMap[key] || yearColorMap.default;
};

export default function PhotosTab({
  images,
  yearGroups,
  yearFilter,
  onYearFilterChange,
  isLoadingYearGroups,
}: PhotosTabProps) {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const filteredImages =
    yearFilter === "all"
      ? images
      : images.filter((image) => image.yearGroup === yearFilter);

  return (
    <>
      <div className="space-y-6">
        {/* Photos Filter */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Photos</h3>
          <FilterDropdown
            value={yearFilter}
            onValueChange={onYearFilterChange}
            options={yearGroups.map((year) => ({
              value: year.name,
              label: year.name,
            }))}
            placeholder="Filter by Year"
            isLoading={isLoadingYearGroups}
          />
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {images.length === 0
                ? "No Photos Yet"
                : "No Photos for Selected Year"}
            </h3>
            <p className="text-sm text-gray-500">
              {images.length === 0
                ? "Your child's photos will appear here."
                : "Try selecting a different year or 'All Years' to see more photos."}
            </p>
          </div>
        ) : (
          <div className="msnry">
            {filteredImages.map((image) => {
              const colorClass = getYearColor(image.yearGroup);

              return (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className="relative mb-4 group cursor-pointer"
                >
                  <div
                    className={`rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 border-2 ${colorClass}`}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_AVATAR_URL;
                      }}
                    />
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-md flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-white">
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">View Image</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
                src={selectedImage.url || "/placeholder.svg"}
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
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = selectedImage.url;
                        link.download = selectedImage.title;
                        link.target = "_blank";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
