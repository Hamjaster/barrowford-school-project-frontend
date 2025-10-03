"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import AttachmentDisplay from "./AttachmentDisplay";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Edit3, Save, Loader2, MessageSquare, Send, UserCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { API_BASE_URL } from "@/constants";
import {
  fetchReflectionsByStudentId,
  addComment,
} from "@/store/slices/reflectionSlice";
import type { ReflectionItem, ReflectionComment } from "@/types";
import { uploadFileToSupabase } from "@/utils/fileUpload"; // your utils file
import { toast } from "sonner";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  year_group_id: number;
  class_id: number;
  class_name: string;
  created_at: string;
  profile_photo: string;
}

interface PersonalSection {
  id: number;
  content: string;
  created_at: string;
  topic: {
    id: number;
    title: string;
  };
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [personalSections, setPersonalSections] = useState<PersonalSection[]>(
    []
  );
  const [studentReflections, setStudentReflections] = useState<
    ReflectionItem[]
  >([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"personal" | "reflections" | "details">("personal");

  const [loading, setLoading] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [reflectionsLoading, setReflectionsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<{
    [key: number]: string;
  }>({});
  const [newComment, setNewComment] = useState<{
    [key: number]: string;
  }>({});
  const [commentLoading, setCommentLoading] = useState<number | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  // Fetch assigned students
  const fetchStudents = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/teacher/getStudents`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const result = await response.json();
      console.log("fetchedstudents...", result.data)
      setStudents(result.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  // Fetch personal sections for a student
  const fetchPersonalSections = async (studentId: number) => {
    if (!token) return;

    setSectionsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/personalSection/student/${studentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch personal sections");
      }

      const result = await response.json();
      setPersonalSections(result.data);

      // Initialize editing content
      const initialContent: { [key: number]: string } = {};
      result.data.forEach((section: PersonalSection) => {
        initialContent[section.id] = section.content;
      });
      setEditingContent(initialContent);
    } catch (err: any) {
      setError(err.message || "Failed to fetch personal sections");
    } finally {
      setSectionsLoading(false);
    }
  };

  // Update personal section content
  const updatePersonalSection = async (sectionId: number, content: string) => {
    if (!token) return;

    setUpdateLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/personalSection/teacher/${sectionId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update personal section");
      }

      const result = await response.json();

      // Update the local state
      setPersonalSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? { ...section, content: result.data.content }
            : section
        )
      );

      setSelectedCard(null);
    } catch (err: any) {
      setError(err.message || "Failed to update personal section");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleOpenDialog = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab("details");
    fetchPersonalSections(student.id);
  };

  const handleTabChange = (tab: "details" | "personal" | "reflections") => {
    setActiveTab(tab);
    if (tab === "reflections" && selectedStudent) {
      fetchStudentReflections(selectedStudent.id);
    }
    if (tab === "details" && selectedStudent) {
      // e.g., fetch additional student profile info if needed
      // fetchStudentDetails(selectedStudent.id);
    }
  };

  const handleSaveSection = (sectionId: number) => {
    const content = editingContent[sectionId];
    if (content && content.trim()) {
      updatePersonalSection(sectionId, content);
    }
  };

  const handleContentChange = (sectionId: number, content: string) => {
    setEditingContent((prev) => ({
      ...prev,
      [sectionId]: content,
    }));
  };

  // Fetch student reflections
  const fetchStudentReflections = async (studentId: number) => {
    if (!token) return;

    setReflectionsLoading(true);

    try {
      const resultAction = await dispatch(
        fetchReflectionsByStudentId(studentId)
      );
      if (fetchReflectionsByStudentId.fulfilled.match(resultAction)) {
        // Ensure each reflection has a reflectioncomments array
        const reflectionsWithComments = resultAction.payload.map(
          (reflection) => ({
            ...reflection,
            reflectioncomments: reflection.reflectioncomments || [],
          })
        );
        setStudentReflections(reflectionsWithComments);
      } else {
        setError("Failed to fetch reflections");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch reflections");
    } finally {
      setReflectionsLoading(false);
    }
  };

  // Add comment to reflection
  const addReflectionComment = async (
    reflectionId: number,
    content: string
  ) => {
    if (!token || !content.trim()) return;

    setCommentLoading(reflectionId);

    try {
      const newComment = await dispatch(
        addComment({ reflectionId: reflectionId, content })
      ).unwrap();

      // Update local studentReflections state with the new comment
      setStudentReflections((prev) =>
        prev.map((reflection) =>
          reflection.id === reflectionId
            ? {
              ...reflection,
              reflectioncomments: [
                ...(reflection.reflectioncomments || []),
                newComment.data,
              ],
            }
            : reflection
        )
      );

      // Clear the comment input
      setNewComment((prev) => ({
        ...prev,
        [reflectionId]: "",
      }));
    } catch (err: any) {
      setError(err.message || "Failed to add comment");
    } finally {
      setCommentLoading(null);
    }
  };

  const handleCommentChange = (reflectionId: number, content: string) => {
    setNewComment((prev) => ({
      ...prev,
      [reflectionId]: content,
    }));
  };


  const handleProfilePhotoUpload = async (studentId: number, file: File) => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      // ✅ 1. Upload file to Supabase directly
      const uploadResult = await uploadFileToSupabase(
        file,
        "barrowford-school-uploads",
        studentId.toString()
      );

      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || "Failed to upload file");
      }

      // ✅ 2. Send the URL to your backend to update student record
      const response = await fetch(`${API_BASE_URL}/teacher/update-profile-photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          profilePhotoUrl: uploadResult.url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile photo");
      }

      const result = await response.json();
      console.log("Profile photo updated:", result);
      toast.success("Profile photo updated successfully")
      // ✅ 3. Refresh list or update local state
      await fetchStudents();
    } catch (err: any) {
      console.error("Profile photo upload error:", err);
      setError(err.message || "Failed to upload profile photo");

    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchStudents();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>
            View and edit student information, personal sections, and
            reflections
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">

                  {student.profile_photo ? (
                    <img
                      src={student.profile_photo}
                      alt={`${student.first_name} ${student.last_name}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-300 transition-colors"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full border-2 border-black-600 group-hover:border-blue-300 transition-colors">
                      <UserCircle className="w-12 h-12" />
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold">
                      {student.first_name} {student.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {student.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => handleOpenDialog(student)}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Manage Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="min-w-6xl max-h-[88vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle>
                          Student Management - {student.first_name}{" "}
                          {student.last_name}
                        </DialogTitle>
                        <DialogDescription>
                          Manage the student's personal sections and reflections
                        </DialogDescription>
                      </DialogHeader>

                      <div className="w-full">
                        <div className="flex border-b mb-4">
                          <Button
                            variant={activeTab === "details" ? "default" : "ghost"} // 🆕
                            onClick={() => handleTabChange("details")} // 🆕
                            className="rounded-none border-b-2 border-transparent" // 🆕
                          >
                            Personal Details
                          </Button>
                          <Button
                            variant={
                              activeTab === "personal" ? "default" : "ghost"
                            }
                            onClick={() => handleTabChange("personal")}
                            className="rounded-none border-b-2 border-transparent"
                          >
                            Personal Sections
                          </Button>
                          <Button
                            variant={
                              activeTab === "reflections" ? "default" : "ghost"
                            }
                            onClick={() => handleTabChange("reflections")}
                            className="rounded-none border-b-2 border-transparent"
                          >
                            Reflections
                          </Button>

                        </div>
                        {activeTab === "details" && selectedStudent && (
                          <div className="space-y-6 max-h-96 overflow-y-auto p-3 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">Personal Information</h3>

                            {/* Profile Photo Section */}
                            <div className="flex flex-col items-center space-y-3">


                              {/* Editable upload input */}
                              <div className="flex flex-col items-center space-y-3">
                                  {selectedStudent.profile_photo ? (
                                      <img
                                      src={student.profile_photo}
                                      alt={`${student.first_name} ${student.last_name}`}
                                      className="w-16 h-16 rounded-full object-cover border-2 border-black-100 group-hover:border-blue-300 transition-colors"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full border-2 border-black-600 group-hover:border-blue-300 transition-colors">
                                      <UserCircle className="w-12 h-12" />
                                    </div>
                                  )}
                                

                                {/* Hidden file input */}
                                <input
                                  type="file"
                                  id="profilePhotoInput"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      await handleProfilePhotoUpload(selectedStudent.id, file);
                                    }
                                  }}
                                />

                                {/* Clickable text to trigger upload */}
                                <button
                                  type="button"
                                  onClick={() => document.getElementById("profilePhotoInput")?.click()}
                                  className="text-sm text-blue-600 cursor-pointer"
                                >
                                  Edit Profile Photo
                                </button>
                              </div>

                            </div>

                            {/* Non-editable fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-3">
                              <div>
                                <Label className="mb-2">First Name</Label>
                                <Input value={selectedStudent.first_name} disabled />
                              </div>
                              <div>
                                <Label className="mb-2">Last Name</Label>
                                <Input value={selectedStudent.last_name} disabled />
                              </div>
                              <div>
                                <Label className="mb-2">Email</Label>
                                <Input value={selectedStudent.email} disabled />
                              </div>

                              <div>
                                <Label className="mb-2">Class Name</Label>
                                <Input value={selectedStudent.class_name} disabled />
                              </div>

                            </div>
                          </div>
                        )}


                        {activeTab === "personal" && (
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {sectionsLoading ? (
                              <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                              </div>
                            ) : personalSections.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground">
                                <p>
                                  No personal sections found for this student.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {personalSections.map((section) => (
                                  <div
                                    key={section.id}
                                    className={`p-4 border rounded-lg space-y-2 cursor-pointer transition-colors ${selectedCard === section.id
                                      ? "border-blue-300 bg-blue-50"
                                      : "hover:border-gray-300"
                                      }`}
                                    onClick={() => setSelectedCard(section.id)}
                                  >
                                    <Label htmlFor={`topic-${section.id}`}>
                                      Topic
                                    </Label>
                                    <Input
                                      id={`topic-${section.id}`}
                                      value={section.topic.title}
                                      disabled
                                      className="bg-gray-50"
                                    />
                                    <Label htmlFor={`content-${section.id}`}>
                                      Content
                                    </Label>
                                    <Textarea
                                      id={`content-${section.id}`}
                                      value={editingContent[section.id] || ""}
                                      onChange={(e) =>
                                        handleContentChange(
                                          section.id,
                                          e.target.value
                                        )
                                      }
                                      rows={4}
                                      placeholder="Enter content for this section..."
                                    />
                                    {selectedCard === section.id && (
                                      <div className="flex justify-end gap-2 pt-2">
                                        <Button
                                          className="cursor-pointer"
                                          onClick={() =>
                                            handleSaveSection(section.id)
                                          }
                                          disabled={updateLoading}
                                        >
                                          {updateLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                          ) : (
                                            <Save className="h-4 w-4 mr-2" />
                                          )}
                                          Save Changes
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab === "reflections" && (
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {reflectionsLoading ? (
                              <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                              </div>
                            ) : studentReflections.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground">
                                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p>No reflections found for this student.</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {studentReflections.map((reflection) => (
                                  <div
                                    key={reflection.id}
                                    className="p-4 border rounded-lg space-y-3"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h4 className="font-semibold text-sm">
                                          {reflection.reflectiontopics.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                          {new Date(
                                            reflection.created_at
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <Badge
                                        variant={
                                          reflection.status === "approved"
                                            ? "default"
                                            : reflection.status === "rejected"
                                              ? "destructive"
                                              : "secondary"
                                        }
                                      >
                                        {reflection.status}
                                      </Badge>
                                    </div>

                                    <div className="text-sm bg-gray-50 p-3 rounded-lg">
                                      {reflection.content}
                                    </div>

                                    {reflection.attachment_url && (
                                      <div className="flex justify-center">
                                        <AttachmentDisplay
                                          url={reflection.attachment_url}
                                          alt="Reflection attachment"
                                          maxHeight="h-48"
                                          maxWidth="max-w-full"
                                        />
                                      </div>
                                    )}

                                    {/* Comments Section */}
                                    <div className="border-t pt-3">
                                      <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        Comments (
                                        {reflection.reflectioncomments.length})
                                      </div>

                                      {/* Display Comments */}
                                      {reflection.reflectioncomments &&
                                        reflection.reflectioncomments.length >
                                        0 && (
                                          <div className="space-y-2 mb-3">
                                            {reflection.reflectioncomments.map(
                                              (comment: ReflectionComment) => (
                                                <div
                                                  key={comment.id}
                                                  className="bg-blue-50 p-2 rounded text-xs"
                                                >
                                                  <div className="flex justify-between items-start">
                                                    <span className="font-medium text-blue-800">
                                                      {comment.user_name} (
                                                      {comment.user_role.toLowerCase()}
                                                      )
                                                    </span>
                                                    <span className="text-blue-600">
                                                      {new Date(
                                                        comment.created_at
                                                      ).toLocaleDateString()}
                                                    </span>
                                                  </div>
                                                  <p className="text-blue-700 mt-1">
                                                    {comment.comment}
                                                  </p>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}

                                      {/* Add Comment */}
                                      <div className="space-y-2">
                                        <Textarea
                                          placeholder="Add a comment..."
                                          value={
                                            newComment[reflection.id] || ""
                                          }
                                          onChange={(e) =>
                                            handleCommentChange(
                                              reflection.id,
                                              e.target.value
                                            )
                                          }
                                          rows={2}
                                          className="text-sm"
                                        />
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            addReflectionComment(
                                              reflection.id,
                                              newComment[reflection.id] || ""
                                            )
                                          }
                                          loading={
                                            commentLoading === reflection.id
                                          }
                                          disabled={
                                            commentLoading === reflection.id ||
                                            !newComment[reflection.id]?.trim()
                                          }
                                          className="h-8"
                                        >
                                          <Send className="h-3 w-3 mr-1" />
                                          Add Comment
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}

            {students.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No students assigned to you.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
