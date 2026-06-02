export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center py-16 px-4 text-center"
      role="alert"
    >
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
        <span
          className="material-symbols-outlined text-error text-4xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          error
        </span>
      </div>
      <h3 className="text-lg font-semibold text-on-surface mb-2">
        Something went wrong
      </h3>
      <p className="text-sm text-on-surface-variant max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
