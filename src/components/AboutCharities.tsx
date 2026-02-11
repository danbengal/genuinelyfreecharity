"use client";

import { useState } from "react";

const charities = [
  {
    name: "St. Jude Children's Research Hospital",
    description: "St. Jude Children's Research Hospital is leading the way the world understands, treats and defeats childhood cancer and other life-threatening diseases. Families never receive a bill from St. Jude for treatment, travel, housing or food.",
    mission: "Finding cures. Saving children.",
    website: "https://www.stjude.org",
  },
  {
    name: "Doctors Without Borders",
    description: "Doctors Without Borders/Médecins Sans Frontières (MSF) provides medical humanitarian aid to people affected by conflict, epidemics, disasters, or exclusion from healthcare in over 70 countries.",
    mission: "Providing lifesaving medical care to those who need it most.",
    website: "https://www.doctorswithoutborders.org",
  },
  {
    name: "Good360",
    description: "Good360 is a global leader in product philanthropy and purposeful giving. They partner with socially responsible companies to source highly needed goods and distribute them to nonprofits supporting people in need.",
    mission: "Transforming lives by providing hope, dignity and a sense of renewed possibility.",
    website: "https://www.good360.org",
  },
  {
    name: "One Child",
    description: "One Child works to ensure that every child has access to education, healthcare, and the opportunity to thrive. They focus on supporting vulnerable children in underserved communities around the world.",
    mission: "Empowering children to break the cycle of poverty through education and care.",
    website: "https://www.onechild.org",
  },
  {
    name: "Habitat for Humanity",
    description: "Habitat for Humanity is a global nonprofit housing organization working in local communities across all 50 states in the U.S. and in more than 70 countries. They help families build and improve places to call home.",
    mission: "Seeking to put God's love into action, Habitat brings people together to build homes, communities and hope.",
    website: "https://www.habitat.org",
  },
];

export default function AboutCharities() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {charities.map((charity, i) => {
        const isOpen = openIndex === i;
        
        return (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 hover:bg-gray-50 transition-colors group touch-manipulation"
            >
              <span className="font-medium text-slate-900 pr-2 sm:pr-4 text-sm sm:text-base leading-snug">
                {charity.name}
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
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-slate-100 pt-3 sm:pt-4 space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    About
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {charity.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Mission
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;{charity.mission}&rdquo;
                  </p>
                </div>
                
                <div>
                  <a
                    href={charity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Visit Website
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
