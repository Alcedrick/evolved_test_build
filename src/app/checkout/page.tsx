"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
      {/* Title */}
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

      {/* Instructions */}
      <p className="mt-6 text-sm text-white/80 max-w-md text-center">
        Open your GCash app and use the <span className="font-bold">Scan QR</span> feature
        to complete your payment. Transfer fees may apply.
      </p>

      {/* Back button */}
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
