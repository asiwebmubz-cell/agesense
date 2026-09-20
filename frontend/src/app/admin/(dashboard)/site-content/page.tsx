"use client";

import { useState, useEffect, useCallback } from "react";
import type { SiteContent } from "@/types";
import {
  getAllSiteContent,
  updateSiteContent,
} from "@/services/site-content.service";
import { uploadImage } from "@/services/programs.service";

interface ContentItemConfig {
  key: string;
  label: string;
  description: string;
  hasImage?: boolean;
  isMetrics?: boolean;
}

const CMS_ITEMS: ContentItemConfig[] = [
  {
    key: "our_story",
    label: "Our Story",
    description: "Narrative, genesis, and mission story displayed on /our-story",
  },
  {
    key: "values",
    label: "Our Values",
    description: "Core organizational principles and guiding ethics on /values",
  },
  {
    key: "founder_statement",
    label: "Founder's Statement",
    description: "Official inaugural statement and founder portrait on /founders-statement",
    hasImage: true,
  },
  {
    key: "impact_metrics",
    label: "Our Impact Numbers",
    description: "Headline impact statistics shown on the home page: Elders Helped, Aid Delivered, Voluntary Hours, and Years Active.",
    isMetrics: true,
  },
];

export default function SiteContentAdminPage() {
  const [contents, setContents] = useState<Record<string, SiteContent>>({});
  const [selectedKey, setSelectedKey] = useState<string>("our_story");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Editor states
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [eldersHelped, setEldersHelped] = useState<number | string>(1100);
  const [aidDelivered, setAidDelivered] = useState<number | string>(500);
  const [voluntaryHours, setVoluntaryHours] = useState<number | string>(1200);
  const [yearsActive, setYearsActive] = useState<number | string>(2);

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getAllSiteContent();
      const mapped: Record<string, SiteContent> = {};
      list.forEach((item) => {
        mapped[item.key] = item;
      });
      setContents(mapped);

      // Populate current key
      const current = mapped[selectedKey];
      if (current) {
        setTitle(current.title || "");
        setBody(current.body || "");
        setImageUrl(current.metadata?.image_url || "");
        if (current.key === "impact_metrics") {
          setEldersHelped(current.metadata?.elders_helped ?? 1100);
          setAidDelivered(current.metadata?.aid_delivered ?? 500);
          setVoluntaryHours(current.metadata?.voluntary_hours ?? 1200);
          setYearsActive(current.metadata?.years_active ?? 2);
        }
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load site content.");
    } finally {
      setLoading(false);
    }
  }, [selectedKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectKey = (key: string) => {
    setSelectedKey(key);
    setError("");
    setSuccess("");
    const item = contents[key];
    if (item) {
      setTitle(item.title || "");
      setBody(item.body || "");
      setImageUrl(item.metadata?.image_url || "");
      if (item.key === "impact_metrics") {
        setEldersHelped(item.metadata?.elders_helped ?? 1100);
        setAidDelivered(item.metadata?.aid_delivered ?? 500);
        setVoluntaryHours(item.metadata?.voluntary_hours ?? 1200);
        setYearsActive(item.metadata?.years_active ?? 2);
      }
    } else {
      setTitle("");
      setBody("");
      setImageUrl("");
      if (key === "impact_metrics") {
        setEldersHelped(1100);
        setAidDelivered(500);
        setVoluntaryHours(1200);
        setYearsActive(2);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err: any) {
      setError(err?.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!body.trim()) {
      setError("Content body cannot be empty.");
      return;
    }

    try {
      setSubmitting(true);
      let metadata: any = imageUrl ? { image_url: imageUrl } : {};

      if (selectedKey === "impact_metrics") {
        metadata = {
          ...metadata,
          elders_helped: Number(eldersHelped) || 0,
          aid_delivered: Number(aidDelivered) || 0,
          voluntary_hours: Number(voluntaryHours) || 0,
          years_active: Number(yearsActive) || 1,
        };
      }

      const payload: any = {
        title: title.trim() || null,
        body: body.trim(),
        metadata,
      };

      await updateSiteContent(selectedKey, payload);
      setSuccess(`"${CMS_ITEMS.find((c) => c.key === selectedKey)?.label}" updated successfully.`);
      loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to save content.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeConfig = CMS_ITEMS.find((c) => c.key === selectedKey);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-primary">Site Content CMS</h1>
        <p className="text-sm text-surface-variant">
          Super Admin dynamic content manager for Our Story, Core Values, and the Founder&apos;s Statement. Updates take effect immediately on public pages without code deployments.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-outline-variant pb-2">
        {CMS_ITEMS.map((item) => {
          const isActive = selectedKey === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleSelectKey(item.key)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-surface-variant hover:text-on-surface"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Editor Canvas */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-on-surface">{activeConfig?.label}</h2>
          <p className="text-xs text-surface-variant">{activeConfig?.description}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-surface-variant mb-1">
              Page Headline / Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Our Impact"
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Impact Numbers Grid if selectedKey is impact_metrics */}
          {activeConfig?.isMetrics && (
            <div className="bg-surface-container/50 border border-outline-variant p-5 rounded-xl space-y-4">
              <div>
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">analytics</span>
                  <span>Impact Headline Numbers</span>
                </h3>
                <p className="text-xs text-surface-variant">
                  These 4 numbers are displayed directly in the &ldquo;Our Impact&rdquo; stat cards on the public homepage. Each value automatically shows with a &ldquo;+&rdquo; suffix (e.g. 1100+).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Elders Helped
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={eldersHelped}
                    onChange={(e) => setEldersHelped(e.target.value)}
                    placeholder="1100"
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-background text-base font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-[11px] text-surface-variant mt-1 block">Live card: {eldersHelped || 0}+</span>
                </div>

                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Aid Delivered
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={aidDelivered}
                    onChange={(e) => setAidDelivered(e.target.value)}
                    placeholder="500"
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-background text-base font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-[11px] text-surface-variant mt-1 block">Live card: {aidDelivered || 0}+</span>
                </div>

                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Voluntary Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={voluntaryHours}
                    onChange={(e) => setVoluntaryHours(e.target.value)}
                    placeholder="1200"
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-background text-base font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-[11px] text-surface-variant mt-1 block">Live card: {voluntaryHours || 0}+</span>
                </div>

                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Years Active
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={yearsActive}
                    onChange={(e) => setYearsActive(e.target.value)}
                    placeholder="2"
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-background text-base font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-[11px] text-surface-variant mt-1 block">Live card: {yearsActive || 1}+</span>
                </div>
              </div>
            </div>
          )}

          {/* Optional Image for Founder Portrait */}
          {activeConfig?.hasImage && (
            <div>
              <label className="block text-xs font-semibold text-surface-variant mb-1">
                Founder Portrait Photo
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="text-xs text-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-on-primary hover:file:bg-primary/90 cursor-pointer"
                />
                {uploadingImage && <span className="text-xs text-primary animate-pulse">Uploading portrait...</span>}
              </div>
              {imageUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <img src={imageUrl} alt="Portrait preview" className="h-20 w-20 object-cover rounded-xl border" />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="text-xs text-error hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-surface-variant">
                Content Body *
              </label>
              <span className="text-xs text-surface-variant">Supports multi-paragraph narrative text</span>
            </div>
            <textarea
              rows={12}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the full narrative or statement text here..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-background text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>{submitting ? "Saving..." : "Save & Publish"}</span>
            </button>
            {contents[selectedKey]?.updated_at && (
              <span className="text-xs text-surface-variant">
                Last updated: {new Date(contents[selectedKey].updated_at).toLocaleString()}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
