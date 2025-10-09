"use client";

import * as React from "react";
import type { Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Tiptap UI ---
import type { UseYoutubeConfig } from "./use-youtube";
import { useYoutube } from "./use-youtube";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";

// --- Shadcn Components ---
import { Button as ShadcnButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { YoutubeIcon } from "@/components/tiptap-icons/youtube-icon";

export interface YoutubeButtonProps
  extends Omit<ButtonProps, "type">,
    UseYoutubeConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string;
  onInsert: (
    editor: Editor,
    url: string,
    width: string,
    height: string
  ) => void;
}

/**
 * YouTube modal content component
 */
const YoutubeModal: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (
    editor: Editor,
    url: string,
    width: string,
    height: string
  ) => void;
  editor: Editor | null;
}> = ({ isOpen, onOpenChange, onInsert, editor }) => {
  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Clear error when URL changes
  // React.useEffect(() => {
  //   if (error && url) {
  //     setError(null);
  //   }
  // }, [url, error]);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setUrl("");
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Insert YouTube Video</DialogTitle>
        <DialogDescription>
          Enter a YouTube URL to embed the video in your content.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Input
            id="youtube-url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={error ? "border-red-500" : ""}
            autoFocus
            disabled={isLoading}
          />
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p className="mb-1">Supported formats:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
            <li>https://youtu.be/VIDEO_ID</li>
            <li>youtube.com/watch?v=VIDEO_ID</li>
          </ul>
        </div>
      </div>

      <DialogFooter>
        <ShadcnButton
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          Cancel
        </ShadcnButton>
        <ShadcnButton
          type="button"
          onClick={() => {
            try {
              onInsert(editor, url, "640", "360");
              onOpenChange(false);
            } catch (error) {
              console.log(error);
            }
          }}
          disabled={!url.trim() || isLoading}
        >
          {isLoading ? "Inserting..." : "Insert Video"}
        </ShadcnButton>
      </DialogFooter>
    </DialogContent>
  );
};

/**
 * YouTube button component for Tiptap editors.
 *
 * For custom button implementations, use the `useYoutube` hook instead.
 */
export const YoutubeButton = React.forwardRef<
  HTMLButtonElement,
  YoutubeButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onInserted,
      onClick,
      children,
      onInsert,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = React.useState(false);

    const handleInsert = React.useCallback(
      (editor: Editor, url: string, width: string, height: string) => {
        onInsert(editor, url, width, height);
      },
      [onInsert]
    );

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setIsOpen(true);
      },
      [onClick]
    );

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            data-style="ghost"
            data-active-state="off"
            role="button"
            tabIndex={-1}
            disabled={!editor}
            data-disabled={!editor}
            aria-label={"Insert YouTube video"}
            tooltip={"Insert YouTube video"}
            onClick={handleClick}
            {...buttonProps}
            ref={ref}
          >
            {children ?? (
              <>
                <YoutubeIcon className="tiptap-button-icon" />
                {text && <span className="tiptap-button-text">{text}</span>}
              </>
            )}
          </Button>
        </DialogTrigger>

        <YoutubeModal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onInsert={handleInsert}
          editor={editor}
        />
      </Dialog>
    );
  }
);

YoutubeButton.displayName = "YoutubeButton";

export default YoutubeButton;
