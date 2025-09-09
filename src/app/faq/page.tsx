"use client";
import React from 'react'
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const faqs = [
  {
    question: "How much does a gym membership cost?",
    answer:
      "Evolved Fitness Center offers flexible membership rates for students and regular members. For complete pricing details, head over to our About section or follow us on social media.",
  },
  {
    question: "What different promo packages are available for my membership?",
    answer:
      "At Evolved Fitness Center, we offer different promo packages to fit your needs. Students and regular members can enjoy special discounted rates. We also provide 6-month and 12-month packages, both of which include free membership.",
  },
  {
    question: "Where is the gym located?",
    answer:
      "Evolved Fitness Center is located at 221 Baranggay Bagong Bayan, Malolos, Philippines.",
  },
  {
    question: "Do Evolved Fitness have WIFI?",
    answer:
      "Evolved Fitness Center offers free Wi-Fi for both members and guests. Simply approach our staff to get the connection details.",
  },
  {
    question: "Do Evolved Fitness have bathrooms, showers, and cubbies?",
    answer:
      "Yes, we do! Evolved Fitness Center offers private restrooms and showers for your convenience. We also provide cubbies where you can securely store your belongings while you work out.",
  },
  {
    question: "What coaching and personal training services are available?",
    answer:
      "Evolved Fitness Center has several coaches who offer personal training services. Learn more about our coaches and what they can do for you on the About page.",
  },
  {
    question: "Is the gym air conditioned?",
    answer:
      "Yes, the gym is air-conditioned during all operating hours to ensure a comfortable workout environment.",
  },
];


export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center p-8">
      <h1 className="text-4xl md:text-5xl font-bold text-medium-red mb-8 text-center">
        Frequently Asked Questions
      </h1>
      <div className="w-full max-w-3xl space-y-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              className="flex items-center justify-between w-full px-4 py-3 text-left font-semibold transition"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <span>{faq.question}</span>
              {openIndex === index ? (
                <ChevronDown className="w-5 h-5 text-red-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-red-500" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-4 py-3 bg-light-black text-gray-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
