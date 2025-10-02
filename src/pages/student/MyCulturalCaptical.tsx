import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  File,
  FileText,
  ImageIcon,
  Lightbulb,
  Music,
  RotateCcw,
  Upload,
  Video,
  Trash2,
  Eye
} from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { unwrapResult } from "@reduxjs/toolkit";

//for api handling
import { useDispatch, useSelector } from "react-redux";
import {
  createReflection,
  requestDeleteReflection,
  fetchMyReflections,
  fetchComments,
  fetchAllTopics,
} from "@/store/slices/reflectionSlice";
import type { RootState, AppDispatch } from "@/store";
import type { TableEntry } from "@/types";
import { showToast } from "@/utils/showToast";
import { validateFile, uploadFileToSupabase } from "@/utils/fileUpload";
import supabase from "@/lib/supabse";
import DeleteConfirmationDialog from "@/components/ui/DeleteConfirmationDialogProps";

interface CulturalCapitalEntry {
  id: string;
  date: string;
  topic: string;
  status: "Approved" | "Pending" | "Draft";
  week?: string;
  content: string;
  attachment_url: string;
}
export default function CulturalCapitalPage() {
  const [data, setData] = useState<TableEntry[]>([]);
  const [filteredData, setFilteredData] = useState<TableEntry[]>([]);
  const [weekFilter, setWeekFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [isNewReflectionOpen, setIsNewReflectionOpen] = useState(false);
  const [selectedReflection, setSelectedReflection] =
    useState<CulturalCapitalEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [
    submissionfetchreflectionsloading,
    setSubmissionfetchreflectionsloading,
  ] = useState(false);
  const [uniqueWeeks, setUniqueWeeks] = useState<string[]>([]);
  const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);
  const [uniqueTopics, setUniqueTopics] = useState<string[]>([]);

  const [newReflection, setNewReflection] = useState({
    topicID: "",
    content: "",
    files: [] as File[],
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReflectionId, setSelectedReflectionId] = useState<string | null>(null);
  //dispatch
  const dispatch = useDispatch<AppDispatch>();
  const {
    topics,
    reflections,
    comments,
    fetchreflectionsloading,
    postingCommentLoading,
  } = useSelector((state: RootState) => state.reflection);

  //useEffect of feching projects
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchMyReflections());
      await dispatch(fetchAllTopics());
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (reflections.length) {
      const tableData: TableEntry[] = reflections.map((item, index) => {
        // Assign weeks based on index for now (Week 1-5)
        const weekNumber = (index % 5) + 1;
        const assignedWeek = `Week ${weekNumber}`;

        return {
          id: String(item.id),
          date: formatDate(item.created_at),
          topic: item.reflectiontopics?.title ?? "Unknown", // ✅ use topic instead of title
          status: item.status ?? "Pending",
          content: item.content ?? "",
          attachment_url: item.attachment_url ?? "",
          topic_id: item.topic_id ?? "",
          week: item.week ?? assignedWeek, // Use existing week or assign based on index
        };
      });
      console.log(tableData, "TABLE DATA");
      setData(tableData);
      setFilteredData(tableData);

      // Update unique values state
      setUniqueWeeks(
        Array.from(
          new Set(
            tableData
              .map((item) => item.week)
              .filter((week): week is string => Boolean(week))
          )
        )
      );
      setUniqueStatuses(
        Array.from(new Set(tableData.map((item) => item.status)))
      );
      setUniqueTopics(Array.from(new Set(tableData.map((item) => item.topic))));
    }
  }, [reflections]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  // utils/fileUtils.ts
  const parseAttachmentUrl = (url: string) => {
    if (!url) return { cleanedName: "Unknown file", extension: "file" };

    // Extract raw file name
    const parts = url.split("/");
    const rawFileName = parts[parts.length - 1];

    // Decode URI (%20 -> space, %27 -> ')
    let cleanedName = decodeURIComponent(rawFileName);

    // Remove Cloudinary’s random suffix (e.g. --aaee before .pdf)
    cleanedName = cleanedName.replace(/--[a-z0-9]+(?=\.)/, "");

    // Get extension
    const extension = cleanedName.split(".").pop() || "file";

    return { cleanedName, extension };
  };

  const applyFiltersAfterChange = (
    week: string,
    status: string,
    topic: string
  ) => {
    let filtered = data;

    if (week !== "all") {
      filtered = filtered.filter((item) => item.week === week);
    }
    if (status !== "all") {
      filtered = filtered.filter((item) => item.status === status);
    }
    if (topic && topic !== "all") {
      console.log(filtered, "FILTERED", topic, "value");
      // this filter should be based on the topic id
      filtered = filtered.filter(
        (item) => item.topic_id.toString().toLowerCase() === topic.toLowerCase()
      );
    }

    setFilteredData(filtered);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setNewReflection((prev) => ({
      ...prev,
      files: [...prev.files, ...files],
    }));
  };

  const handleSubmitReflection = async () => {
    try {
      setSubmissionfetchreflectionsloading(true);

      let attachmentUrl = "";

      // Handle file upload to Supabase S3 if file exists
      if (newReflection.files.length > 0) {
        const file = newReflection.files[0];

        // Validate file
        const validation = validateFile(file, 10, [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]);

        if (!validation.isValid) {
          showToast(validation.error || "Invalid file", false);
          return;
        }

        // Get user ID from Supabase auth
        const userData = await supabase.auth.getUser();
        if (!userData.data.user?.id) {
          showToast("User is not authenticated", false);
          return;
        }
        const userId = userData.data.user.id;

        // Upload to Supabase S3
        const uploadResult = await uploadFileToSupabase(
          file,
          "barrowford-school-uploads",
          userId
        );

        if (uploadResult.success && uploadResult.url) {
          attachmentUrl = uploadResult.url;
        } else {
          showToast(uploadResult.error || "Failed to upload file", false);
          return;
        }
      }
      console.log(attachmentUrl, "ATTACHMENT URL tooo send :)");

      // Create reflection with attachment URL
      const resultAction = await dispatch(
        createReflection({
          topicID: newReflection.topicID,
          content: newReflection.content,
          attachmentUrl: attachmentUrl,
        })
      );

      // unwrap will throw if rejected
      const result = unwrapResult(resultAction);
      console.log(result, "RESULT");
      // Show moderation message instead of success message
      showToast(result.message, true);

      // Only runs on success ✅
      setIsNewReflectionOpen(false);
      setNewReflection({ topicID: "", content: "", files: [] }); // clear object
    } catch (err: any) {
      // Display the specific error message from the backend
      const errorMessage =
        err?.message || "Failed to submit reflection for moderation";
      showToast(errorMessage, false);
      console.error("Error while submitting the reflection:", err);
    } finally {
      setSubmissionfetchreflectionsloading(false);
    }
  };
  const [deletingReflectionId, setDeletingReflectionId] = useState<
    string | null
  >(null);
  const handleDeleteReflection = async (reflectionId: string) => {
    try {
     
      setDeletingReflectionId(reflectionId);
      setSubmissionfetchreflectionsloading(true);
      const resultAction = await dispatch(
        requestDeleteReflection(reflectionId)
      );

      // unwrap will throw if rejected
      const result = unwrapResult(resultAction);

      // Show moderation message
      showToast(result.message, true);
    } catch (err) {
      showToast("Failed to request reflection deletion", false);
      console.error("Error while requesting reflection deletion:", err);
    } finally {
      setSubmissionfetchreflectionsloading(false);
      setDeletingReflectionId(null);
    }
  };

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
  const handleViewReflection = async (reflection: CulturalCapitalEntry) => {
    try {
      setSelectedReflection(reflection);
      const result = await dispatch(fetchComments(Number(reflection.id)));
      unwrapResult(result);
      setIsDetailModalOpen(true);
    } catch (err) {
      showToast("Failed to load reflections and comments", false);
      console.error(err);
    }
  };
  useEffect(() => {
    console.log(filteredData, data, "DATA");
  }, [filteredData, data]);

  useEffect(() => {
    console.log(uniqueTopics, "UNIQUE TOPICS");
    console.log(uniqueWeeks, "UNIQUE WEEKS");
    console.log(uniqueStatuses, "UNIQUE STATUSES");
  }, [uniqueTopics, uniqueWeeks, uniqueStatuses]);

  const columns = [
    {
      key: "date" as keyof TableEntry,
      header: "Date",
      className: "text-left",
    },
    {
      key: "week" as keyof TableEntry,
      header: "Week",
      className: "text-left",
    },
    {
      key: "topic" as keyof TableEntry,
      header: "Topic",
      className: "text-left",
    },
    {
      key: "actions" as keyof TableEntry,
      header: "Actions",
      className: "text-left",
      render: (item: TableEntry) => (
        <div className="flex gap-">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => handleViewReflection(item as CulturalCapitalEntry)}
            loading={
              postingCommentLoading && selectedReflection?.id === item.id
            }
          >
            <Eye className="w-4 h-4 text-black" />

          </Button>
          {/* <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-800"
            onClick={() => {
              setSelectedReflectionId(item.id);
              setIsDeleteDialogOpen(true);
            }}
            disabled={submissionfetchreflectionsloading}
            loading={deletingReflectionId === item.id}
          >
            <Trash2 className="w-4 h-4" />
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-cyan-500 text-white p-6 rounded-b-2xl">
        <h1 className="text-3xl font-bold">My Cultural Capital</h1>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="bg-white flex items-center justify-between rounded-2xl p-6 shadow-sm">
          <div className="flex  items-center justify-start  w-full">
            <div className="flex flex-row space-x-2 w-full">
              {/* <Label htmlFor="week-filter">Filter By Week</Label> */}
              <Select
                value={weekFilter}
                onValueChange={(value) => {
                  setWeekFilter(value);
                  applyFiltersAfterChange(value, statusFilter, topicFilter);
                }}
              >
                <SelectTrigger className="cursor-pointer ">
                  <SelectValue placeholder="Select week..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Filter By Week</SelectItem>
                  {["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"].map(
                    (week) => (
                      <SelectItem key={week} value={week}>
                        {week}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <Select
                value={topicFilter}
                onValueChange={(value) => {
                  setTopicFilter(value);
                  applyFiltersAfterChange(weekFilter, statusFilter, value);
                }}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select topic..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Filter by Topic</SelectItem>

                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id.toString()}>
                      {topic.title as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className=" w-full flex flex-row gap-2">
              {/* Clear Filters button */}
              <Button
                variant="destructive"
                onClick={() => {
                  setWeekFilter("all");
                  setStatusFilter("all");
                  setTopicFilter("all");
                  setFilteredData(data);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Clear Filters
              </Button>
              {/* create reflection dialog box */}
              <Dialog
                open={isNewReflectionOpen}
                onOpenChange={setIsNewReflectionOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6 cursor-pointer">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    New Reflection
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Reflection</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="w-full">
                      <Label htmlFor="reflection-title">Title</Label>

                      {topics.length > 0 ? (
                        <Select
                          onValueChange={(value) =>
                            setNewReflection((prev) => ({
                              ...prev,
                              topicID: value, // <-- store selected topic ID here
                            }))
                          }
                        >
                          <SelectTrigger
                            id="reflection-title"
                            className="mt-2 w-full"
                          >
                            <SelectValue placeholder="Choose a reflection title..." />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {topics.map((topic, index) => (
                              <SelectItem
                                key={index}
                                value={topic.id.toString()}
                              >
                                {topic.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500 italic">
                          No active reflection topics available.
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="reflection-description">
                        Description
                      </Label>
                      <Textarea
                        id="reflection-description"
                        value={newReflection.content}
                        onChange={(e) =>
                          setNewReflection((prev) => ({
                            ...prev,
                            content: e.target.value, // ✅ matches state
                          }))
                        }
                        placeholder="Write your reflection..."
                        className="mt-2 min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reflection-files">Attach Files</Label>
                      <div className="mt-1">
                        <input
                          id="reflection-files"
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden "
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("reflection-files")?.click()
                          }
                          className="w-full cursor-pointer mt-2"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Files
                        </Button>

                        {newReflection.files.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600 space-y-1">
                            <p className="font-medium">
                              {newReflection.files.length} file(s) selected:
                            </p>
                            <ul className="space-y-1">
                              {newReflection.files.map((file, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded"
                                >
                                  <span className="truncate text-xs">
                                    {file.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setNewReflection((prev) => ({
                                        ...prev,
                                        files: prev.files.filter(
                                          (_, i) => i !== idx
                                        ),
                                      }))
                                    }
                                    className="text-red-500 hover:text-red-700 text-xs ml-2 cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsNewReflectionOpen(false)}
                        className="flex-1 cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitReflection}
                        disabled={submissionfetchreflectionsloading}
                        className={`flex-1 cursor-pointer ${submissionfetchreflectionsloading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-pink-500 hover:bg-pink-600"
                          }`}
                      >
                        {submissionfetchreflectionsloading
                          ? "Adding..."
                          : "Add Reflection"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {/* Create new reflection */}

          {/* Reflection Detail Modal */}
          <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-cyan-600">
                  {selectedReflection?.topic}
                </DialogTitle>
              </DialogHeader>

              {selectedReflection && (
                <div className="space-y-6">
                  {/* Header Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {selectedReflection.date}
                      </div>
                      {selectedReflection.week && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">Week:</span>
                          <span>{selectedReflection.week}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Reflection */}

                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedReflection.content ?? ""}
                  </p>

                  {/* Attachments */}
                  {selectedReflection.attachment_url.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-cyan-600">
                          Attachments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedReflection.attachment_url && (
                          <div className="grid grid-cols-1 gap-4 w-full">
                            <a
                              href={selectedReflection.attachment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 w-full flex items-center gap-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              {selectedReflection?.attachment_url &&
                                (() => {
                                  const { cleanedName, extension } =
                                    parseAttachmentUrl(
                                      selectedReflection.attachment_url
                                    );

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
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Existing Comments */}
                  {comments.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MessageSquare className="w-4 h-4" />
                        Comments ({comments.length})
                      </div>

                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-800">
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
                          <p className="text-sm text-gray-700">
                            {comment.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* </DialogContent>
    </Dialog> */}

                  {/* Close Button */}
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => setIsDetailModalOpen(false)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-8"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {fetchreflectionsloading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Reflections Yet
              </h3>
            </div>
          ) : (
            <DataTable
              data={filteredData}
              columns={columns}
              showPagination={true}
              itemsPerPage={9}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-pink-500 fixed bottom-0 w-full text-white p-4 mt-8">
        <div className="flex justify-between items-center text-sm">
          <span>© 2025 Barrowford Primary School. All Rights Reserved.</span>
          <span>Developed by Nybble</span>
        </div>
      </div>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedReflectionId(null);
        }}
        onConfirm={async () => {
          if (selectedReflectionId) {
            await handleDeleteReflection(selectedReflectionId);
          }
          setIsDeleteDialogOpen(false);
          setSelectedReflectionId(null);
        }}
        title="Delete Reflection"
        description="Are you sure you want to delete this reflection? This action cannot be undone."
      />
    </div>
  );
}
