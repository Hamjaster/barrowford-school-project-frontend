import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CSVFormatInstructions: React.FC = () => {
  const sampleCSVData = `MIS ID,Forename,Legal Surname,Reg,Year,Primary Email
12345,John,Smith,EYFS/Yr 1 O,Year R,john.parent@email.com
,Emma,Johnson,EYFS/Yr 1 O,Year R,emma.parent@email.com
67890,Michael,Brown,EYFS/Yr 1 O,Year R,michael.parent@email.com`;

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCSVData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_students.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          CSV Format Instructions
        </CardTitle>
        <CardDescription>
          Follow these guidelines to ensure successful student imports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Column Requirements */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">
            Required Columns (in exact order):
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <strong>MIS ID:</strong> Student's MIS ID (can be empty for
              auto-generation)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <strong>Forename:</strong> Student's first name
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <strong>Legal Surname:</strong> Student's last name
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <strong>Reg:</strong> Registration/Class info (e.g., "EYFS/Yr 1
              O")
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <strong>Year:</strong> Year group (e.g., "Year R")
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
              <strong>Primary Email:</strong> Parent's email address
            </div>
          </div>
        </div>

        {/* Sample CSV */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-800">Sample CSV Format:</h4>
            <Button
              onClick={downloadSampleCSV}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Sample
            </Button>
          </div>
          <div className="bg-gray-50 border rounded-lg p-3 overflow-x-auto">
            <pre className="text-xs text-gray-700 whitespace-pre">
              {sampleCSVData}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVFormatInstructions;
