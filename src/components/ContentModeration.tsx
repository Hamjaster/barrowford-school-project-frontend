import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AttachmentDisplay from "./AttachmentDisplay";
import {
  MessageSquare,
  ImageIcon,
  BookOpen,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
} from "lucide-react";
import {
  fetchModerations,
  approveModeration,
  rejectModeration,
  clearError,
} from "@/store/slices/moderationSlice";
import type { RootState, AppDispatch } from "@/store";
import type { ModerationItem } from "@/store/slices/moderationSlice";
import { showToast } from "@/utils/showToast";

const ContentModeration: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { moderations, loading, error, approving, rejecting } = useSelector(
    (state: RootState) => state.moderation
  );

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedModeration, setSelectedModeration] =
    useState<ModerationItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    dispatch(fetchModerations());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast(error, false);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleApprove = async (moderation: ModerationItem) => {
    try {
      await dispatch(approveModeration(moderation.id)).unwrap();
      showToast("Content approved successfully", true);
    } catch (error) {
      showToast("Failed to approve content", false);
    }
  };

  const handleReject = async () => {
    if (!selectedModeration) return;

    try {
      await dispatch(
        rejectModeration({
          moderationId: selectedModeration.id,
          reason: rejectionReason || undefined,
        })
      ).unwrap();
      showToast("Content rejected successfully", true);
      setRejectDialogOpen(false);
      setSelectedModeration(null);
      setRejectionReason("");
    } catch (error) {
      showToast("Failed to reject content", false);
    }
  };

  const openRejectDialog = (moderation: ModerationItem) => {
    setSelectedModeration(moderation);
    setRejectDialogOpen(true);
  };

  const getEntityTypeIcon = (entityType: string) => {
    switch (entityType) {
      case "reflection":
        return <MessageSquare className="h-5 w-5 text-primary" />;
      case "studentimages":
        return <ImageIcon className="h-5 w-5 text-primary" />;
      case "studentlearningentities":
        return <BookOpen className="h-5 w-5 text-primary" />;
      default:
        return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  const getEntityTypeDisplayName = (entityType: string) => {
    switch (entityType) {
      case "reflection":
        return "Reflection";
      case "studentimages":
        return "Image";
      case "studentlearningentities":
        return "Student Learning";
      default:
        return entityType;
    }
  };

  const getActionTypeDisplayName = (actionType: string) => {
    switch (actionType) {
      case "create":
        return "New";
      case "update":
        return "Edit";
      case "delete":
        return "Delete";
      default:
        return actionType;
    }
  };

  const getActionTypeBadgeVariant = (actionType: string) => {
    switch (actionType) {
      case "create":
        return "secondary";
      case "update":
        return "outline";
      case "delete":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderContentPreview = (moderation: ModerationItem) => {
    const { action_type, entity_type, new_content, old_content, entity_title } =
      moderation;

    // Helper function to render attachment if present
    const renderAttachment = (content: any, label: string, isOld = false) => {
      if (!content?.attachment_url && !content?.image_url) return null;

      const imageUrl = content.attachment_url || content.image_url;
      const borderColor = isOld ? "border-red-200" : "border-green-200";

      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                isOld
                  ? "text-red-600 border-red-200 bg-red-50"
                  : "text-green-600 border-green-200 bg-green-50"
              }
            >
              {label}
            </Badge>
          </div>
          <div className="relative">
            <AttachmentDisplay
              url={imageUrl}
              alt={isOld ? "Previous submission" : "New submission"}
              className={`max-w-full h-auto max-h-64 rounded-lg `}
              maxHeight="max-h-64"
              maxWidth="max-w-full"
            />
          </div>
        </div>
      );
    };

    // Helper function to render text content
    const renderTextContent = (content: any, _label: string, isOld = false) => {
      const text = content?.content || content?.description || "";
      if (!text) return null;

      return (
        <div
          className={`relative text-sm p-4 rounded-lg border-2 ${
            isOld
              ? "bg-red-50 border-red-200"
              : action_type === "delete"
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div className="whitespace-pre-wrap">{text}</div>
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {/* Topic title if available */}
        {entity_title && (
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <p className="font-medium text-blue-700">Title: {entity_title}</p>
          </div>
        )}

        {/* Action-specific rendering */}
        {action_type === "create" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">
                New {getEntityTypeDisplayName(entity_type)}
              </span>
            </div>

            {/* Show attachment if available */}
            {(new_content?.attachment_url || new_content?.image_url) && (
              <div className="bg-white p-4 rounded-lg border">
                {renderAttachment(
                  new_content,
                  `${entity_type === "studentimages" ? "Image" : "Attachment"}`
                )}
              </div>
            )}

            {/* Show text content */}
            {(new_content?.content || new_content?.description) && (
              <div>
                {renderTextContent(
                  new_content,
                  `New ${getEntityTypeDisplayName(entity_type)}`
                )}
              </div>
            )}
          </div>
        )}

        {action_type === "update" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-orange-700">
                Updated {getEntityTypeDisplayName(entity_type)}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Previous version */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Previous Version
                </h4>
                {(old_content?.attachment_url || old_content?.image_url) &&
                  renderAttachment(old_content, "Previous Attachment", true)}
                {(old_content?.content || old_content?.description) &&
                  renderTextContent(old_content, "Previous Content", true)}
                {!old_content?.attachment_url &&
                  !old_content?.image_url &&
                  !old_content?.content &&
                  !old_content?.description && (
                    <p className="text-gray-500 italic">No previous content</p>
                  )}
              </div>

              {/* New version */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  New Version
                </h4>
                {(new_content?.attachment_url || new_content?.image_url) &&
                  renderAttachment(new_content, "New Attachment")}
                {(new_content?.content || new_content?.description) &&
                  renderTextContent(new_content, "New Content")}
              </div>
            </div>
          </div>
        )}

        {action_type === "delete" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-red-700">
                Delete {getEntityTypeDisplayName(entity_type)}
              </span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-red-200">
              {(old_content?.attachment_url || old_content?.image_url) &&
                renderAttachment(old_content, "Image to be deleted", true)}
              {(old_content?.content || old_content?.description) &&
                renderTextContent(old_content, "Content to be deleted", true)}
            </div>
          </div>
        )}

        {/* Show entity-specific metadata */}
        {entity_type === "reflection" && new_content?.topic_id && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            Reflection ID: {new_content.topic_id}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
          <CardDescription>
            Review and approve student submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Loading moderations...
            </h3>
            <p className="text-gray-500 text-center">
              Fetching pending content submissions that require your review.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
          <CardDescription>
            Review and approve student submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moderations.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    All Caught Up! 🎉
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Great job! There are no pending content submissions that
                    require moderation.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-700">
                      When students submit new content for review, it will
                      appear here for your approval.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              moderations.map((moderation) => (
                <div
                  key={moderation.id}
                  className="bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Header Section */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            moderation.action_type === "create"
                              ? "bg-green-100"
                              : moderation.action_type === "update"
                              ? "bg-orange-100"
                              : "bg-red-100"
                          }`}
                        >
                          {getEntityTypeIcon(moderation.entity_type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {moderation.student_name ||
                                `Student ${moderation.student_id}`}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              {getEntityTypeIcon(moderation.entity_type)}
                              {getEntityTypeDisplayName(moderation.entity_type)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(moderation.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={getActionTypeBadgeVariant(
                            moderation.action_type
                          )}
                          className={`text-sm px-3 py-1.5 font-medium ${
                            moderation.action_type === "create"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : moderation.action_type === "update"
                              ? "bg-orange-100 text-orange-800 border-orange-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {getActionTypeDisplayName(moderation.action_type)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Content Preview Section */}
                  <div className="p-6">{renderContentPreview(moderation)}</div>

                  {/* Action Buttons Section */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Moderation required • Pending staff review
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(moderation)}
                          disabled={
                            approving[moderation.id] || rejecting[moderation.id]
                          }
                          loading={approving[moderation.id]}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-medium transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {approving[moderation.id]
                            ? "Approving..."
                            : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openRejectDialog(moderation)}
                          loading={rejecting[moderation.id]}
                          disabled={
                            rejecting[moderation.id] || approving[moderation.id]
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium transition-colors"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          {rejecting[moderation.id] ? "Rejecting..." : "Reject"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Reject Content Submission
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              You are about to reject this{" "}
              {selectedModeration
                ? getEntityTypeDisplayName(
                    selectedModeration.entity_type
                  ).toLowerCase()
                : "content"}{" "}
              submission. Please provide a clear reason to help the student
              understand the decision.
            </DialogDescription>
          </DialogHeader>

          {/* Selected moderation preview */}
          {selectedModeration && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  {getEntityTypeIcon(selectedModeration.entity_type)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {selectedModeration.student_name ||
                      `Student ${selectedModeration.student_id}`}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {getEntityTypeDisplayName(selectedModeration.entity_type)} •{" "}
                    {getActionTypeDisplayName(selectedModeration.action_type)}
                  </p>
                </div>
              </div>
              {/* {!selectedModeration.topic_title && ( */}
              <p className="text-sm text-gray-700 mt-2">
                <strong>Topic:</strong> The Orientation
                {/* <strong>Topic:</strong> {selectedModeration.topic_title} */}
              </p>
              {/* )} */}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="rejection-reason"
                className="text-sm font-medium text-gray-700"
              >
                Rejection Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please explain why this content is being rejected. Be specific and constructive to help the student improve their next submission..."
                className="mt-2 min-h-[120px] resize-none border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                This feedback will be shared with the student and their parents.
              </p>
            </div>

            {/* Common rejection reasons */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Quick Reasons (click to add):
              </Label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Inappropriate content",
                  "Does not match the topic",
                  "Incomplete submission",
                  "Poor quality image",
                  "Needs more detail",
                  "Violates guidelines",
                ].map((reason) => (
                  <Button
                    key={reason}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 border-gray-300 hover:bg-gray-100"
                    onClick={() => {
                      if (rejectionReason) {
                        setRejectionReason(rejectionReason + ". " + reason);
                      } else {
                        setRejectionReason(reason);
                      }
                    }}
                  >
                    + {reason}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setSelectedModeration(null);
                setRejectionReason("");
              }}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              loading={rejecting[selectedModeration?.id || 0]}
              disabled={rejectionReason === ""}
              className="bg-red-600 hover:bg-red-700"
            >
              <span className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                {rejecting[selectedModeration?.id || 0]
                  ? "Rejecting..."
                  : "Reject Submission"}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentModeration;
