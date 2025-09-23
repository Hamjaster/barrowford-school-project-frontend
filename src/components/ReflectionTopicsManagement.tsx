"use client";

import { useState,useEffect } from "react";
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
import { Eye, MessageSquare, View } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { mockReflectionTopics } from "@/constants";
import TeacherReflectionDialog from "./TeacherReflectionDialog";
  //for api handling 
import { useDispatch, useSelector } from "react-redux";
import { createTopic,fetchAllReflections,updateReflection,addComment,fetchComments, deleteReflection 
 } from "@/store/slices/reflectionSlice";
import type { RootState, AppDispatch } from "@/store";
import type { ReflectionItem } from "@/types";
import DeleteConfirmationDialog from "./ui/DeleteConfirmationDialogProps";

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
  const [editTopicFileUrl, setEditTopicFileUrl] = useState<string|null>(null);
  const [status, setStatus] = useState<string>("");
  const [editingID,setEditingID]= useState<string>()
  const [comment , setComment] = useState(false)
  const [commentText, setCommentText] = useState("");

  //reflectiosn dialog box 
  const [isDialogOpen,setIsDialogOpen] = useState(false);
  const [selectedReflection,setSelectedReflection] = useState<ReflectionItem |  null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reflectionToDelete, setReflectionToDelete] = useState<string | null>(null);



  //dispatch
  const dispatch = useDispatch<AppDispatch>();
  const { reflections,comments,loading, error, topics } = useSelector(
    (state: RootState) => state.reflection
  );


  const handleCreateTopic = () => {
    if (newTopicTitle.trim()) {
      // const newTopic = {
      //   id: Math.max(...reflectionTopics.map((t) => t.id)) + 1,
      //   title: newTopicTitle.trim(),
      //   description: newTopicDescription.trim(),
      // };
      // setReflectionTopics((prev) => [...prev, newTopic]);
       dispatch(createTopic( {title : newTopicTitle }));

      setNewTopicTitle("");
      setNewTopicDialog(false);
    }
  };
   useEffect(() => {
    dispatch(fetchAllReflections());
  }, [dispatch]);

  const handleUpdateTopic = () => {
    if (!editingID) return;
   dispatch(updateReflection({ 
  id: editingID,
  content: editTopicDescription, 
  status 
}));

      setEditTopicDialog(false);
      setEditingTopic(null);
      setEditTopicTitle("");
      setEditTopicDescription("");
      setStatus("pending")
    
  };

  // const handleDeleteTopic = (topicId: string) => {
  //   // setReflectionTopics((prev) => prev.filter((topic) => topic.id !== topicId));
  //   dispatch(deleteReflection(topicId as string))
  // };
  const handleDeleteClick = (reflectionId: string) => {
  setReflectionToDelete(reflectionId);
  setDeleteDialogOpen(true);
};

const handleConfirmDelete = () => {
  if (reflectionToDelete) {
    dispatch(deleteReflection(reflectionToDelete));
    setReflectionToDelete(null);
  }
};

const handleSaveComment = (commentText : string) => {
  if (!commentText.trim()) return;
  dispatch(addComment({ reflectionId: editingID!, content: commentText }));
  setCommentText("");
  setComment(false);
};

const handleEditTopic = (topicId: string) => {
     
    const topic = reflections.find((topic) => topic.id === topicId)!;
    if(topic){
      setEditingID(topic.id)
      setEditingTopic(topic);
      setEditTopicTitle(topic.reflectiontopics.title);
      setEditTopicDescription(topic.content);
      setEditTopicFileUrl(topic.attachment_url ?? "")// Cloudinary secure_url
      setStatus(topic.status)
     
      

    setEditTopicDialog(true);
  }
}
const displayReflections = (topicId:string)=>{
  const topic = reflections.find((topic) => topic.id === topicId)!;
  if(topic){
    setSelectedReflection(topic)
    setEditingID(topic.id)
    dispatch(fetchComments(topicId))
  }
  setIsDialogOpen(true)
}

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
                      disabled
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
                <div>
                    <Label className="mb-2" htmlFor="updateStatus">
                      Update Status
                    </Label>
                    <Select
                      value={status}
                      onValueChange={setStatus}
                    >
                      <SelectTrigger id="updateStatus" className="w-full">
                        <SelectValue placeholder="Choose status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

              {editTopicFileUrl && (
                <div className="mt-4">
                  <Label className="mb-2">Attached File</Label>
                  <div className="flex items-center space-x-2">
                   

                 <div className="flex justify-between items-center w-full mt-4">
                {/* Open in new tab */}
                <Button
                  variant="link"
                  className="p-0 text-blue-600"
                  onClick={() => window.open(editTopicFileUrl ?? "", "_blank")}
                >
                  View Image
                </Button> 
              </div>

                  </div>
                </div>
              )}
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
      {reflections.map((topic) => (
        <div
          key={topic.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <h3 className="font-semibold">{topic.reflectiontopics.title}</h3>
            <p className="text-sm text-muted-foreground">{topic.content}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => displayReflections(topic.id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
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
              onClick={() => handleDeleteClick(topic.id)}
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
      
      <TeacherReflectionDialog
    reflection={selectedReflection}
    comments={comments}
    isOpen={isDialogOpen}
    onClose={() => setIsDialogOpen(false)}
    onAddComment={handleSaveComment}
  />
  <DeleteConfirmationDialog
  isOpen={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  onConfirm={handleConfirmDelete}
  title="Delete Reflection"
  description="Are you sure you want to delete this reflection and all associated comments? This action cannot be undone."
/>



    </div>
    
    
  );
}
