"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function QrScannerBox({ scanType, setScanType, handleScan, feedback }: any) {
  return (
    <div className="mt-8 bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full shadow-md">
      <h2 className="text-lg font-bold mb-4 text-gray-100">Scan Member QR</h2>

      {!scanType ? (
        <div className="flex gap-4">
          <button
            onClick={() => setScanType("entry")}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Entry
          </button>
          <button
            onClick={() => setScanType("exit")}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Exit
          </button>
        </div>
      ) : (
        <div className="w-full mt-4">
          <p className="mb-2 font-medium text-gray-300">
            {scanType === "entry" ? "Scanning for Entry..." : "Scanning for Exit..."}
          </p>
          <div className="rounded-lg overflow-hidden border border-neutral-700">
            <Scanner
              onScan={(results) => {
                if (results && results.length > 0) {
                  const value = results[0].rawValue.trim();
                
                  // ✅ Only accept valid user IDs
                  const isValidUserId = /^user_[A-Za-z0-9]+$/.test(value);
                
                  if (isValidUserId) {
                    handleScan(value);
                  } else {
                    // Optional: give feedback for invalid QR
                    handleScan(null, {
                      type: "error",
                      message: "Invalid QR code — not a valid user ID.",
                    });
                  }
                }
              }}
              constraints={{ facingMode: "environment" }}
            />
          </div>
        </div>
      )}

      {feedback && (
        <Alert
          className={`mt-4 border ${
            feedback.type === "success"
              ? "border-green-500 text-green-400 bg-green-950/20"
              : "border-red-500 text-red-400 bg-red-950/20"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {feedback.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
