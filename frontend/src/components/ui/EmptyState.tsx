import Link from "next/link";

export default function EmptyState({
  icon = "folder_open",
  title = "Nothing here yet",
  description = "There is no content to display at the moment.",
  ctaLabel,
  ctaHref,
}: {
  icon?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-5">
        <span
          className="material-symbols-outlined text-on-surface-variant text-4xl"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-sm mb-6">
        {description}
      </p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
