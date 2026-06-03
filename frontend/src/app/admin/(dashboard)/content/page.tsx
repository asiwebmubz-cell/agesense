"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Program, ProgramType } from "@/types";
import {
  getAllPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  uploadImage,
  uploadMultipleImages,
} from "@/services/programs.service";

export default function ContentAdminPage() {
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [contentBody, setContentBody] = useState("");
  const [postType, setPostType] = useState<ProgramType>("Our Programs");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);

  // Program details states
  const [subtitle, setSubtitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [goals, setGoals] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("");
  const [expenseCategories, setExpenseCategories] = useState("");
  const [projectAreas, setProjectAreas] = useState("");
  const [duration, setDuration] = useState("");
  const [activeYears, setActiveYears] = useState("");
  const [packagesDistributed, setPackagesDistributed] = useState("");
  const [galleryTitle1, setGalleryTitle1] = useState("");
  const [galleryLink1, setGalleryLink1] = useState("");
  const [galleryTitle2, setGalleryTitle2] = useState("");
  const [galleryLink2, setGalleryLink2] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");

  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState("");

  const [recentContent, setRecentContent] = useState<Program[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const loadContent = useCallback(async () => {
    try {
      const data = await getAllPrograms();
      setRecentContent(data);
    } catch (err) {
      console.error("Failed loading admin content list:", err);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleEdit = (item: Program) => {
    setEditId(item.id);
    setTitle(item.title);
    setContentBody(item.description);
    setPostType(item.type);
    
    // Images
    setImageFile(null);
    setExistingImageUrl(item.image_url || "");
    setGalleryFiles([]);
    setExistingGalleryUrls(item.images || []);

    // Details
    setSubtitle(item.subtitle || "");
    setVideoUrl(item.video_url || "");
    setGoals(item.goals || "");
    setBeneficiaries(item.beneficiaries || "");
    setExpenseCategories(item.expense_categories || "");
    setProjectAreas(item.project_areas || "");
    setDuration(item.duration || "");
    setActiveYears(item.active_years || "");
    setPackagesDistributed(item.packages_distributed || "");
    setGalleryTitle1(item.gallery_title_1 || "");
    setGalleryLink1(item.gallery_link_1 || "");
    setGalleryTitle2(item.gallery_title_2 || "");
    setGalleryLink2(item.gallery_link_2 || "");
    setGalleryDescription(item.gallery_description || "");
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setContentBody("");
    setImageFile(null);
    setExistingImageUrl("");
    setGalleryFiles([]);
    setExistingGalleryUrls([]);
    setSubtitle("");
    setVideoUrl("");
    setGoals("");
    setBeneficiaries("");
    setExpenseCategories("");
    setProjectAreas("");
    setDuration("");
    setActiveYears("");
    setPackagesDistributed("");
    setGalleryTitle1("");
    setGalleryLink1("");
    setGalleryTitle2("");
    setGalleryLink2("");
    setGalleryDescription("");
    setError("");
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (contentBody.trim().length < 10) {
      setError("Content / description must be at least 10 characters.");
      return;
    }

    const isValidUrl = (val: string) => {
      if (!val) return true;
      try { new URL(val); return true; } catch { return false; }
    };

    if (videoUrl && !isValidUrl(videoUrl)) {
      setError("Video URL must be a valid URL (e.g. https://example.com/video.mp4).");
      return;
    }

    setIsPublishing(true);

    try {
      let image_url = existingImageUrl;
      let images: string[] = [...existingGalleryUrls];

      if (imageFile) {
        image_url = await uploadImage(imageFile);
      }

      if (galleryFiles.length > 0) {
        const newImages = await uploadMultipleImages(galleryFiles);
        images = [...images, ...newImages];
      }

      const payloadData = {
        type: postType,
        title,
        description: contentBody,
        image_url: image_url || undefined,
        status: "Published" as const,
        images,
        ...(postType === "Our Programs" ? {
          subtitle,
          video_url: videoUrl || undefined,
          goals,
          beneficiaries,
          expense_categories: expenseCategories,
          project_areas: projectAreas,
          duration,
          active_years: activeYears,
          packages_distributed: packagesDistributed,
          gallery_title_1: galleryTitle1,
          gallery_link_1: galleryLink1 || undefined,
          gallery_title_2: galleryTitle2,
          gallery_link_2: galleryLink2 || undefined,
          gallery_description: galleryDescription,
        } : {}),
      };

      if (editId) {
        await updateProgram(editId, payloadData);
      } else {
        await createProgram(payloadData);
      }

      setIsPublishing(false);
      setIsPublished(true);

      resetForm();
      loadContent();

      setTimeout(() => {
        setIsPublished(false);
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setIsPublishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    try {
      await deleteProgram(id);
      loadContent();
    } catch (err) {
      console.error("Failed requesting item delete:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-on-surface mb-2">Content Management</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">Create and manage content for the &apos;Our Programs&apos;, &apos;Our Work&apos;, and &apos;Impact Stories&apos; sections on the public website. Ensure high-quality imagery and clear, impactful messaging.</p>
        </div>
        {editId && (
          <button 
            onClick={resetForm}
            className="px-4 py-2 border border-outline-variant rounded-lg font-semibold hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            Cancel Edit Mode
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          <section className={`bg-surface-container-low rounded-xl p-8 border shadow-sm transition-all ${editId ? 'border-primary shadow-primary/10' : 'border-outline-variant'}`}>
            <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${editId ? 'text-primary' : 'text-primary'}`}>
              <span className="material-symbols-outlined">{editId ? 'edit' : 'edit_square'}</span>
              {editId ? 'Edit Post' : 'Create New Post'}
            </h2>
            <form className="space-y-6" onSubmit={handlePublish}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant" htmlFor="post-type">Post Type</label>
                  <select 
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as ProgramType)}
                    className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                    id="post-type"
                  >
                    <option>Our Programs</option>
                    <option>Our Work</option>
                    <option>Impact Stories</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant" htmlFor="post-title">Post Title / Person Name</label>
                  <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                    id="post-title" 
                    placeholder="Enter title or person's name (e.g. Martha, 82)" 
                    type="text" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant" htmlFor="content">Content / Story Quote</label>
                <textarea 
                  value={contentBody}
                  onChange={(e) => setContentBody(e.target.value)}
                  required 
                  className="w-full p-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none" 
                  id="content" 
                  placeholder="Share the impact, details, or a direct quote..." 
                  rows={8}
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Featured Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant">Featured Image</label>
                  <div 
                    className="relative border-2 border-dashed border-outline-variant rounded-xl p-8 bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group flex flex-col items-center justify-center text-center h-[180px] overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      ref={fileInputRef} 
                      className="hidden" 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                    />
                    {imageFile || existingImageUrl ? (
                      <>
                        <img 
                          src={imageFile ? URL.createObjectURL(imageFile) : existingImageUrl} 
                          alt="Featured Preview" 
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        />
                        <div className="relative z-10 flex flex-col items-center text-on-surface font-semibold bg-white/80 px-4 py-2 rounded-lg">
                          <span className="material-symbols-outlined text-primary mb-1">refresh</span>
                          Change Image
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-4xl text-primary mb-2">add_photo_alternate</span>
                        <p className="text-base text-on-surface truncate max-w-full px-2">Featured image</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Multiple Gallery Images */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant">Gallery Showcase (Max 20 Images)</label>
                  <div 
                    className="relative border-2 border-dashed border-outline-variant rounded-xl p-8 bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group flex flex-col items-center justify-center text-center h-[180px]"
                    onClick={() => galleryInputRef.current?.click()}
                  >
                    <input 
                      ref={galleryInputRef} 
                      className="hidden" 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          const filesArray = Array.from(e.target.files);
                          if (filesArray.length + galleryFiles.length + existingGalleryUrls.length > 20) {
                            alert("You can upload a maximum of 20 gallery images.");
                            return;
                          }
                          setGalleryFiles(prev => [...prev, ...filesArray]);
                        }
                      }}
                    />
                    <span className="material-symbols-outlined text-4xl text-primary mb-2">collections</span>
                    <p className="text-base text-on-surface">
                      {(galleryFiles.length + existingGalleryUrls.length) > 0 
                        ? `${galleryFiles.length + existingGalleryUrls.length} images selected` 
                        : 'Select gallery images'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Image Previews */}
              {(galleryFiles.length > 0 || existingGalleryUrls.length > 0) && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant">Selected Gallery Previews ({galleryFiles.length + existingGalleryUrls.length})</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-3 bg-surface-container rounded-xl border border-outline-variant max-h-48 overflow-y-auto">
                    {/* Existing Gallery Images */}
                    {existingGalleryUrls.map((url, idx) => (
                      <div key={`existing-${idx}`} className="relative aspect-square bg-surface-container-high rounded overflow-hidden group">
                        <img
                          src={url}
                          alt={`existing-preview-${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExistingGalleryUrls(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    ))}
                    {/* New Gallery Images */}
                    {galleryFiles.map((file, idx) => (
                      <div key={`new-${idx}`} className="relative aspect-square bg-surface-container-high rounded overflow-hidden group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1 rounded font-bold">NEW</div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {postType === "Our Programs" && (
                <div className="border-t border-outline-variant/30 pt-6 mt-6 space-y-6">
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined">menu_open</span>
                    Program details (Project Ihsan details layout)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant">Subtitle</label>
                      <input 
                        value={subtitle} 
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="e.g. Delivering Ramadan Blessings to Families in Need."
                        className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                        type="text" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant">Video URL (optional)</label>
                      <input 
                        value={videoUrl} 
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="e.g. https://www.w3schools.com/html/mov_bbb.mp4"
                        className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                        type="text" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant">Project Goals & Objectives (one per line)</label>
                      <textarea 
                        value={goals} 
                        onChange={(e) => setGoals(e.target.value)}
                        placeholder="Ensuring food security...&#10;Providing specialized..."
                        rows={3}
                        className="w-full p-3 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none" 
                        />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant">Beneficiaries (one per line)</label>
                      <textarea 
                        value={beneficiaries} 
                        onChange={(e) => setBeneficiaries(e.target.value)}
                        placeholder="Elderly-led families facing...&#10;Low-income households..."
                        rows={3}
                        className="w-full p-3 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none" 
                        />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant">Expense Categories (one per line)</label>
                      <textarea 
                        value={expenseCategories} 
                        onChange={(e) => setExpenseCategories(e.target.value)}
                        placeholder="Procurement of specialized...&#10;Packaging and logistics..."
                        rows={3}
                        className="w-full p-3 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none" 
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant">Project Areas</label>
                      <input 
                        value={projectAreas} 
                        onChange={(e) => setProjectAreas(e.target.value)}
                        placeholder="e.g. Dhaka Division"
                        className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                        type="text" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant">Duration</label>
                      <input 
                        value={duration} 
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g. Once every Ramadan"
                        className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                        type="text" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant">Active Years (comma-separated)</label>
                      <input 
                        value={activeYears} 
                        onChange={(e) => setActiveYears(e.target.value)}
                        placeholder="e.g. 2025, 2026"
                        className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                        type="text" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant">Food Packages Distributed / Stats (comma-separated, matches years)</label>
                      <input 
                        value={packagesDistributed} 
                        onChange={(e) => setPackagesDistributed(e.target.value)}
                        placeholder="e.g. 530+, 530+"
                        className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                        type="text" 
                      />
                    </div>
                  </div>

                  <div className="border-t border-outline-variant/20 pt-4 space-y-4">
                    <h4 className="text-sm font-bold text-on-surface">Gallery Settings (Legacy Options)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface-variant">Gallery Item 1 Title</label>
                        <input 
                          value={galleryTitle1} 
                          onChange={(e) => setGalleryTitle1(e.target.value)}
                          placeholder="e.g. Ushnota 1.0"
                          className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                          type="text" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface-variant">Gallery Item 1 Link (optional)</label>
                        <input 
                          value={galleryLink1} 
                          onChange={(e) => setGalleryLink1(e.target.value)}
                          placeholder="e.g. https://example.com/gallery1"
                          className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                          type="text" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface-variant">Gallery Item 2 Title</label>
                        <input 
                          value={galleryTitle2} 
                          onChange={(e) => setGalleryTitle2(e.target.value)}
                          placeholder="e.g. Ihsan 2.0"
                          className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                          type="text" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface-variant">Gallery Item 2 Link (optional)</label>
                        <input 
                          value={galleryLink2} 
                          onChange={(e) => setGalleryLink2(e.target.value)}
                          placeholder="e.g. https://example.com/gallery2"
                          className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                          type="text" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant">Gallery Section Description</label>
                      <textarea 
                        value={galleryDescription} 
                        onChange={(e) => setGalleryDescription(e.target.value)}
                        placeholder="Describe the gallery images or add a general note..."
                        rows={3}
                        className="w-full p-3 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none" 
                      />
                    </div>
                  </div>
                </div>
              )}
              {error && <p className="text-sm font-semibold text-error">{error}</p>}
              <div className="flex justify-end pt-4 gap-4">
                <button 
                  disabled={isPublishing || isPublished}
                  className={`px-8 py-3 font-bold rounded-lg shadow-md transition-all flex items-center gap-2 ${isPublished ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary-container active:scale-95'}`} 
                  type="submit"
                >
                  {isPublishing ? (
                    <><span className="material-symbols-outlined animate-spin">sync</span> {editId ? 'Updating...' : 'Publishing...'}</>
                  ) : isPublished ? (
                    <><span className="material-symbols-outlined">check_circle</span> {editId ? 'Updated!' : 'Published!'}</>
                  ) : (
                    editId ? "Update Content" : "Publish to Website"
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Sidebar Info / Preview */}
        <div className="space-y-6">
          <section className="bg-primary-container text-on-primary-container rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4">Quick Tips</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-on-primary-container">info</span>
                <p className="text-sm font-medium">Use high-resolution photos that show active community engagement.</p>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-on-primary-container">bolt</span>
                <p className="text-sm font-medium">Keep titles under 60 characters for optimal homepage display.</p>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-on-primary-container">format_quote</span>
                <p className="text-sm font-medium">For Impact Stories, use a direct quote as the content body.</p>
              </li>
            </ul>
          </section>
          
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
            <h3 className="text-sm font-bold text-on-surface-variant mb-4 uppercase tracking-wider flex justify-between items-center">
              <span>Recent Content</span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">{recentContent.length}</span>
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {recentContent.map((item) => (
                <div key={item.id} className={`flex justify-between items-start group hover:bg-surface p-2 -mx-2 rounded transition-colors ${editId === item.id ? 'bg-surface border border-primary/20' : ''}`}>
                  <div className="flex items-center gap-3 cursor-pointer overflow-hidden">
                    <div className={`w-10 h-10 rounded flex-shrink-0 flex items-center justify-center ${item.status === 'Published' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                      <span className={`material-symbols-outlined text-sm ${item.status === 'Published' ? 'text-primary' : 'text-secondary'}`}>
                        {item.type === 'Impact Stories' ? 'format_quote' : (item.status === 'Published' ? 'image' : 'draft')}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold group-hover:text-primary transition-colors truncate ${editId === item.id ? 'text-primary' : 'text-on-surface'}`}>{item.title}</p>
                      <p className="text-[12px] text-outline truncate">{item.type} • {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                      title="Edit Content"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-error hover:bg-error/10 rounded transition-colors"
                      title="Delete Content"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
              {recentContent.length === 0 && (
                <p className="text-sm text-outline italic text-center py-4">No content found.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
