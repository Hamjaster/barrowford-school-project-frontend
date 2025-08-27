import { mergeAttributes, Node } from "@tiptap/react";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { YoutubeNode as YoutubeNodeComponent } from "./youtube-node";

export interface YoutubeOptions {
  /**
   * Controls if the video should autoplay when loaded
   * @default false
   */
  autoplay?: boolean;
  
  /**
   * Controls if the video controls should be shown
   * @default true
   */
  controls?: boolean;
  
  /**
   * Disables keyboard controls
   * @default false
   */
  disableKBcontrols?: boolean;
  
  /**
   * Enables privacy-enhanced mode
   * @default false
   */
  enableIFrameApi?: boolean;
  
  /**
   * The end time of the video in seconds
   */
  endTime?: number;
  
  /**
   * The height of the video
   * @default 480
   */
  height?: number;
  
  /**
   * Enables privacy-enhanced mode
   * @default false
   */
  interfaceLanguage?: string;
  
  /**
   * Enables privacy-enhanced mode
   * @default false
   */
  ivLoadPolicy?: number;
  
  /**
   * Enables privacy-enhanced mode
   * @default false
   */
  loop?: boolean;
  
  /**
   * Enables privacy-enhanced mode
   * @default false
   */
  modestBranding?: boolean;
  
  /**
   * The origin of the request
   */
  origin?: string;
  
  /**
   * The playlist to play
   */
  playlist?: string;
  
  /**
   * Enables privacy-enhanced mode
   * @default false
   */
  privacyEnhanced?: boolean;
  
  /**
   * The start time of the video in seconds
   */
  startTime?: number;
  
  /**
   * The width of the video
   * @default 640
   */
  width?: number;
  
  /**
   * Additional HTML attributes to add to the iframe element.
   * @default {}
   */
  HTMLAttributes?: Record<string, any>;
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    youtube: {
      /**
       * Insert a YouTube video
       */
      setYoutubeVideo: (options: { src: string } & Partial<YoutubeOptions>) => ReturnType;
    };
  }
}

/**
 * YouTube extension for Tiptap
 */
export const YoutubeNode = Node.create<YoutubeOptions>({
  name: "youtube",

  group: "block",

  atom: true,

  draggable: true,

  addOptions() {
    return {
      autoplay: false,
      controls: true,
      disableKBcontrols: false,
      enableIFrameApi: false,
      endTime: 0,
      height: 480,
      interfaceLanguage: undefined,
      ivLoadPolicy: 0,
      loop: false,
      modestBranding: false,
      origin: undefined,
      playlist: undefined,
      privacyEnhanced: false,
      startTime: 0,
      width: 640,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => ({ src: attributes.src }),
      },
      start: {
        default: 0,
      },
      width: {
        default: this.options.width,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => ({ width: attributes.width }),
      },
      height: {
        default: this.options.height,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) => ({ height: attributes.height }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-youtube-video] iframe[src*="youtube.com"]',
      },
      {
        tag: 'div[data-youtube-video] iframe[src*="youtu.be"]',
      },
      {
        tag: 'iframe[src*="youtube.com"]',
      },
      {
        tag: 'iframe[src*="youtu.be"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const embedUrl = this.getEmbedUrlFromYoutubeUrl(HTMLAttributes.src);
    
    return [
      "div",
      { "data-youtube-video": "" },
      [
        "iframe",
        mergeAttributes(
          this.options.HTMLAttributes,
          {
            width: this.options.width,
            height: this.options.height,
            src: embedUrl,
            frameborder: 0,
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            allowfullscreen: true,
          },
          HTMLAttributes
        ),
      ],
    ];
  },

  addCommands() {
    return {
      setYoutubeVideo:
        (options: { src: string } & Partial<YoutubeOptions>) =>
        ({ commands }) => {
          if (!this.isValidYoutubeUrl(options.src)) {
            return false;
          }

          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(YoutubeNodeComponent);
  },

  // Helper methods
  getEmbedUrlFromYoutubeUrl(url: string): string {
    if (!url) return "";

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    const videoId = match && match[2].length === 11 ? match[2] : null;

    if (!videoId) {
      return url;
    }

    const params = new URLSearchParams();

    if (this.options.autoplay) {
      params.set("autoplay", "1");
    }

    if (!this.options.controls) {
      params.set("controls", "0");
    }

    if (this.options.disableKBcontrols) {
      params.set("disablekb", "1");
    }

    if (this.options.enableIFrameApi) {
      params.set("enablejsapi", "1");
    }

    if (this.options.endTime) {
      params.set("end", this.options.endTime.toString());
    }

    if (this.options.interfaceLanguage) {
      params.set("hl", this.options.interfaceLanguage);
    }

    if (this.options.ivLoadPolicy) {
      params.set("iv_load_policy", this.options.ivLoadPolicy.toString());
    }

    if (this.options.loop) {
      params.set("loop", "1");
    }

    if (this.options.modestBranding) {
      params.set("modestbranding", "1");
    }

    if (this.options.origin) {
      params.set("origin", this.options.origin);
    }

    if (this.options.playlist) {
      params.set("playlist", this.options.playlist);
    }

    if (this.options.startTime) {
      params.set("start", this.options.startTime.toString());
    }

    const domain = this.options.privacyEnhanced ? "youtube-nocookie.com" : "youtube.com";
    const paramString = params.toString();
    
    return `https://www.${domain}/embed/${videoId}${paramString ? `?${paramString}` : ""}`;
  },

  isValidYoutubeUrl(url: string): boolean {
    if (!url) return false;

    const youtubeRegExp = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegExp.test(url);
  },
});

export default YoutubeNode;
