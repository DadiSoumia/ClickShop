import Skeleton from "./Skeleton.jsx";

export default function ProductCardSkeleton() {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-white border border-border overflow-hidden">
      <Skeleton className="aspect-square rounded-none" />
      <div className="p-2.5 sm:p-4 space-y-2">
        <Skeleton className="h-2.5 w-1/3" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3">
          <Skeleton className="h-8 flex-1 rounded-full" />
          <Skeleton className="h-8 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}