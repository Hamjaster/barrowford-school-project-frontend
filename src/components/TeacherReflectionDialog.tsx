"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  File,
  FileText,
  ImageIcon,
  Music,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Heart, MessageSquare, Send, User } from "lucide-react";
import { useState } from "react";
import type { ReflectionItem, ReflectionComment } from "@/types";
import { CardHeader } from "./tiptap-ui-primitive/card";

export default function TeacherReflectionDialog({
  reflection,
  comments,
  isOpen,
  onClose,
  onAddComment,
}: {
  reflection: ReflectionItem | null;
  comments: ReflectionComment[];
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (reflectionId: number, comment: string) => void;
}) {
  const [newComment, setNewComment] = useState("");
    const getAttachmentIcon = (type: string) => {
      switch (type) {
        case "image":
          return <ImageIcon className="w-4 h-4" />;
        case "video":
          return <Video className="w-4 h-4" />;
        case "audio":
          return <Music className="w-4 h-4" />;
        case "document":
          return <FileText className="w-4 h-4" />;
        default:
          return <File className="w-4 h-4" />;
      }
    };

  // If no reflection is selected, render nothing
  if (!reflection) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto m-0">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {reflection.reflectiontopics?.title ?? "Untitled Reflection"}
          </DialogTitle>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <Badge variant="secondary">{reflection.week ?? "Week 1"}</Badge>
            <Clock className="w-3 h-3" />
            {new Date(reflection.created_at).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {/* Reflection Content */}
          <Card className="p-3">
            <CardContent className="p-3 bg-gray-50 border-l-4 border-blue-400 rounded-lg">
              <p className=" m-0 text-sm text-gray-700 leading-relaxed">
                {reflection.content}
              </p>
            </CardContent>
          </Card>
         {/* Attachments Section */}
{reflection.attachment_url && reflection.attachment_url.length > 0 && (
  <Card className="m-0">
    <CardHeader>
      <CardTitle className="text-lg text-cyan-600">Attachments</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href={reflection.attachment_url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 flex items-center gap-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          {(() => {
            const url = reflection.attachment_url;

            // Extract raw file name
            const parts = url.split("/");
            const rawFileName = parts[parts.length - 1];

            // Decode URI (%20 -> space, %27 -> ')
            let cleanedName = decodeURIComponent(rawFileName);

            // Remove Cloudinary’s random suffix (e.g. --aaee before .pdf)
            cleanedName = cleanedName.replace(/--[a-z0-9]+(?=\.)/, "");

            // Get extension
            const extension = cleanedName.split(".").pop() || "file";

            return (
              <>
                {getAttachmentIcon(extension)}
                <div className="flex-1">
                  <p className="p-2 font-medium text-sm truncate">
                    {cleanedName}
                  </p>
                </div>
              </>
            );
          })()}
        </a>
      </div>
    </CardContent>
  </Card>
)}


          {/* Comments Section */}
          {comments.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MessageSquare className="w-4 h-4" />
                Comments ({comments.length})
              </div>

              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-800">
                          {comment.user_role}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MessageSquare className="w-4 h-4" />
              Add a comment
            </div>
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/teacher.png" alt="Teacher" />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] text-sm resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      onAddComment(newComment);
                      setNewComment("");
                    }}
                    disabled={!newComment.trim()}
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Post Comment
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setNewComment("")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Heart className="w-3 h-3" />
            <span>Shared with care</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
