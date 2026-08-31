export default function SkeletonCard() {
  return (
    <div className="border-4 border-navy/10 bg-white relative h-full flex flex-col overflow-hidden">
      {/* Image skeleton */}
      <div className="h-56 skeleton shrink-0" />

      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Badges row */}
        <div className="flex gap-2">
          <div className="skeleton h-6 w-20 rounded-sm" />
          <div className="skeleton h-6 w-12 rounded-sm" />
        </div>

        {/* Title */}
        <div className="skeleton h-7 w-3/4 rounded-sm" />
        {/* Subtitle */}
        <div className="skeleton h-4 w-full rounded-sm" />
        <div className="skeleton h-4 w-2/3 rounded-sm" />

        {/* Meta rows */}
        <div className="space-y-2 mt-2">
          <div className="skeleton h-4 w-1/2 rounded-sm" />
          <div className="skeleton h-4 w-1/3 rounded-sm" />
        </div>

        {/* CTA */}
        <div className="skeleton h-12 w-full mt-auto rounded-sm" />
      </div>
    </div>
  );
}
