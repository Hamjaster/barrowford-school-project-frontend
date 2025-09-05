import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  Plus,
  Upload,
  User,
  Video,
} from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CulturalCapitalEntry {
  id: string;
  date: string;
  topic: string;
  status: "Approved" | "Pending" | "Draft";
  week: string;
}

const sampleData: CulturalCapitalEntry[] = [
  {
    id: "1",
    date: "14/10/2025 (Week 2)",
    topic: "Lyfta",
    status: "Approved",
    week: "Week 2",
  },
  {
    id: "2",
    date: "14/10/2025 (Week 2)",
    topic: "Lyfta",
    status: "Approved",
    week: "Week 2",
  },
  {
    id: "3",
    date: "14/10/2025 (Week 2)",
    topic: "Poem of the Week",
    status: "Approved",
    week: "Week 2",
  },
  {
    id: "4",
    date: "15/11/2025 (Week 4)",
    topic: "Artist of the Week",
    status: "Pending",
    week: "Week 4",
  },
  {
    id: "5",
    date: "15/11/2025 (Week 4)",
    topic: "Artist of the Week",
    status: "Pending",
    week: "Week 4",
  },
  {
    id: "6",
    date: "15/11/2025 (Week 4)",
    topic: "Artist of the Week",
    status: "Pending",
    week: "Week 4",
  },
  {
    id: "7",
    date: "15/11/2025 (Week 4)",
    topic: "Artist of the Week",
    status: "Pending",
    week: "Week 4",
  },
  {
    id: "8",
    date: "15/11/2025 (Week 4)",
    topic: "Artist of the Week",
    status: "Pending",
    week: "Week 4",
  },
  {
    id: "9",
    date: "15/11/2025 (Week 4)",
    topic: "Artist of the Week",
    status: "Pending",
    week: "Week 4",
  },
];

export default function CulturalCapitalPage() {
  const [data, setData] = useState(sampleData);
  const [filteredData, setFilteredData] = useState(sampleData);
  const [weekFilter, setWeekFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<string>("");
  const [isNewReflectionOpen, setIsNewReflectionOpen] = useState(false);
  const [selectedReflection, setSelectedReflection] =
    useState<CulturalCapitalEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newReflection, setNewReflection] = useState({
    title: "",
    description: "",
    files: [] as File[],
  });

  const applyFilters = () => {
    let filtered = data;

    if (weekFilter !== "all") {
      filtered = filtered.filter((item) => item.week === weekFilter);
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    if (topicFilter && topicFilter !== "all") {
      filtered = filtered.filter((item) =>
        item.topic.toLowerCase().includes(topicFilter.toLowerCase())
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

  const handleSubmitReflection = () => {
    // Here you would typically submit to your backend
    console.log("New reflection:", newReflection);
    setIsNewReflectionOpen(false);
    setNewReflection({ title: "", description: "", files: [] });
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

  const mockReflection = {
    id: "1",
    date: "14/10/2025 (Week 2)",
    topic: "Lyfta",
    status: "Approved",
    week: "Week 2",
    title: "Exploring Global Perspectives through Lyfta",
    description:
      "An immersive journey exploring different cultures and perspectives around the world using the Lyfta platform.",
    reflection:
      "Through this Lyfta experience, I discovered how different communities around the world approach daily challenges. The 360° videos helped me understand that despite our differences, we share many common values and aspirations. I was particularly moved by the story of the young entrepreneur in Kenya who started a recycling business to help her community.",
    learningOutcomes: [
      "Cultural awareness",
      "Global citizenship",
      "Empathy development",
      "Critical thinking",
    ],
    attachments: [
      {
        name: "lyfta-screenshot.jpg",
        type: "image",
        url: "/placeholder-1nmoh.png",
      },
      { name: "reflection-notes.pdf", type: "document", url: "#" },
    ],
    submittedBy: "Emma Thompson",
    submittedDate: "14/10/2025",
    approvedBy: "Ms. Johnson",
    approvedDate: "15/10/2025",
    feedback:
      "Excellent reflection showing deep understanding of cultural diversity. Well done!",
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
  const handleViewReflection = (reflection: CulturalCapitalEntry) => {
    setSelectedReflection(reflection);
    setIsDetailModalOpen(true);
  };

  const columns = [
    {
      key: "date" as keyof CulturalCapitalEntry,
      header: "Date",
      className: "text-left",
    },
    {
      key: "topic" as keyof CulturalCapitalEntry,
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
          <div className="flex gap-4 items-center justify-start">
            <Select value={weekFilter} onValueChange={setWeekFilter}>
              <SelectTrigger className="">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="">
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
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="">
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

            <Button
              onClick={applyFilters}
              className="bg-pink-500 hover:bg-pink-600 text-white 6"
            >
              Filter
            </Button>
          </div>
          {/* Create new reflection */}
          <Dialog
            open={isNewReflectionOpen}
            onOpenChange={setIsNewReflectionOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6">
                <Lightbulb className="w-4 h-4 mr-2" />
                New Reflection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Reflection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reflection-title">Title</Label>
                  <Input
                    id="reflection-title"
                    value={newReflection.title}
                    onChange={(e) =>
                      setNewReflection((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter reflection title..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="reflection-description">Description</Label>
                  <Textarea
                    id="reflection-description"
                    value={newReflection.description}
                    onChange={(e) =>
                      setNewReflection((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Write your reflection..."
                    className="mt-1 min-h-[100px]"
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
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("reflection-files")?.click()
                      }
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                    {newReflection.files.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        {newReflection.files.length} file(s) selected
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsNewReflectionOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitReflection}
                    className="flex-1 bg-pink-500 hover:bg-pink-600"
                  >
                    Add Reflection
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        Emma Doe
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Topic and Description */}

                  <div className="text-xl font-semibold text-pink-600">
                    Topic: {selectedReflection.topic}
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
                        {mockReflection.reflection}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Attachments */}
                  {mockReflection.attachments.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-cyan-600">
                          Attachments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {mockReflection.attachments.map(
                            (attachment, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                              >
                                {getAttachmentIcon(attachment.type)}
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs text-gray-500 capitalize">
                                    {attachment.type}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Approval Info */}
                  {selectedReflection.status === "Approved" &&
                    mockReflection.approvedBy && (
                      <Card className="bg-green-50 border-green-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-green-700">
                            Approval Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Approved by:</span>{" "}
                              {mockReflection.approvedBy}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Approved on:</span>{" "}
                              {mockReflection.approvedDate}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

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

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <DataTable
            data={filteredData}
            columns={columns}
            showPagination={true}
            itemsPerPage={9}
          />
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
