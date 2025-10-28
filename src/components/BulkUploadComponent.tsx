import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { API_BASE_URL } from "@/constants";

interface UploadProgress {
  uploadId: string;
  status: string;
  totalStudents: number;
  processedStudents: number;
  successCount: number;
  errorCount: number;
  percentage: number;
}

interface RecentStudent {
  rowNumber: number;
  studentName: string;
  status: string;
  message: string;
  processingTime: number;
}

interface BulkUploadComponentProps {
  onComplete?: () => void;
}

const BulkUploadComponent: React.FC<BulkUploadComponentProps> = ({
  onComplete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup SSE connection on unmount
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setUploadError(null);
      } else {
        setUploadError("Please select a CSV file");
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(null);
    setRecentStudents([]);

    try {
      const formData = new FormData();
      formData.append("csvFile", selectedFile);

      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/student-bulk-sse/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Start SSE connection
        const sseUrl = `${API_BASE_URL}/student-bulk-sse/stream/${result.data.uploadId}`;
        const es = new EventSource(sseUrl);

        es.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === "progress") {
              setUploadProgress({
                uploadId: data.data.uploadId,
                status: data.data.status,
                totalStudents: data.data.totalStudents,
                processedStudents: data.data.processedStudents,
                successCount: data.data.successCount,
                errorCount: data.data.errorCount,
                percentage: data.data.percentage,
              });

              if (data.data.recentStudents) {
                setRecentStudents(data.data.recentStudents);
              }
            } else if (data.type === "completed") {
              setUploadProgress((prev) =>
                prev ? { ...prev, status: "completed", percentage: 100 } : null
              );
              setIsUploading(false);
              es.close();
              if (onComplete) {
                onComplete();
              }
            } else if (data.type === "error") {
              setUploadError("Upload failed. Please try again.");
              setIsUploading(false);
              es.close();
            }
          } catch (error) {
            console.error("Error parsing SSE data:", error);
          }
        };

        es.onerror = (error) => {
          console.error("SSE connection error:", error);
          setUploadError("Connection lost. Please refresh and try again.");
          setIsUploading(false);
          es.close();
        };

        setEventSource(es);
      } else {
        setUploadError(result.error || "Upload failed");
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Network error. Please try again.");
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(null);
    setRecentStudents([]);
    setUploadError(null);
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <Upload className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Bulk Student Upload</h2>
            <p className="text-blue-100 mt-1">
              Upload CSV file to import multiple students at once with real-time
              progress tracking
            </p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Upload CSV File
            </h3>
            <p className="text-gray-600 mb-4">
              Select a CSV file containing student data. The file should have
              columns: MIS ID, Forename, Legal Surname, Reg, Year, Primary Email
            </p>
          </div>

          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />

            {selectedFile ? (
              <div className="space-y-2">
                <FileText className="w-12 h-12 text-blue-500 mx-auto" />
                <p className="text-lg font-medium text-gray-800">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-lg font-medium text-gray-600">
                  Click to select CSV file
                </p>
                <p className="text-sm text-gray-500">or drag and drop here</p>
              </div>
            )}

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="mt-4"
              variant="outline"
            >
              {selectedFile ? "Change File" : "Select File"}
            </Button>
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{uploadError}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Start Upload"}
            </Button>

            {(selectedFile || uploadProgress) && (
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={isUploading}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Progress Section */}
      {uploadProgress && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Upload Progress
              </h3>
              <span
                className={`text-sm font-medium ${getStatusColor(
                  uploadProgress.status
                )}`}
              >
                {uploadProgress.status.charAt(0).toUpperCase() +
                  uploadProgress.status.slice(1)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{uploadProgress.percentage}%</span>
              </div>
              <Progress value={uploadProgress.percentage} className="h-2" />
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {uploadProgress.totalStudents}
                </p>
                <p className="text-sm text-blue-800">Total Students</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  {uploadProgress.successCount}
                </p>
                <p className="text-sm text-green-800">Successful</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">
                  {uploadProgress.errorCount}
                </p>
                <p className="text-sm text-red-800">Failed</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-gray-600">
                  {uploadProgress.processedStudents}
                </p>
                <p className="text-sm text-gray-800">Processed</p>
              </div>
            </div>

            {/* Recent Students */}
            {recentStudents.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-gray-800">
                  Recent Students
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {recentStudents.map((student, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {getStatusIcon(student.status)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          Row {student.rowNumber}: {student.studentName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.message}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.processingTime}ms
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default BulkUploadComponent;
