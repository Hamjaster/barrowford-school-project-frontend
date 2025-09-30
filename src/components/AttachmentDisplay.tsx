import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Eye, ExternalLink } from "lucide-react";
import { getFileInfo, type FileType } from "@/utils/attachmentUtils.tsx";

interface AttachmentDisplayProps {
  url: string;
  alt?: string;
  className?: string;
  showPreview?: boolean;
  maxHeight?: string;
  maxWidth?: string;
}

export default function AttachmentDisplay({
  url,
  alt = "Attachment",
  className = "",
  showPreview = true,
  maxHeight = "h-48",
  maxWidth = "max-w-full",
}: AttachmentDisplayProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!url) return null;

  const fileInfo = getFileInfo(url);
  useEffect(() => {
    console.log(url, fileInfo, "FILE INFO !! :)");
  }, [fileInfo]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileInfo.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    if (
      fileInfo.type === "image" ||
      fileInfo.type === "video" ||
      fileInfo.type === "pdf"
    ) {
      setIsPreviewOpen(true);
    } else {
      // For other file types, open in new tab
      window.open(url, "_blank");
    }
  };

  const renderPreview = () => {
    switch (fileInfo.type) {
      case "image":
        return (
          <img
            src={url}
            alt={alt}
            className={`${maxWidth} ${maxHeight} object-contain rounded-lg border`}
          />
        );
      case "video":
        return (
          <video
            src={url}
            controls
            className={`${maxWidth} ${maxHeight} object-contain rounded-lg border`}
          >
            Your browser does not support the video tag.
          </video>
        );
      case "pdf":
        return (
          <iframe
            src={url}
            className={`${maxWidth} ${maxHeight} rounded-lg border`}
            title={fileInfo.name}
          />
        );
      default:
        return (
          <div
            className={`${maxWidth} ${maxHeight} flex items-center justify-center bg-gray-100 rounded-lg border`}
          >
            <div className="text-center">
              {fileInfo.icon}
              <p className="mt-2 text-sm text-gray-600">{fileInfo.name}</p>
              <p className="text-xs text-gray-500">Click to download</p>
            </div>
          </div>
        );
    }
  };

  const renderInlineDisplay = () => {
    switch (fileInfo.type) {
      case "image":
        return (
          <div>
            <img
              src={url}
              alt={alt}
              className={`${maxWidth} ${maxHeight} object-cover rounded-lg border cursor-pointer`}
              onClick={handleView}
            />
          </div>
        );
      case "video":
        return (
          <video
            src={url}
            className={`${maxWidth} ${maxHeight} object-cover rounded-lg border cursor-pointer`}
            onClick={handleView}
          />
        );
      default:
        return (
          <div
            className={`${maxWidth} ${maxHeight} flex items-center justify-center bg-gray-100 rounded-lg border cursor-pointer hover:bg-gray-200 transition-colors`}
            onClick={handleView}
          >
            <div className="text-center flex items-center gap-1 my-3 flex-col justify-center">
              {fileInfo.icon}
              <p className="mt-2 text-sm text-gray-600 truncate max-w-32">
                {fileInfo.name}
              </p>
              <p className="text-xs text-gray-500">Click to open</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className={`${className}`}>{renderInlineDisplay()}</div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {fileInfo.icon}
              {fileInfo.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">{renderPreview()}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
