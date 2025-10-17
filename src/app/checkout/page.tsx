"use client";

import Image from "next/image";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutPage() {
  const { user } = useUser();

  // ✅ Move hook calls to top level
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createPayment = useMutation(api.payments.create);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleUpload = async () => {
    if (!file || !user || !convexUser?._id) return;
    setIsUploading(true);
    setMessage(null);

    try {
      // 1️⃣ Ask Convex for a signed upload URL
      const uploadUrl = await generateUploadUrl();

      // 2️⃣ Upload the actual image to Convex storage
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const { storageId } = await uploadRes.json();

      // 3️⃣ Store payment proof record using Convex userId
      await createPayment({ userId: convexUser._id, imageUrl: storageId });

      setMessage("✅ Proof uploaded successfully! Waiting for admin approval.");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <p className="text-center mb-6 text-lg">
        Scan the QR code below to pay with <span className="font-bold">GCash</span>.
      </p>

      {/* QR Code */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <Image
          src="/qr.jpg"
          alt="GCash QR Code"
          width={300}
          height={300}
          className="rounded-lg"
        />
      </div>

      <p className="mt-6 text-sm text-white/80 max-w-md text-center">
        After payment, upload your screenshot below for admin verification.
      </p>

      {/* Upload Section */}
      <div className="mt-6 flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 text-sm text-gray-300"
        />

        {preview && (
          <div className="mb-4">
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-lg border border-white/20"
            />
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isUploading || !convexUser}
          className="bg-medium-red hover:bg-medium-red/90"
        >
          {isUploading ? "Uploading..." : "Submit Proof"}
        </Button>

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="mt-8">
        <Link href="/profile">
          <Button variant="secondary" className="bg-medium-red hover:bg-medium-red/90">
            Back to Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
