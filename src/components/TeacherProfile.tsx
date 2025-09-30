"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Loader2, User, Mail, Calendar, GraduationCap, Users, BookOpen, Building, UserCircle } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { API_BASE_URL } from "@/constants";

interface Teacher {
    id: number;
    year_group_id: number;
    class_id: number;
    created_at: string;
    auth_user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    status: string;
    class_name: string;
}

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    year_group_id: number;
    class_id: number;
    created_at: string;
}

export default function TeacherProfile() {
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { token } = useSelector((state: RootState) => state.auth);

    // Fetch teacher profile data
    const fetchTeacherProfile = async () => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/teacher/teacher-profile`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch teacher profile");
            }

            const result = await response.json();
            setTeacher(result.teacher);
            setStudents(result.students);

        } catch (err: any) {
            setError(err.message || "Failed to fetch teacher profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeacherProfile();
    }, [token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>No teacher profile found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Teacher Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        My Profile
                    </CardTitle>
                    <CardDescription>
                        Your personal information and teaching assignments
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-6">
                        {/* <Avatar className="h-20 w-20"> */}
                        {/* <AvatarImage src="/placeholder.svg" /> */}
                        {/* <AvatarFallback className="text-lg">
                {teacher.first_name[0]}
                {teacher.last_name[0]}
              </AvatarFallback> */}
                        <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full border-2 border-blue-100 group-hover:border-blue-300 transition-colors">
                            <UserCircle className="w-12 h-12" />
                        </div>
                        {/* </Avatar> */}

                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {teacher.first_name} {teacher.last_name}
                                </h2>
                                <Badge variant={teacher.status === "active" ? "default" : "secondary"} className="mt-2">
                                    <GraduationCap className="h-3 w-3 mr-1" />
                                    {teacher.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              

                                

                                <div className="flex items-center gap-3">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-bold">Class Assigned</p>
                                        <p className="text-sm text-muted-foreground">{teacher.class_name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-bold">Year Group</p>
                                        <p className="text-sm text-muted-foreground">Year {teacher.year_group_id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Students Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        My Students
                    </CardTitle>
                    <CardDescription>
                        Students assigned to your class ({students.length} total)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {students.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No students assigned to your class yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src="/placeholder.svg" />
                                        <AvatarFallback>
                                            {student.first_name[0]}
                                            {student.last_name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold  text-sm truncate">
                                            {student.first_name} {student.last_name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {student.email}
                                        </p>
                                       
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
