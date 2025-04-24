"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser, updateUserProfile } from "@/lib/actions/auth.action";
import { UserCircle } from "lucide-react";

export default function ProfilePage() {
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "resume"
  ) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      
      // Save URL to Firebase
      const updateData = {
        [type === "profile" ? "profileURL" : "resumeURL"]: data.url
      };
      
      const updated = await updateUserProfile(user.id, updateData);
      
      if (!updated) {
        throw new Error("Failed to update profile");
      }

      // Update local state
      setUser((prev: any) => ({
        ...prev,
        ...updateData
      }));

      toast.success(`${type === "profile" ? "Profile photo" : "Resume"} updated successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading file");
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>

      <div className="space-y-8">
        {/* Profile Photo Section */}
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24">
            {user?.profileURL ? (
              <Image
                src={user.profileURL}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                <UserCircle className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Profile Photo</h3>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "profile")}
              disabled={uploading}
              className="hidden"
              id="profilePhoto"
            />
            <Button
              asChild
              variant="outline"
              disabled={uploading}
            >
              <label htmlFor="profilePhoto">
                {uploading ? "Uploading..." : "Change photo"}
              </label>
            </Button>
          </div>
        </div>

        {/* Name Section */}
        <div className="space-y-2">
          <h3 className="font-semibold">Name</h3>
          <p className="text-gray-700">{user?.name || "Loading..."}</p>
        </div>

        {/* Email Section */}
        <div className="space-y-2">
          <h3 className="font-semibold">Email</h3>
          <p className="text-gray-700">{user?.email || "Loading..."}</p>
        </div>

        {/* Resume Section */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Resume</h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload your resume in PDF format
            </p>
          </div>
          <Input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileUpload(e, "resume")}
            disabled={uploading}
            className="hidden"
            id="resume"
          />
          <Button
            asChild
            variant="outline"
            disabled={uploading}
          >
            <label htmlFor="resume">
              {uploading ? "Uploading..." : "Upload Resume"}
            </label>
          </Button>
          {user?.resumeURL && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-green-600">Resume uploaded</p>
              <a 
                href={user.resumeURL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}