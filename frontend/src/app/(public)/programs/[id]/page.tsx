"use client";

import { use } from "react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { getPublishedPrograms } from "@/services/programs.service";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ProgramDetailView from "@/components/ui/ProgramDetailView";

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: items, loading, error, refetch } = useApi(getPublishedPrograms);

  const program = items?.find((p) => p.id === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center py-20">
        <LoadingSpinner count={1} message="Loading program details..." />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center py-20">
        <div className="max-w-md w-full px-4">
          <ErrorMessage 
            message={error || "The requested program could not be found."} 
            onRetry={refetch} 
          />
          <div className="text-center mt-6">
            <Link href="/programs" className="text-primary font-bold hover:underline">
              Back to Programs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pb-24">
      {/* Top Navigation */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 pb-4">
        <Link 
          href="/programs" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Programs
        </Link>
      </div>

      <ProgramDetailView program={program} />
    </div>
  );
}
