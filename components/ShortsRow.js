"use client";

import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { PlaySquare } from "lucide-react";

export default function ShortsRow({ shorts }) {
  const router = useRouter();

  return (
    <section className="px-3 sm:px-4 md:px-6">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4 mt-8">
  <PlaySquare  />
  <h2 className="text-xl font-semibold">Shorts</h2>
</div>


      {/* SHORTS LIST */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {shorts.map((short) => (
          <div
            key={short.id}
            onClick={() => router.push(`/shorts?video=${short.id}`)}
            className="
              min-w-[160px] max-w-[160px]
              aspect-[9/16]
              rounded-xl overflow-hidden
              bg-black relative cursor-pointer
              hover:scale-[1.02] transition
            "
          >
            <img
              src={short.thumbnail}
              alt={short.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Play icon */}
            <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full">
              <Play size={14} className="text-white" />
            </div>

            {/* Title */}
            <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium line-clamp-2">
              {short.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
