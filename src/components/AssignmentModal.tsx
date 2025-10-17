import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { X, Users, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MultiSelect from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RootState } from "@/store";
import type { User } from "@/types";
import {
  getStudentAssignments,
  assignParentsToStudent,
  assignTeacherToStudent,
  removeTeacherFromStudent,
  clearError,
  clearSuccess,
} from "@/store/slices/userManagementSlice";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: User;
}

interface StudentAssignmentData {
  student: User;
  assignedParents: User[];
  assignedTeacher: User | null;
  availableParents: User[];
  availableTeachers: User[];
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    successMessage,
    isAssigningParent,
    isAssigningTeacher,
  } = useSelector((state: RootState) => state.userManagement);

  const [assignmentData, setAssignmentData] =
    useState<StudentAssignmentData | null>(null);
  const [selectedParents, setSelectedParents] = useState<(string | number)[]>(
    []
  );
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load assignment data when modal opens
  useEffect(() => {
    if (isOpen && student.id) {
      loadAssignmentData();
    }
  }, [isOpen, student.id]);

  // Handle success/error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      loadAssignmentData(); // Reload data after successful assignment
    }
  }, [error, successMessage, dispatch]);

  const loadAssignmentData = async () => {
    setIsLoadingData(true);
    try {
      const result = await dispatch(getStudentAssignments(student.id) as any);
      if (result.payload?.success) {
        setAssignmentData(result.payload.data);
        setSelectedParents(
          result.payload.data.assignedParents.map((p: User) => p.id)
        );
        setSelectedTeacher(
          result.payload.data.assignedTeacher?.id?.toString() || ""
        );
      }
    } catch (err) {
      console.error("Error loading assignment data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleParentAssignment = async () => {
    if (selectedParents.length === 0) {
      toast.error("Please select at least one parent");
      return;
    }

    try {
      await dispatch(
        assignParentsToStudent({
          studentId: student.id,
          parentIds: selectedParents.map((id) => Number(id)),
        }) as any
      );
    } catch (err) {
      console.error("Error assigning parents:", err);
    }
  };

  const handleTeacherAssignment = async () => {
    if (!selectedTeacher) {
      toast.error("Please select a teacher");
      return;
    }

    try {
      await dispatch(
        assignTeacherToStudent({
          studentId: student.id,
          teacherId: Number(selectedTeacher),
        }) as any
      );
    } catch (err) {
      console.error("Error assigning teacher:", err);
    }
  };

  const handleRemoveTeacher = async () => {
    try {
      await dispatch(removeTeacherFromStudent(student.id) as any);
    } catch (err) {
      console.error("Error removing teacher:", err);
    }
  };

  const handleClose = () => {
    setAssignmentData(null);
    setSelectedParents([]);
    setSelectedTeacher("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assign Teachers & Parents
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Student Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <span className="text-sm text-gray-600">Name:</span>
                <p className="font-medium">
                  {student.first_name} {student.last_name}
                </p>
              </div>
            </div>
          </div>

          {isLoadingData ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading assignment data...</span>
            </div>
          ) : assignmentData ? (
            <>
              {/* Parent Assignment Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Parent Assignment</h3>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Parents
                    </label>
                    <MultiSelect
                      options={assignmentData.availableParents.map(
                        (parent) => ({
                          value: parent.id,
                          label: `${parent.first_name} ${parent.last_name} (${parent.email})`,
                        })
                      )}
                      value={selectedParents}
                      onChange={setSelectedParents}
                      placeholder="Select parents..."
                      className="w-full"
                    />
                    {assignmentData.availableParents.length === 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        No available parents found.
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        Currently assigned:{" "}
                        {assignmentData.assignedParents.length} parent(s)
                      </p>
                      {assignmentData.assignedParents.length > 0 && (
                        <div className="mt-1">
                          {assignmentData.assignedParents.map((parent) => (
                            <span
                              key={parent.id}
                              className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                            >
                              {parent.first_name} {parent.last_name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleParentAssignment}
                      disabled={
                        isAssigningParent || selectedParents.length === 0
                      }
                      loading={isAssigningParent}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isAssigningParent
                        ? "Assigning Parents..."
                        : "Assign Parents"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Teacher Assignment Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Teacher Assignment</h3>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  {assignmentData.assignedTeacher ? (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Currently Assigned Teacher
                        </span>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="font-medium">
                          {assignmentData.assignedTeacher.first_name}{" "}
                          {assignmentData.assignedTeacher.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {assignmentData.assignedTeacher.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          Year Group:{" "}
                          {assignmentData.assignedTeacher.year_group_id} |
                          Class: {assignmentData.assignedTeacher.class_id}
                        </p>
                      </div>
                      <Button
                        onClick={handleRemoveTeacher}
                        disabled={isAssigningTeacher}
                        loading={isAssigningTeacher}
                        variant="outline"
                        className="mt-2 text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Remove Teacher
                      </Button>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">
                          No Teacher Assigned
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        This student doesn't have a teacher assigned. Select a
                        teacher from the same year group.
                      </p>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Teacher
                        </label>
                        <Select
                          value={selectedTeacher}
                          onValueChange={setSelectedTeacher}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a teacher..." />
                          </SelectTrigger>
                          <SelectContent>
                            {assignmentData.availableTeachers.map((teacher) => (
                              <SelectItem
                                key={teacher.id}
                                value={teacher.id.toString()}
                              >
                                {teacher.first_name} {teacher.last_name} - Class{" "}
                                {teacher.class_id}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {assignmentData.availableTeachers.length === 0 && (
                          <p className="text-sm text-gray-500 mt-2">
                            No available teachers found for this year group.
                          </p>
                        )}
                      </div>

                      <Button
                        onClick={handleTeacherAssignment}
                        disabled={isAssigningTeacher || !selectedTeacher}
                        loading={isAssigningTeacher}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isAssigningTeacher
                          ? "Assigning Teacher..."
                          : "Assign Teacher"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Failed to load assignment data</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isAssigningParent || isAssigningTeacher}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentModal;
