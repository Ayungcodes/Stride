// Base skeleton pulse element
function Bone({ className = "" }) {
  return (
    <div className={`bg-[#2a2a2a] rounded-lg animate-pulse ${className}`} />
  );
}

// Stat cards row skeleton
export function StatCardsSkeleton({ count = 3 }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-${count} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 flex flex-col gap-3">
          <Bone className="h-3 w-24" />
          <Bone className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

// List skeleton — mimics the client/project/task list rows
export function ListSkeleton({ rows = 5 }) {
  return (
    <div className="flex flex-col border border-[#2a2a2a] rounded-xl overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center justify-between px-5 py-4
            ${i !== rows - 1 ? "border-b border-[#2a2a2a]" : ""}`}
        >
          <div className="flex items-center gap-3">
            <Bone className="w-9 h-9 rounded-full flex-shrink-0" />
            <div className="flex flex-col gap-2">
              <Bone className="h-3 w-32" />
              <Bone className="h-2.5 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Bone className="h-5 w-14 rounded-full" />
            <Bone className="h-3 w-8" />
            <Bone className="h-3 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Grid skeleton — mimics the client/project card grid
export function GridSkeleton({ cards = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <Bone className="w-10 h-10 rounded-full" />
            <Bone className="h-5 w-14 rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Bone className="h-3.5 w-32" />
            <Bone className="h-2.5 w-48" />
          </div>
          <div className="flex flex-col gap-2">
            <Bone className="h-2.5 w-40" />
            <Bone className="h-2.5 w-36" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Detail page skeleton
export function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Bone className="h-3 w-24" />
        <div className="flex items-center gap-3">
          <Bone className="w-11 h-11 rounded-full" />
          <div className="flex flex-col gap-2">
            <Bone className="h-6 w-48" />
            <Bone className="h-3 w-32" />
          </div>
        </div>
      </div>
      <StatCardsSkeleton count={3} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 flex flex-col gap-4">
          <Bone className="h-4 w-24" />
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => <Bone key={i} className="h-3 w-full" />)}
          </div>
        </div>
        <div className="lg:col-span-2">
          <ListSkeleton rows={4} />
        </div>
      </div>
    </div>
  );
}