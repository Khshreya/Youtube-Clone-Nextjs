"use client";

import { useMemo } from "react";

function extractYouTubeId(url) {
	if (!url) return null;
	try {
		const u = new URL(url);

		if (u.hostname.includes("youtu.be")) {
			return u.pathname.slice(1).split(/[?#]/)[0];
		}

		if (u.hostname.includes("youtube.com")) {
			// /watch?v=ID
			if (u.searchParams.get("v")) return u.searchParams.get("v");

			// /live/ID or /embed/ID or /watch/live/ID
			const parts = u.pathname.split("/").filter(Boolean);
			return parts.length ? parts[parts.length - 1] : null;
		}
	} catch (e) {
		// fallback to regex for non-absolute strings
		const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{6,})/);
		return m ? m[1] : null;
	}

	return null;
}

export default function YouTubePlayer({ url }) {
	const videoId = useMemo(() => extractYouTubeId(url), [url]);

	if (!videoId) {
		return <div className="p-4">Invalid video URL</div>;
	}

	const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;

	return (
		<div className="w-full max-w-4xl">
			<div className="relative w-full" style={{ paddingTop: "56.25%" }}>
				<iframe
					className="absolute left-0 top-0 h-full w-full"
					src={embedSrc}
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; autoplay"
					allowFullScreen
				/>
			</div>
		</div>
	);
}
