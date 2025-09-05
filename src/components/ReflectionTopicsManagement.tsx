"use client";

import { useState } from "react";
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
import { mockReflectionTopics } from "@/constants";

export default function ReflectionTopicsManagement() {
  const [newTopicDialog, setNewTopicDialog] = useState(false);
  const [editTopicDialog, setEditTopicDialog] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any | null>(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reflectionTopics, setReflectionTopics] =
    useState(mockReflectionTopics);

  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const [editTopicTitle, setEditTopicTitle] = useState("");
  const [editTopicDescription, setEditTopicDescription] = useState("");

  const handleCreateTopic = () => {
    if (newTopicTitle.trim()) {
      const newTopic = {
        id: Math.max(...reflectionTopics.map((t) => t.id)) + 1,
        title: newTopicTitle.trim(),
        description: newTopicDescription.trim(),
      };
      setReflectionTopics((prev) => [...prev, newTopic]);
      setNewTopicTitle("");
      setNewTopicDescription("");
      setNewTopicDialog(false);
    }
  };

  const handleUpdateTopic = () => {
    if (editingTopic && editTopicTitle.trim()) {
      setReflectionTopics((prev) =>
        prev.map((topic) =>
          topic.id === editingTopic.id
            ? {
                ...topic,
                title: editTopicTitle.trim(),
                description: editTopicDescription.trim(),
              }
            : topic
        )
      );
      setEditTopicDialog(false);
      setEditingTopic(null);
      setEditTopicTitle("");
      setEditTopicDescription("");
    }
  };

  const handleDeleteTopic = (topicId: number) => {
    setReflectionTopics((prev) => prev.filter((topic) => topic.id !== topicId));
  };

  const handleEditTopic = (topicId: number) => {
    const topic = reflectionTopics.find((topic) => topic.id === topicId)!;
    setEditingTopic(topic);
    setEditTopicTitle(topic.title);
    setEditTopicDescription(topic.description);
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
                  <Button onClick={handleUpdateTopic}>Update</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reflectionTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {topic.description}
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
                      onClick={() => handleDeleteTopic(topic.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
