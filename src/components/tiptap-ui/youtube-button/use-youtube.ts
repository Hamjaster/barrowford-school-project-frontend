import * as React from "react";
import type { Editor } from "@tiptap/react";

// --- Icons ---
import { YoutubeIcon } from "@/components/tiptap-icons/youtube-icon";

export const YOUTUBE_SHORTCUT_KEY = "Mod-Shift-Y";

export interface UseYoutubeConfig {
  /**
   * The editor instance to use. If not provided, the hook will attempt to use the editor from the nearest EditorContext.
   */
  editor?: Editor | null;
  /**
   * Whether to hide the button when the command is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * Callback function to call when a YouTube video is inserted.
   */
  onInserted?: (url: string) => void;
}

export function useYoutube({
  editor,
  hideWhenUnavailable = false,
  onInserted,
}: UseYoutubeConfig = {}) {
  const isVisible = React.useMemo(() => {
    if (hideWhenUnavailable && !editor?.can().setYoutubeVideo({ src: "" })) {
      return false;
    }
    return true;
  }, [editor, hideWhenUnavailable]);

  const canInsert = React.useMemo(() => {
    if (!editor) return false;
    return editor.can().setYoutubeVideo({ src: "" });
  }, [editor]);

  const insertYoutubeVideo = React.useCallback(
    (url: string) => {
      if (!editor || !url) return false;

      // Validate YouTube URL
      const youtubeRegExp = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      if (!youtubeRegExp.test(url)) {
        return false;
      }

      const success = editor.chain().focus().setYoutubeVideo({ src: url }).run();
      
      if (success) {
        onInserted?.(url);
      }
      
      return success;
    },
    [editor, onInserted]
  );

  const label = React.useMemo(() => "Insert YouTube video", []);
  const shortcutKeys = React.useMemo(() => YOUTUBE_SHORTCUT_KEY, []);

  return {
    isVisible,
    canInsert,
    insertYoutubeVideo,
    label,
    shortcutKeys,
    Icon: YoutubeIcon,
  };
}
