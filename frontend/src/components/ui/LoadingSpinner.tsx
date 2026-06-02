export default function LoadingSpinner({
  message = "Loading...",
  count = 3,
}: {
  message?: string;
  count?: number;
}) {
  return (
    <div className="w-full space-y-4 animate-pulse" aria-label={message} role="status">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden flex flex-col md:flex-row gap-0"
        >
          <div className="w-full md:w-1/3 h-48 md:h-auto bg-outline-variant/20" />
          <div className="flex-1 p-6 space-y-3">
            <div className="h-5 bg-outline-variant/20 rounded w-3/4" />
            <div className="h-4 bg-outline-variant/15 rounded w-full" />
            <div className="h-4 bg-outline-variant/15 rounded w-5/6" />
            <div className="h-4 bg-outline-variant/10 rounded w-2/3" />
          </div>
        </div>
      ))}
      <span className="sr-only">{message}</span>
    </div>
  );
}
