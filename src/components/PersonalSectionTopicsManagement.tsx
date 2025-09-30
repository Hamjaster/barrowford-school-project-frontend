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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} from "@/store/slices/personalSectionSlice";
import type { RootState, AppDispatch } from "@/store";
import { toast } from "sonner";
import DeleteConfirmationDialog from "./ui/DeleteConfirmationDialogProps";

export default function PersonalSectionTopicsManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    topics,
    loading,
    error,
    addTopicLoading,
    updateTopicLoading,
    deleteTopicLoading,
  } = useSelector((state: RootState) => state.personalSection);

  const [newTopicDialog, setNewTopicDialog] = useState(false);
  const [editTopicDialog, setEditTopicDialog] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any | null>(null);
  const [deletingTopicId, setDeletingTopicId] = useState<null | number>(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const [editTopicTitle, setEditTopicTitle] = useState("");
  const [editTopicDescription, setEditTopicDescription] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<number | null>(null);
  // Fetch topics on component mount
  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  const handleCreateTopic = async () => {

    if (newTopicTitle.trim()) {
      try {
        await dispatch(
          createTopic({
            title: newTopicTitle.trim(),
            description: newTopicDescription.trim() || undefined,
          })
        ).unwrap();
        toast.success("Topic created successfully!");
        setNewTopicTitle("");
        setNewTopicDescription("");
        setNewTopicDialog(false);
      } catch (error) {
        console.error("Failed to create topic:", error);
        toast.error("Failed to create topic")
      }
    }
  };

  const handleUpdateTopic = async () => {
    if (editingTopic && editTopicTitle.trim()) {
      console.log("desc", editTopicDescription)
      try {
        await dispatch(
          updateTopic({
            id: editingTopic.id,
            title: editTopicTitle.trim(),
            description: editTopicDescription.trim() || undefined,
          })
        ).unwrap();
        toast.success("Topic Updated Successfully")
        setEditTopicDialog(false);
        setEditingTopic(null);
        setEditTopicTitle("");
        setEditTopicDescription("");
      } catch (error) {
        console.error("Failed to update topic:", error);
        toast.error("Failed to update topic")
      }
    }
  };
  const handleDeleteClick = (topicId: number) => {
    setTopicToDelete(topicId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTopic = async () => {
    if (!topicToDelete) return;

    try {
      setDeletingTopicId(topicToDelete);
      await dispatch(deleteTopic({ id: topicToDelete })).unwrap();
      toast.success("Topic deleted successfully!");
    } catch (error) {
      console.error("Failed to delete topic:", error);
      toast.error("Failed to delete topic");
    } finally {
      setDeletingTopicId(null);
      setTopicToDelete(null);
      setDeleteDialogOpen(false);
    }
  };


  const handleEditTopic = (topic: any) => {
    setEditingTopic(topic);
    setEditTopicTitle(topic.title);
    setEditTopicDescription(topic.description || "");
    setEditTopicDialog(true);
  };

  const handleCloseNewTopicDialog = () => {
    setNewTopicDialog(false);
    setNewTopicTitle("");
    setNewTopicDescription("");
  };

  const handleCloseEditTopicDialog = () => {
    setEditTopicDialog(false);
    setEditingTopic(null);
    setEditTopicTitle("");
    setEditTopicDescription("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading topics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading topics: {error}</p>
          <Button onClick={() => dispatch(fetchTopics())}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Personal Section Topics</CardTitle>
              <CardDescription>
                Manage topics that students can write about in their personal
                sections
              </CardDescription>
            </div>
            {/* Add Topic Dialog */}
            <Dialog open={newTopicDialog} onOpenChange={setNewTopicDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Topic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Personal Section Topic</DialogTitle>
                  <DialogDescription>
                    Add a new topic for students to write about
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="topic-title" className="mb-2">
                      Topic Title
                    </Label>
                    <Input
                      id="topic-title"
                      placeholder="Enter topic title"
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="topic-description">
                      Description
                    </Label>
                    <Textarea
                      id="topic-description"
                      placeholder="Provide guidance for students"
                      rows={3}
                      value={newTopicDescription}
                      onChange={(e) => setNewTopicDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseNewTopicDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTopic}
                    disabled={!newTopicTitle.trim() || addTopicLoading}
                    loading={addTopicLoading}
                  >
                    Create Topic
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Topic Dialog */}
            <Dialog open={editTopicDialog} onOpenChange={setEditTopicDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Personal Section Topic</DialogTitle>
                  <DialogDescription>
                    Update the topic details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-topic-title" className="mb-2">
                      Topic Title
                    </Label>
                    <Input
                      value={editTopicTitle}
                      onChange={(e) => setEditTopicTitle(e.target.value)}
                      id="edit-topic-title"
                      placeholder="Enter topic title"
                    />
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="edit-topic-description">
                      Description
                    </Label>
                    <Textarea
                      value={editTopicDescription}
                      onChange={(e) => setEditTopicDescription(e.target.value)}
                      id="edit-topic-description"
                      placeholder="Provide guidance for students"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={handleCloseEditTopicDialog}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateTopic}
                    disabled={!editTopicTitle.trim()}
                    loading={updateTopicLoading}
                  >
                    Update
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topics.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No topics found. Create your first topic to get started.
                </div>
              ) : (
                topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {topic.description || "No description provided"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Created:{" "}
                        {new Date(topic.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTopic(topic)}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(topic.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteTopic}
        title="Delete Topic"
        description="Are you sure you want to delete this topic? This action cannot be undone."
      />
    </div>

  );
}
