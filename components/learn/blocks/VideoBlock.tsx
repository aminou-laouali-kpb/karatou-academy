"use client";

import { youTubeId } from "@/lib/content";

export function VideoBlock({
  content,
}: {
  content: Record<string, unknown> | null;
}) {
  const url = (content?.url as string) ?? "";
  const title = (content?.title as string) ?? "Video";
  const id = url ? youTubeId(url) : null;

  if (!id) {
    return (
      <div className="rounded-lg bg-gray-100 p-6 text-center text-gray-500">
        {title}
      </div>
    );
  }

  return (
    <figure className="space-y-2">
      <div className="aspect-video overflow-hidden rounded-lg bg-blue-900 shadow-md">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <figcaption className="text-sm font-medium text-gray-700">{title}</figcaption>
    </figure>
  );
}
