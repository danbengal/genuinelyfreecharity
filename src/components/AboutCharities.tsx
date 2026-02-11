"use client";

import { useState } from "react";

const charities = [
  {
    name: "St. Jude Children's Research Hospital",
    website: "https://www.stjude.org",
    mission: "Leading the way the world understands, treats and defeats childhood cancer and other life-threatening diseases.",
    description: "St. Jude Children's Research Hospital is leading the way the world understands, treats and defeats childhood cancer and other life-threatening diseases. Families never receive a bill from St. Jude for treatment, travel, housing or food — so they can focus on helping their child live. Treatments invented at St. Jude have helped push the overall childhood cancer survival rate from 20% to more than 80% since it opened in 1962.",
  },
  {
    name: "Doctors Without Borders",
    website: "https://www.doctorswithoutborders.org",
    mission: "Providing emergency medical humanitarian care to people in need, regardless of race, religion, or political affiliation.",
    description: "Doctors Without Borders/Médecins Sans Frontières (MSF) is an international, independent medical humanitarian organization that delivers emergency aid to people affected by armed conflict, epidemics, healthcare exclusion and natural disasters. MSF offers assistance to people based only on need and irrespective of race, religion, gender or political affiliation.",
  },
  {
    name: "Good360",
    website: "https://good360.org",
    mission: "Transforming lives by providing hope, dignity, and a sense of renewed possibility to individuals in need.",
    description: "Good360 is a global leader in product philanthropy and purposeful giving. They partner with socially responsible companies to source highly needed goods and distribute them through their network of diverse nonprofits that support people in need. Good360 has distributed more than $13 billion in donated goods, serving millions of people across the United States and around the world.",
  },
  {
    name: "One Child",
    website: "https://onechild.org",
    mission: "Transforming the lives of orphans and vulnerable children through Christ-centered care and education.",
    description: "One Child provides holistic care for orphans and vulnerable children in sub-Saharan Africa. They work to transform lives by providing homes, education, healthcare, and spiritual support. Their programs focus on long-term sustainability and empowering local communities to care for children in need. Through family-style homes and quality education, they help children break the cycle of poverty.",
  },
  {
    name: "Habitat for Humanity",
    website: "https://www.habitat.org",
    mission: "Seeking to put God's love into action by bringing people together to build homes, communities and hope.",
    description: "Habitat for Humanity is a global nonprofit housing organization working in local communities across all 50 states in the U.S. and in approximately 70 countries. Habitat's vision is of a world where everyone has a decent place to live. They build and repair homes alongside families in need, helping them achieve the strength, stability and self-reliance they need to build better lives for themselves.",
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
                {/* Mission */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                    Mission
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {charity.mission}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                    About
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {charity.description}
                  </p>
                </div>

                {/* Website link */}
                <div>
                  <a
                    href={charity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Visit Website
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
