import Link from "next/link";

export default function VideoCardNew({ video }) {
  return (
    <Link href={`/watch/${video.id}`} className="block cursor-pointer">
      <div className="w-full">
        {/* thumbnail */}
        <div className="w-full aspect-video overflow-hidden rounded-xl bg-black">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* text */}
        <h3 className="mt-2 font-semibold text-sm sm:text-base truncate">
          {video.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 truncate">
          {video.channel}
        </p>
      </div>
    </Link>
  );
}
