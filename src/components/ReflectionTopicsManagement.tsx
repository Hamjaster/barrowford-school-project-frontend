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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Button } from "./ui/button";
import { Plus, Edit3, Trash2 } from "lucide-react";
// API handling
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  createTopic,
  fetchAllTopics,
  updateTopic,
  deleteTopic,
} from "@/store/slices/reflectionSlice";
import type { RootState, AppDispatch } from "@/store";
import type { ReflectionTopic } from "@/types";
import DeleteConfirmationDialog from "./ui/DeleteConfirmationDialogProps";
import { toast } from "sonner";
export default function ReflectionTopicsManagement() {
  const [newTopicDialog, setNewTopicDialog] = useState(false);
  const [editTopicDialog, setEditTopicDialog] = useState(false);
  const [editingTopic, setEditingTopic] = useState<ReflectionTopic | null>(
    null
  );
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [editTopicTitle, setEditTopicTitle] = useState("");
  const [editTopicIsActive, setEditTopicIsActive] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null);

  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const { topics, loading, error } = useSelector(
    (state: RootState) => state.reflection
  );

  const handleCreateTopic = () => {
    if (newTopicTitle.trim()) {
      dispatch(createTopic({ title: newTopicTitle }));
      setNewTopicTitle("");
      setNewTopicDialog(false);
    }
  };

  useEffect(() => {
    dispatch(fetchAllTopics());
  }, [dispatch]);

  const handleUpdateTopic = () => {
    if (!editingTopic) return;

    dispatch(
      updateTopic({
        id: editingTopic.id.toString(),
        title: editTopicTitle,
        is_active: editTopicIsActive,
      })
    );

    setEditTopicDialog(false);
    setEditingTopic(null);
    setEditTopicTitle("");
    setEditTopicIsActive(true);
  };

  const handleDeleteClick = (topicId: string) => {
    setTopicToDelete(topicId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (topicToDelete) {
      dispatch(deleteTopic(topicToDelete));
      setTopicToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleEditTopic = (topicId: number) => {
    const topic = topics.find((topic) => topic.id === topicId);
    if (topic) {
      setEditingTopic(topic);
      setEditTopicTitle(topic.title);
      setEditTopicIsActive(topic.is_active);
      setEditTopicDialog(true);
    }
  };

  const handleCloseNewTopicDialog = () => {
    setNewTopicDialog(false);
    setNewTopicTitle("");
  };

  const handleCloseEditTopicDialog = () => {
    setEditTopicDialog(false);
    setEditingTopic(null);
    setEditTopicTitle("");
    setEditTopicIsActive(true);
  };

  // show error toast message
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error]);

  return (
    <div>
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Reflection Topics</CardTitle>
              <CardDescription>
                Manage topics that students can reflect on
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
                  <DialogTitle>Create New Reflection Topic</DialogTitle>
                  <DialogDescription>
                    Add a new topic for students to reflect on
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
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseNewTopicDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTopic}>Create Topic</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Topic Dialog */}
            <Dialog open={editTopicDialog} onOpenChange={setEditTopicDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Reflection Topic</DialogTitle>
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
                    <Label className="mb-2" htmlFor="edit-topic-status">
                      Status
                    </Label>
                    <Select
                      value={editTopicIsActive.toString().toLowerCase()}
                      onValueChange={(value) =>
                        setEditTopicIsActive(value === "true")
                      }
                    >
                      <SelectTrigger id="edit-topic-status" className="w-full">
                        <SelectValue placeholder="Choose status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={handleCloseEditTopicDialog}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateTopic}>Update</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Status:{" "}
                        {topic.is_active === true ? "Active" : "Inactive"} •
                        Created:{" "}
                        {new Date(topic.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTopic(topic.id)}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(topic.id.toString())}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Topic"
        description="Are you sure you want to delete this topic? This action cannot be undone and will affect all reflections using this topic."
      />
    </div>
  );
}
