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
    <div className="space-y-2.5 sm:space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        
        return (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 hover:bg-gray-50 transition-colors group touch-manipulation"
            >
              <span className="font-medium text-slate-900 pr-2 sm:pr-4 text-sm sm:text-base leading-snug">
                {faq.q}
              </span>
              
              {/* Animated chevron */}
              <svg
                className={`w-5 h-5 text-slate-400 shrink-0 transition-all duration-300 group-hover:text-slate-600 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {/* Animated content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 sm:pt-4">
                {faq.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
