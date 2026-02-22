"use client";

import { useState } from "react";

const charities = [
  {
    name: "St. Jude Children's Research Hospital",
    emoji: "🏥",
    website: "https://www.stjude.org",
    mission: "Leading the way the world understands, treats and defeats childhood cancer and other life-threatening diseases.",
    description: "St. Jude Children's Research Hospital is leading the way the world understands, treats and defeats childhood cancer and other life-threatening diseases. Families never receive a bill from St. Jude for treatment, travel, housing or food — so they can focus on helping their child live. Treatments invented at St. Jude have helped push the overall childhood cancer survival rate from 20% to more than 80% since it opened in 1962.",
  },
  {
    name: "Doctors Without Borders",
    emoji: "🌍",
    website: "https://www.doctorswithoutborders.org",
    mission: "Providing emergency medical humanitarian care to people in need, regardless of race, religion, or political affiliation.",
    description: "Doctors Without Borders/Médecins Sans Frontières (MSF) is an international, independent medical humanitarian organization that delivers emergency aid to people affected by armed conflict, epidemics, healthcare exclusion and natural disasters. MSF offers assistance to people based only on need and irrespective of race, religion, gender or political affiliation.",
  },
  {
    name: "Good360",
    emoji: "🎁",
    website: "https://good360.org",
    mission: "Transforming lives by providing hope, dignity, and a sense of renewed possibility to individuals in need.",
    description: "Good360 is a global leader in product philanthropy and purposeful giving. They partner with socially responsible companies to source highly needed goods and distribute them through their network of diverse nonprofits that support people in need. Good360 has distributed more than $13 billion in donated goods, serving millions of people across the United States and around the world.",
  },
  {
    name: "One Child",
    emoji: "👶",
    website: "https://onechild.org",
    mission: "Transforming the lives of orphans and vulnerable children through Christ-centered care and education.",
    description: "One Child provides holistic care for orphans and vulnerable children in sub-Saharan Africa. They work to transform lives by providing homes, education, healthcare, and spiritual support. Their programs focus on long-term sustainability and empowering local communities to care for children in need.",
  },
  {
    name: "Habitat for Humanity",
    emoji: "🏠",
    website: "https://www.habitat.org",
    mission: "Bringing people together to build homes, communities and hope.",
    description: "Habitat for Humanity is a global nonprofit housing organization working in local communities across all 50 states in the U.S. and in approximately 70 countries. They build and repair homes alongside families in need, helping them achieve the strength, stability and self-reliance they need to build better lives for themselves.",
  },
];

export default function AboutCharities() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {charities.map((charity, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{charity.emoji}</span>
                <span className="font-semibold text-slate-900 sm:text-lg">{charity.name}</span>
              </div>
              <svg
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-slate-100 pt-4 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Mission</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{charity.mission}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">About</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{charity.description}</p>
                </div>
                <a
                  href={charity.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Visit Website
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
