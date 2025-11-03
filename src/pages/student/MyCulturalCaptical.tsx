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
  Lightbulb,
  RotateCcw,
  Upload,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
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
  fetchPreviousWeeks,
  clearError,
  deleteReflection,
  fetchActiveTopics,
} from "@/store/slices/reflectionSlice";
import { fetchStudentDetails } from "@/store/slices/studentSlice";
import { fetchYearGroups } from "@/store/slices/userManagementSlice";
import type { RootState, AppDispatch } from "@/store";
import type { TableEntry } from "@/types";
import { toast } from "sonner";
import { validateFile, uploadFileToSupabase } from "@/utils/fileUpload";
import supabase from "@/lib/supabse";
import DeleteConfirmationDialog from "@/components/ui/DeleteConfirmationDialogProps";
import AttachmentDisplay from "@/components/AttachmentDisplay";
import { getYearGroupDisplayName } from "@/utils/yearGroupUtils";

interface CulturalCapitalEntry {
  id: number;
  date: string;
  topic: string;
  status: "pending" | "approved" | "rejected" | "pending_deletion";
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
    selectedWeek: "",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReflectionId, setSelectedReflectionId] = useState<
    number | null
  >(null);
  //dispatch
  const dispatch = useDispatch<AppDispatch>();
  const {
    topics,
    reflections,
    comments,
    fetchreflectionsloading,
    postingCommentLoading,
    error,
    previousWeeks,
    activeTitles,
    selectedTopicId,
  } = useSelector((state: RootState) => state.reflection);

  const { studentDetails } = useSelector((state: RootState) => state.student);
  const { yearGroups } = useSelector(
    (state: RootState) => state.userManagement
  );

  useEffect(() => {
    console.log(filteredData, "filteredData");
  }, [filteredData]);

  //useEffect of feching projects
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchMyReflections());
      await dispatch(fetchAllTopics());
      await dispatch(fetchActiveTopics());
      await dispatch(fetchPreviousWeeks());
      await dispatch(fetchStudentDetails());
      await dispatch(fetchYearGroups());
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (reflections.length) {
      // Filter reflections by selectedTopicId if one is selected
      let filteredReflections = reflections;
      if (selectedTopicId !== null && selectedTopicId !== undefined) {
        filteredReflections = reflections.filter(
          (item) => item.topic_id?.toString() === selectedTopicId.toString()
        );
      }

      const tableData: TableEntry[] = filteredReflections.map((item, index) => {
        // Assign weeks based on index for now (Week 1-5)
        const weekNumber = (index % 5) + 1;
        const assignedWeek = `Week ${weekNumber}`;

        return {
          id: Number(item.id),
          date: formatDate(item.created_at),
          topic: item.reflection_topics?.title ?? "Unknown", // ✅ use topic instead of title
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
    } else {
      // Reset data when reflections are empty
      setData([]);
      setFilteredData([]);
      setUniqueWeeks([]);
      setUniqueStatuses([]);
      setUniqueTopics([]);
    }
  }, [reflections, selectedTopicId]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          overlayClass: "bg-yellow-500/20",
          icon: Clock,
          iconColor: "text-yellow-600",
          text: "Approval Pending",
          textColor: "text-yellow-700",
          blurClass: "blur-sm",
          borderClass: "border-yellow-300",
        };
      case "approved":
        return {
          overlayClass: "bg-green-500/10",
          icon: CheckCircle,
          iconColor: "text-green-600",
          text: "Approved",
          textColor: "text-green-700",
          blurClass: "",
          borderClass: "border-green-300",
        };
      case "rejected":
        return {
          overlayClass: "bg-red-500/20",
          icon: XCircle,
          iconColor: "text-red-600",
          text: "Rejected",
          textColor: "text-red-700",
          blurClass: "blur-sm",
          borderClass: "border-red-300",
        };
      case "pending_deletion":
        return {
          overlayClass: "bg-orange-500/20",
          icon: AlertTriangle,
          iconColor: "text-orange-600",
          text: "Deletion Pending",
          textColor: "text-orange-700",
          blurClass: "blur-sm",
          borderClass: "border-orange-300",
        };
      default:
        return {
          overlayClass: "",
          icon: CheckCircle,
          iconColor: "text-gray-600",
          text: "Unknown",
          textColor: "text-gray-700",
          blurClass: "",
          borderClass: "border-gray-300",
        };
    }
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
    // Only allow one file per reflection
    if (files.length > 0) {
      setNewReflection((prev) => ({
        ...prev,
        files: [files[0]], // Only take the first file
      }));
    }
  };
  // show error toast here, (do clean them)
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error]);

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
          toast.error(validation.error || "Invalid file");
          return;
        }

        // Get user ID from Supabase auth
        const userData = await supabase.auth.getUser();
        if (!userData.data.user?.id) {
          toast.error("User is not authenticated");
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
          selectedWeek: newReflection.selectedWeek,
        })
      );

      // unwrap will throw if rejected
      const result = unwrapResult(resultAction);
      console.log(result, "RESULT");
      // Show moderation message instead of success message
      toast.success(result.message);

      // Only runs on success ✅
      setIsNewReflectionOpen(false);
      setNewReflection({
        topicID: "",
        content: "",
        files: [],
        selectedWeek: "",
      }); // clear object
    } catch (err: any) {
      // Display the specific error message from the backend

      console.error("Error while submitting the reflection:", err);
    } finally {
      setSubmissionfetchreflectionsloading(false);
    }
  };
  const [deletingReflectionId, setDeletingReflectionId] = useState<
    number | null
  >(null);

  const handleDeleteReflection = async (reflectionId: number) => {
    try {
      setDeletingReflectionId(reflectionId);
      setSubmissionfetchreflectionsloading(true);
      await dispatch(requestDeleteReflection(String(reflectionId)))
        .unwrap()
        .then((res) => {
          toast.success(res.message);
        })
        .catch((err) => {
          toast.error("Failed to request reflection deletion");
          console.error("Error while requesting reflection deletion:", err);
        });
    } catch (err) {
      console.error("Error while deleting reflection:", err);
    } finally {
      setSubmissionfetchreflectionsloading(false);
      setDeletingReflectionId(null);
    }
  };

  const handleViewReflection = async (reflection: CulturalCapitalEntry) => {
    try {
      setSelectedReflection(reflection);
      const result = await dispatch(fetchComments(Number(reflection.id)));
      unwrapResult(result);
      setIsDetailModalOpen(true);
    } catch (err) {
      toast.error("Failed to load reflections and comments");
      console.error(err);
    }
  };
  useEffect(() => {
    console.log(filteredData, data, "DATA");
  }, [filteredData, data]);

  useEffect(() => {
    console.log(activeTitles, "ACTIVE TITLES");
    console.log(uniqueTopics, "UNIQUE TOPICS");
    console.log(uniqueWeeks, "UNIQUE WEEKS");
    console.log(uniqueStatuses, "UNIQUE STATUSES");
  }, [activeTitles, uniqueTopics, uniqueWeeks, uniqueStatuses]);

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
      key: "status" as keyof TableEntry,
      header: "Status",
      className: "text-left",
      render: (item: TableEntry) => {
        const statusInfo = getStatusInfo(item.status);
        const StatusIcon = statusInfo.icon;
        return (
          <div
            className={`px-2 py-1 w-max rounded-full text-xs font-medium ${statusInfo.textColor} bg-white border ${statusInfo.borderClass}`}
          >
            <StatusIcon
              className={`w-3 h-3 inline mr-1 ${statusInfo.iconColor}`}
            />
            {statusInfo.text}
          </div>
        );
      },
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
          {item.status === "approved" && (
            <Button
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
            </Button>
          )}
          {/* {item.status === "approved" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-800"
              onClick={() => handleDeleteReflection(item.id)}
              disabled={submissionfetchreflectionsloading}
              loading={deletingReflectionId === item.id}
            >
              <Trash2 className="w-4 h-4"/>
              
            </Button>
          )} */}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-b-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Cultural Capital</h1>
              {studentDetails && (
                <p className="text-orange-100 mt-1">
                  {getYearGroupDisplayName(
                    studentDetails.year_group_id,
                    yearGroups
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
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
                  {previousWeeks && previousWeeks.previousWeeks.length > 0 ? (
                    previousWeeks.previousWeeks.map((week, index) => (
                      <SelectItem key={index} value={week}>
                        {week === previousWeeks.currentWeek
                          ? `${week} (current)`
                          : week}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      Loading weeks...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {/* <Select
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
              </Select> */}
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
                className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:from-red-500 hover:via-red-600 hover:to-red-700 text-white px-6 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
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
                  <Button className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:from-pink-500 hover:via-pink-600 hover:to-pink-700 text-white px-6 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
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
                      <Label htmlFor="reflection-title">Title *</Label>

                      {activeTitles.length > 0 ? (
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
                            {activeTitles.map((topic, index) => (
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

                    <div className="w-full">
                      <Label htmlFor="reflection-week">Week *</Label>
                      {previousWeeks &&
                      previousWeeks.previousWeeks.length > 0 ? (
                        <Select
                          onValueChange={(value) =>
                            setNewReflection((prev) => ({
                              ...prev,
                              selectedWeek: value,
                            }))
                          }
                        >
                          <SelectTrigger
                            id="reflection-week"
                            className="mt-2 w-full"
                          >
                            <SelectValue placeholder="Choose a week..." />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {previousWeeks.previousWeeks.map((week, index) => (
                              <SelectItem key={index} value={week}>
                                {week === previousWeeks.currentWeek
                                  ? `${week} (current)`
                                  : week}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500 italic">
                          Loading weeks...
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="reflection-description">
                        Description *
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
                          Upload Attachment
                        </Button>

                        {newReflection.files.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600 space-y-1">
                            <p className="font-medium">Attachment selected:</p>
                            <div className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded">
                              <span className="truncate text-xs">
                                {newReflection.files[0].name}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setNewReflection((prev) => ({
                                    ...prev,
                                    files: [],
                                  }))
                                }
                                className="text-red-500 hover:text-red-700 text-xs ml-2 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
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
                        // add validations if no title is selected, or descrioption is empty
                        disabled={
                          submissionfetchreflectionsloading ||
                          !newReflection.topicID ||
                          !newReflection.content ||
                          !newReflection.selectedWeek
                        }
                        className={`flex-1 cursor-pointer ${
                          submissionfetchreflectionsloading
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
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold text-cyan-600">
                    {selectedReflection?.topic}
                  </DialogTitle>
                  {selectedReflection &&
                    (() => {
                      const statusInfo = getStatusInfo(
                        selectedReflection.status
                      );
                      const StatusIcon = statusInfo.icon;
                      return (
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.textColor} bg-white border ${statusInfo.borderClass}`}
                        >
                          <StatusIcon
                            className={`w-4 h-4 inline mr-1 ${statusInfo.iconColor}`}
                          />
                          {statusInfo.text}
                        </div>
                      );
                    })()}
                </div>
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
                            <AttachmentDisplay
                              url={selectedReflection.attachment_url}
                              alt="Reflection attachment"
                              maxHeight="h-48"
                              maxWidth="max-w-full"
                            />
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
              <div className="w-8 h-8 border-4 mt-6 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
