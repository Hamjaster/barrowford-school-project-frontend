import * as React from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { cn } from "@/lib/utils";

export interface YoutubeNodeProps extends NodeViewProps {
  // Additional props can be added here if needed
}

export const YoutubeNode: React.FC<YoutubeNodeProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected,
}) => {
  const { src, width = 640, height = 480 } = node.attrs;
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  // Extract video ID from YouTube URL
  const getVideoId = (url: string): string | null => {
    if (!url) return null;

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  // Get embed URL from YouTube URL
  const getEmbedUrl = (url: string): string => {
    if (!url) return "";

    const videoId = getVideoId(url);
    if (!videoId) return url;

    return `https://www.youtube.com/embed/${videoId}`;
  };

  // Get thumbnail URL
  const getThumbnailUrl = (url: string): string => {
    const videoId = getVideoId(url);
    if (!videoId) return "";

    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const embedUrl = getEmbedUrl(src);
  const thumbnailUrl = getThumbnailUrl(src);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleDelete = () => {
    deleteNode();
  };

  if (!src || hasError) {
    return (
      <NodeViewWrapper
        className={cn(
          "youtube-node-wrapper",
          "relative",
          "border-2 border-dashed border-gray-300 dark:border-gray-600",
          "rounded-lg",
          "p-4",
          "text-center",
          selected && "ring-2 ring-blue-500 ring-offset-2"
        )}
      >
        <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📺</div>
          <p className="text-sm">
            {hasError ? "Failed to load YouTube video" : "Invalid YouTube URL"}
          </p>
          <button
            onClick={handleDelete}
            className="mt-2 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      className={cn(
        "youtube-node-wrapper",
        "relative",
        "group",
        selected && "ring-2 ring-blue-500 ring-offset-2"
      )}
    >
      <div
        className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
        style={{
          width: width || "100%",
          maxWidth: "100%",
          aspectRatio: `${width}/${height}`,
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading video...
              </p>
            </div>
          </div>
        )}

        <iframe
          src={embedUrl}
          width={width}
          height={height}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={handleLoad}
          onError={handleError}
          className={cn("w-full h-full", isLoading && "opacity-0")}
        />

        {/* Overlay controls that appear on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleDelete}
            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            title="Remove video"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Video info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-white text-sm truncate">YouTube Video</p>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default YoutubeNode;
