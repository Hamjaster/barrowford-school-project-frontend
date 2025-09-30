import { ImageIcon, Video, FileText, File, Download, Eye } from "lucide-react";

export type FileType = "image" | "video" | "pdf" | "document" | "other";

export interface FileInfo {
  type: FileType;
  extension: string;
  name: string;
  icon: React.ReactNode;
}

/**
 * Determines the file type based on the file extension
 */
export function getFileTypeFromUrl(url: string): FileType {
  if (!url) return "other";

  const extension = getFileExtension(url).toLowerCase();

  // Image extensions
  if (
    ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"].includes(
      extension
    )
  ) {
    return "image";
  }

  // Video extensions
  if (
    ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv", "m4v"].includes(
      extension
    )
  ) {
    return "video";
  }

  // PDF
  if (extension === "pdf") {
    return "pdf";
  }

  // Document extensions
  if (["doc", "docx", "txt", "rtf", "odt", "pages"].includes(extension)) {
    return "document";
  }

  return "other";
}

/**
 * Extracts file extension from URL
 */
export function getFileExtension(url: string): string {
  if (!url) return "";

  // Remove query parameters and hash
  const cleanUrl = url.split("?")[0].split("#")[0];

  // Get the last part after the last dot
  const parts = cleanUrl.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

/**
 * Extracts filename from URL
 */
export function getFileNameFromUrl(url: string): string {
  if (!url) return "Unknown file";

  // Remove query parameters and hash
  const cleanUrl = url.split("?")[0].split("#")[0];

  // Get the last part after the last slash
  const parts = cleanUrl.split("/");
  return parts[parts.length - 1] || "Unknown file";
}

/**
 * Gets appropriate icon for file type
 */
export function getFileIcon(type: FileType): React.ReactNode {
  switch (type) {
    case "image":
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    case "video":
      return <Video className="h-5 w-5 text-purple-500" />;
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />;
    case "document":
      return <FileText className="h-5 w-5 text-green-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
}

/**
 * Gets file info from URL
 */
export function getFileInfo(url: string): FileInfo {
  const type = getFileTypeFromUrl(url);
  const extension = getFileExtension(url);
  const name = getFileNameFromUrl(url);
  const icon = getFileIcon(type);

  return {
    type,
    extension,
    name,
    icon,
  };
}

/**
 * Formats file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
