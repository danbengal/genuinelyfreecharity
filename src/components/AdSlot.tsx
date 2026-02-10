"use client";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
}

export default function AdSlot({ slot, format = "auto", className = "" }: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className={`bg-gray-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <div className="inline-block px-3 py-1 bg-slate-100 text-slate-400 text-xs font-medium rounded-full mb-2">
            Ad
          </div>
          <div className="text-xs text-slate-400">
            {slot} · {format}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
