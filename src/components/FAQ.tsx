"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What is genuinelyfreecharity.com?",
    a: "A website where you answer a fun daily poll. The site displays ads, and the revenue from those ads — minus operating costs — is allocated to charitable organizations. Everything is transparent and publicly tracked.",
  },
  {
    q: "How often can I participate?",
    a: "Once every 24 hours. After you submit your response, you'll see when you can participate again.",
  },
  {
    q: "How does ad revenue support charities?",
    a: "Google AdSense displays advertisements on this page. When ads are shown and viewed, the site earns revenue. That revenue, after subtracting hosting and operational costs, is allocated to charitable organizations.",
  },
  {
    q: "Should I click on ads to help?",
    a: "No. Please do not click ads with the intent of generating revenue. This violates Google's policies and could harm the site. Simply viewing the page is enough — ads generate revenue through impressions as well as clicks.",
  },
  {
    q: 'What does "net proceeds" mean?',
    a: "Net proceeds = gross ad revenue minus operating costs (hosting, domain, payment fees). The full breakdown is visible in the allocation ledger on this page.",
  },
  {
    q: "Is this a registered nonprofit?",
    a: "No. This is a personal project that allocates ad revenue to charitable organizations. All financials are publicly available for transparency.",
  },
  {
    q: "What data do you collect?",
    a: "We use a cookie-based identifier to limit participation to once per 24 hours. We do not store your IP address, and we do not collect any personal information. No signup or email is required.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-800 pr-4">{faq.q}</span>
            <svg
              className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
