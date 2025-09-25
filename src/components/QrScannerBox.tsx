"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function QrScannerBox({ scanType, setScanType, handleScan, feedback }: any) {
  return (
    <div className="mt-8 border p-4 md:p-6 rounded-lg w-full">
      <h2 className="text-lg font-bold mb-4">Scan Member QR</h2>

      {!scanType ? (
        <div className="flex gap-4">
          <button
            onClick={() => setScanType("entry")}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Entry
          </button>
          <button
            onClick={() => setScanType("exit")}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Exit
          </button>
        </div>
      ) : (
        <div className="w-full mt-4">
          <p className="mb-2 font-medium text-gray-700">
            {scanType === "entry" ? "Scanning for Entry..." : "Scanning for Exit..."}
          </p>
          <Scanner
            onScan={(results) => {
              if (results && results.length > 0) {
                const value = results[0].rawValue;
                if (value) handleScan(value);
              }
            }}
            constraints={{ facingMode: "environment" }}
          />
        </div>
      )}

      {feedback && (
        <Alert
          className={`mt-4 ${
            feedback.type === "success"
              ? "border-green-500 text-green-700"
              : "border-red-500 text-red-700"
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
