import type React from "react";

import { useState,useEffect } from "react";
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
  XCircle
} from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { unwrapResult } from "@reduxjs/toolkit";

  //for api handling 
import { useDispatch, useSelector } from "react-redux";
import { createReflection,fetchActiveTopics, fetchMyReflections,fetchComments } from "@/store/slices/reflectionSlice";
import type { RootState, AppDispatch } from "@/store";
import type {TableEntry} from '@/types'
import { showToast } from "@/utils/showToast";


interface CulturalCapitalEntry {
  id: string;
  date: string;
  title : string;
  status: "Approved" | "Pending" | "Draft";
  week: string;
  content : string;
  attachment_url : string;
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
  const [submissionfetchreflectionsloading,setSubmissionfetchreflectionsloading] = useState(false)

  
  const [newReflection, setNewReflection] = useState({
    topicID: "",
    content : "",
    files: [] as File[],
  });

    //dispatch
    const dispatch = useDispatch<AppDispatch>();
    const { activeTitles,reflections,comments, fetchreflectionsloading } = useSelector(
      (state: RootState) => state.reflection
    );
  
    //useEffect of feching projects 
useEffect(() => {
  const fetchData = async () => {
     await dispatch(fetchMyReflections());
    await dispatch(fetchActiveTopics());
   
  };
  
  fetchData();
}, [dispatch]);

useEffect(() => {
  if (reflections.length) {
    const tableData: TableEntry[] = reflections.map((item) => ({
      id: String(item.id),
      date: formatDate(item.created_at),
      topic: item.reflectiontopics?.title ?? "Unknown",  // ✅ use topic
      status: item.status ?? "Pending",
      content: item.content ?? "",
      attachment_url: item.attachment_url ?? "",
    }));

    setData(tableData);
    setFilteredData(tableData);
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
const   parseAttachmentUrl = (url: string)=> {
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
}


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
      filtered = filtered.filter((item) =>
        item.topic.toLowerCase().includes(topic.toLowerCase())
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
    setSubmissionfetchreflectionsloading(true)
    const resultAction = await dispatch(
      createReflection({
        topicID: newReflection.topicID,
        content: newReflection.content,
        file: newReflection.files[0],
      })
    );

    // unwrap will throw if rejected
    unwrapResult(resultAction);
    showToast("Reflection submitted successfully!", true);

    // Only runs on success ✅
    setIsNewReflectionOpen(false);
    setNewReflection({ topicID: "", content: "", files: [] }); // clear object
  } catch (err) {
    showToast("failed in submiiting relfections",false)
    console.error("Error while submitting the reflection:", err);
  }
  finally{
      setIsNewReflectionOpen(false);
      setNewReflection({ topicID: "", content: "", files: [] }); // clear object
  }
};

 
  

  const uniqueWeeks = Array.from(new Set(data.map((item) => item.week)));
  const uniqueStatuses = Array.from(new Set(data.map((item) => item.status)));
  const uniqueTopics = Array.from(new Set(data.map((item) => item.topic)));
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default";
      case "Pending":
        return "secondary";
      case "Draft":
        return "outline";
      default:
        return "outline";
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


  const columns = [
    {
      key: "date" as keyof CulturalCapitalEntry,
      header: "Date",
      className: "text-left",
    },
    {
      key: "title" as keyof CulturalCapitalEntry,
      header: "Topic",
      className: "text-left",
    },
    {
      key: "status" as keyof CulturalCapitalEntry,
      header: "Status",
      className: "text-left",
    },
    {
      key: "actions" as keyof CulturalCapitalEntry,
      header: "Actions",
      className: "text-left",
      render: (item: CulturalCapitalEntry) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-800"
          onClick={() => handleViewReflection(item)}
        >
          View
        </Button>
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



          <div className="flex gap-4 items-center justify-start  w-full">
          <div className="flex flex-col w-full">

            {/* <Label htmlFor="week-filter">Filter By Week</Label> */}
            <Select
              value={weekFilter}
              onValueChange={(value) => {
                setWeekFilter(value);
                applyFiltersAfterChange(value, statusFilter, topicFilter);
              }}
            >
              <SelectTrigger className="cursor-pointer m-2">
                <SelectValue placeholder="Select week..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Filter By Week</SelectItem>
                {uniqueWeeks.map((week) => (
                  <SelectItem key={week} value={week}>
                    {week} 
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
            <div className="flex flex-col w-full">

            
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                applyFiltersAfterChange(weekFilter, value, topicFilter);
              }}
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Filter by Status</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
            <div className="flex flex-col w-full">

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

                {uniqueTopics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
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

                {activeTitles.length > 0 ? (
                  <Select
                    onValueChange={(value) =>
                      setNewReflection((prev) => ({
                        ...prev,
                        topicID: value, // <-- store selected topic ID here
                      }))
                    }
                  >
                    <SelectTrigger id="reflection-title" className="mt-2 w-full">
                      <SelectValue placeholder="Choose a reflection title..." />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {activeTitles.map((topic, index) => (
                        <SelectItem key={index} value={topic.id}>
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
                  <Label htmlFor="reflection-description">Description</Label>
                  <Textarea
                    id="reflection-description"
                    value={newReflection.content}
                    onChange={(e) =>
                    setNewReflection((prev) => ({
                      ...prev,
                      content: e.target.value, // ✅ matches state
                    }))
                  } placeholder="Write your reflection..."
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
                              <span className="truncate text-xs">{file.name}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setNewReflection((prev) => ({
                                    ...prev,
                                    files: prev.files.filter((_, i) => i !== idx),
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
                  className={`flex-1 cursor-pointer ${
                    submissionfetchreflectionsloading ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
                  }`}
                >
                  {submissionfetchreflectionsloading ? "Adding..." : "Add Reflection"}
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
                  {selectedReflection?.title}
                </DialogTitle>
              </DialogHeader>

              {selectedReflection && (
                <div className="space-y-6">
                  {/* Header Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={getStatusBadgeVariant(
                          selectedReflection.status
                        )}
                        className="text-sm"
                      >
                        {selectedReflection.status}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {selectedReflection.date}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Topic and Description */}

                  <div className="text-xl font-semibold text-pink-600">
                    Topic: {selectedReflection.title}
                  </div>

                  {/* Reflection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-cyan-600">
                        My Reflection
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedReflection.content??""}
                      </p>
                    </CardContent>
                  </Card>


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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <a
      href={selectedReflection.attachment_url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 flex items-center gap-3 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      {selectedReflection?.attachment_url && (
  (() => {
    const { cleanedName, extension } = parseAttachmentUrl(selectedReflection.attachment_url);

    return (
      <>
        {getAttachmentIcon(extension)}
        <div className="flex-1">
          <p className="p-2 font-medium text-sm truncate">{cleanedName}</p>
        </div>
      </>
    );
  })()
)}

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
                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{comment.comment}</p>
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
      <div className="bg-pink-500 text-white p-4 mt-8">
        <div className="flex justify-between items-center text-sm">
          <span>© 2025 Barrowford Primary School. All Rights Reserved.</span>
          <span>Developed by Nybble</span>
        </div>
      </div>
    </div>
  );
}
