import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function TransactionSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-5 w-[100px] ml-auto" />
          <Skeleton className="h-3 w-20 ml-auto" />
        </div>
      </div>
    </Card>
  );
}

export function TransactionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <TransactionSkeleton key={i} />
      ))}
    </div>
  );
}
