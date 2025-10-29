import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  History,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Plus,
  FileText,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/constants";
import type { RootState } from "@/store";
import BulkUploadComponent from "@/components/BulkUploadComponent";
import CSVFormatInstructions from "@/components/CSVFormatInstructions";
import { toast } from "sonner";

interface UploadSession {
  id: string;
  upload_id: string;
  user_id: number;
  status: "processing" | "completed" | "error";
  total_students: number;
  processed_students: number;
  success_count: number;
  error_count: number;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

interface SessionLog {
  id: string;
  session_id: string;
  upload_id: string;
  student_row_number: number;
  student_name?: string;
  student_mis_id?: string;
  status: "success" | "error" | "skipped";
  success_message?: string;
  message?: string;
  error_message?: string;
  student_id?: number;
  parent_id?: number;
  processing_time_ms?: number;
  created_at: string;
}

const BulkUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [sessions, setSessions] = useState<UploadSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<UploadSession | null>(
    null
  );
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const accessToken = localStorage.getItem("auth_token");
      const response = await fetch(
        `${API_BASE_URL}/student-bulk-sse/sessions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        setSessions(data.data.sessions || []);
      } else {
        toast.error("Failed to fetch upload sessions");
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Network error while fetching sessions");
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionLogs = async (uploadId: string) => {
    try {
      const accessToken = localStorage.getItem("auth_token");
      const response = await fetch(
        `${API_BASE_URL}/student-bulk-sse/session/${uploadId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSessionLogs(data.data.logs || []);
        setShowLogs(true);
      } else {
        toast.error("Failed to fetch session logs");
      }
    } catch (error) {
      console.error("Error fetching session logs:", error);
      toast.error("Network error while fetching logs");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "error":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateSuccessRate = (session: UploadSession) => {
    if (session.total_students === 0) return 0;
    return Math.round((session.success_count / session.total_students) * 100);
  };

  const handleViewLogs = (session: UploadSession) => {
    setSelectedSession(session);
    fetchSessionLogs(session.upload_id);
  };

  const handleNewUpload = () => {
    setShowUploadForm(true);
  };

  const handleUploadComplete = () => {
    setShowUploadForm(false);
    fetchSessions(); // Refresh sessions list
  };

  const handleBackToSessions = () => {
    setShowUploadForm(false);
    setShowLogs(false);
    setSelectedSession(null);
    setSessionLogs([]);
  };

  if (showUploadForm) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Button onClick={handleBackToSessions} variant="outline">
            ← Back to Sessions
          </Button>
        </div>
        <BulkUploadComponent onComplete={handleUploadComplete} />
        <CSVFormatInstructions />
      </div>
    );
  }

  if (showLogs && selectedSession) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Session Details
            </h1>
            <p className="text-gray-600 mt-1">
              Upload ID: {selectedSession.upload_id}
            </p>
          </div>
          <Button onClick={handleBackToSessions} variant="outline">
            ← Back to Sessions
          </Button>
        </div>

        {/* Processing Status Message */}
        {selectedSession.status === "processing" && (
          <p className="text-gray-500 text-sm text-center py-2">
            Please refresh to check the updated rows added/uploaded
          </p>
        )}

        {/* Session Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Session Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {selectedSession.total_students}
                </p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {selectedSession.success_count}
                </p>
                <p className="text-sm text-gray-600">Successful</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {selectedSession.error_count}
                </p>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {calculateSuccessRate(selectedSession)}%
                </p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Student Processing Logs
            </CardTitle>
            <CardDescription>
              Detailed logs for each student processed in this session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sessionLogs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {getStatusIcon(log.status)}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      Row {log.student_row_number}:{" "}
                      {log.student_name || "Unknown Student"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {log.message || log.error_message || "No message"}
                    </p>
                    {log.student_mis_id && (
                      <p className="text-xs text-gray-500">
                        MIS ID: {log.student_mis_id}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={getStatusColor(log.status)}
                    >
                      {log.status}
                    </Badge>
                    {log.processing_time_ms && (
                      <p className="text-xs text-gray-500 mt-1">
                        {log.processing_time_ms}ms
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Upload className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Bulk Student Upload</h1>
              <p className="text-blue-100 mt-1">
                Manage CSV uploads and view processing history
              </p>
            </div>
          </div>
          <Button
            onClick={handleNewUpload}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Upload
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.length}
                </p>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.reduce(
                    (sum, session) => sum + session.success_count,
                    0
                  )}
                </p>
                <p className="text-sm text-gray-600">Students Imported</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.length > 0
                    ? Math.round(
                        sessions.reduce(
                          (sum, session) => sum + calculateSuccessRate(session),
                          0
                        ) / sessions.length
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-gray-600">Avg Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter((s) => s.status === "processing").length}
                </p>
                <p className="text-sm text-gray-600">Active Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Upload Sessions
          </CardTitle>
          <CardDescription>
            View and manage your previous CSV upload sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Upload Sessions
              </h3>
              <p className="text-gray-600 mb-4">
                You haven't uploaded any CSV files yet.
              </p>
              <Button
                onClick={handleNewUpload}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Your First Upload
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(session.status)}
                        <Badge
                          variant="outline"
                          className={getStatusColor(session.status)}
                        >
                          {session.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {formatDate(session.started_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-blue-600 font-medium">
                            {session.total_students} total
                          </span>
                          <span className="text-green-600 font-medium">
                            {session.success_count} success
                          </span>
                          <span className="text-red-600 font-medium">
                            {session.error_count} failed
                          </span>
                          <span className="text-purple-600 font-medium">
                            {calculateSuccessRate(session)}% rate
                          </span>
                        </div>
                        {session.completed_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Completed: {formatDate(session.completed_at)}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleViewLogs(session)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Logs
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkUploadPage;
