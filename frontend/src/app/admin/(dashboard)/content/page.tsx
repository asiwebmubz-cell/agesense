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
import ProgramDetailView from "@/components/ui/ProgramDetailView";

export default function ContentAdminPage() {
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
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

  // Modals state
  const [previewItem, setPreviewItem] = useState<Program | null>(null);
  const [deleteItem, setDeleteItem] = useState<Program | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Check if form has unsaved modifications
  const isFormDirty = useCallback(() => {
    if (editId === null) {
      return (
        title !== "" ||
        contentBody !== "" ||
        imageFile !== null ||
        galleryFiles.length > 0 ||
        subtitle !== "" ||
        videoUrl !== "" ||
        goals !== "" ||
        beneficiaries !== "" ||
        expenseCategories !== "" ||
        projectAreas !== "" ||
        duration !== "" ||
        activeYears !== "" ||
        packagesDistributed !== "" ||
        galleryTitle1 !== "" ||
        galleryLink1 !== "" ||
        galleryTitle2 !== "" ||
        galleryLink2 !== "" ||
        galleryDescription !== ""
      );
    } else {
      const original = recentContent.find((p) => p.id === editId);
      if (!original) return false;

      const titleChanged = title !== (original.title || "");
      const contentChanged = contentBody !== (original.description || "");
      const typeChanged = postType !== original.type;
      const mainImageChanged = imageFile !== null || existingImageUrl !== (original.image_url || "");
      
      const originalGallery = original.images || [];
      const galleryChanged =
        galleryFiles.length > 0 ||
        existingGalleryUrls.length !== originalGallery.length ||
        existingGalleryUrls.some((url, i) => url !== originalGallery[i]);

      const subtitleChanged = subtitle !== (original.subtitle || "");
      const videoUrlChanged = videoUrl !== (original.video_url || "");
      const goalsChanged = goals !== (original.goals || "");
      const beneficiariesChanged = beneficiaries !== (original.beneficiaries || "");
      const expensesChanged = expenseCategories !== (original.expense_categories || "");
      const projectAreasChanged = projectAreas !== (original.project_areas || "");
      const durationChanged = duration !== (original.duration || "");
      const activeYearsChanged = activeYears !== (original.active_years || "");
      const packagesChanged = packagesDistributed !== (original.packages_distributed || "");
      const gTitle1Changed = galleryTitle1 !== (original.gallery_title_1 || "");
      const gLink1Changed = galleryLink1 !== (original.gallery_link_1 || "");
      const gTitle2Changed = galleryTitle2 !== (original.gallery_title_2 || "");
      const gLink2Changed = galleryLink2 !== (original.gallery_link_2 || "");
      const gDescChanged = galleryDescription !== (original.gallery_description || "");

      return (
        titleChanged ||
        contentChanged ||
        typeChanged ||
        mainImageChanged ||
        galleryChanged ||
        subtitleChanged ||
        videoUrlChanged ||
        goalsChanged ||
        beneficiariesChanged ||
        expensesChanged ||
        projectAreasChanged ||
        durationChanged ||
        activeYearsChanged ||
        packagesChanged ||
        gTitle1Changed ||
        gLink1Changed ||
        gTitle2Changed ||
        gLink2Changed ||
        gDescChanged
      );
    }
  }, [
    editId,
    title,
    contentBody,
    postType,
    imageFile,
    existingImageUrl,
    galleryFiles,
    existingGalleryUrls,
    subtitle,
    videoUrl,
    goals,
    beneficiaries,
    expenseCategories,
    projectAreas,
    duration,
    activeYears,
    packagesDistributed,
    galleryTitle1,
    galleryLink1,
    galleryTitle2,
    galleryLink2,
    galleryDescription,
    recentContent,
  ]);

  // Window browser-level warning for unsaved changes (close tab, refresh)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty()) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFormDirty]);

  // Alert guard when leaving edit mode or switching items
  const confirmLeaveGuard = (): boolean => {
    if (isFormDirty()) {
      return window.confirm("You have unsaved changes. Are you sure you want to leave?");
    }
    return true;
  };

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

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditClick = (item: Program) => {
    if (item.id === editId) return;
    if (!confirmLeaveGuard()) return;
    handleEdit(item);
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

  const handleCancelEditing = () => {
    if (!confirmLeaveGuard()) return;
    resetForm();
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
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
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
        ...(postType === "Our Programs"
          ? {
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
            }
          : {}),
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

  // Safe delete handler
  const confirmDelete = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      await deleteProgram(deleteItem.id);
      setIsDeleting(false);
      setDeleteItem(null);
      // If we deleted the item we were currently editing, reset form.
      if (editId === deleteItem.id) {
        resetForm();
      }
      loadContent();
    } catch (err) {
      console.error("Failed requesting item delete:", err);
      setIsDeleting(false);
    }
  };

  // Construct mock Program object representing current editor state (for unsaved preview)
  const constructPreviewPayload = (): Program => {
    const localMainImageUrl = imageFile ? URL.createObjectURL(imageFile) : existingImageUrl;
    const localGalleryUrls = [
      ...existingGalleryUrls,
      ...galleryFiles.map((f) => URL.createObjectURL(f)),
    ];

    return {
      id: editId || "draft-preview",
      type: postType,
      title: title || "Untitled Program Preview",
      description: contentBody,
      image_url: localMainImageUrl || undefined,
      status: "Published",
      created_at: editId
        ? recentContent.find((p) => p.id === editId)?.created_at || new Date().toISOString()
        : new Date().toISOString(),
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
      images: localGalleryUrls,
    };
  };

  // Preview click handler for sidebar
  const handleSidebarPreview = (item: Program) => {
    // If the clicked item matches the one being edited, show the unsaved editor state
    if (item.id === editId) {
      setPreviewItem(constructPreviewPayload());
    } else {
      setPreviewItem(item);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full relative">
      {/* Edit Mode Indicator Banner */}
      {editId && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-600 animate-pulse text-[28px]">
              edit_note
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                EDITING PROGRAM
              </p>
              <h4 className="text-base font-bold text-on-surface">
                {recentContent.find((p) => p.id === editId)?.title || "Selected Program"}
              </h4>
            </div>
          </div>
          <button
            onClick={handleCancelEditing}
            className="px-4 py-2 bg-white hover:bg-amber-100/50 border border-amber-300 text-amber-900 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">cancel</span>
            Cancel Editing
          </button>
        </div>
      )}

      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-on-surface mb-2">Content Management</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Create and manage content for the &apos;Our Programs&apos;, &apos;Our Work&apos;, and
            &apos;Impact Stories&apos; sections on the public website. Ensure high-quality imagery
            and clear, impactful messaging.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          <section
            className={`bg-surface-container-low rounded-xl p-8 border shadow-sm transition-all ${
              editId ? "border-primary shadow-primary/10" : "border-outline-variant"
            }`}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">
                {editId ? "edit" : "edit_square"}
              </span>
              {editId ? "Edit Post" : "Create New Post"}
            </h2>
            <form className="space-y-6" onSubmit={handlePublish}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant" htmlFor="post-type">
                    Post Type
                  </label>
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
                  <label className="text-sm font-medium text-on-surface-variant" htmlFor="post-title">
                    Post Title / Person Name
                  </label>
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
                <label className="text-sm font-medium text-on-surface-variant" htmlFor="content">
                  Content / Story Quote
                </label>
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
                        <span className="material-symbols-outlined text-4xl text-primary mb-2">
                          add_photo_alternate
                        </span>
                        <p className="text-base text-on-surface truncate max-w-full px-2">Featured image</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Multiple Gallery Images */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant">
                    Gallery Showcase (Max 20 Images)
                  </label>
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
                          setGalleryFiles((prev) => [...prev, ...filesArray]);
                        }
                      }}
                    />
                    <span className="material-symbols-outlined text-4xl text-primary mb-2">
                      collections
                    </span>
                    <p className="text-base text-on-surface">
                      {galleryFiles.length + existingGalleryUrls.length > 0
                        ? `${galleryFiles.length + existingGalleryUrls.length} images selected`
                        : "Select gallery images"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Image Previews */}
              {(galleryFiles.length > 0 || existingGalleryUrls.length > 0) && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant">
                    Selected Gallery Previews ({galleryFiles.length + existingGalleryUrls.length})
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-3 bg-surface-container rounded-xl border border-outline-variant max-h-48 overflow-y-auto">
                    {/* Existing Gallery Images */}
                    {existingGalleryUrls.map((url, idx) => (
                      <div
                        key={`existing-${idx}`}
                        className="relative aspect-square bg-surface-container-high rounded overflow-hidden group"
                      >
                        <img src={url} alt={`existing-preview-${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    ))}
                    {/* New Gallery Images */}
                    {galleryFiles.map((file, idx) => (
                      <div
                        key={`new-${idx}`}
                        className="relative aspect-square bg-surface-container-high rounded overflow-hidden group"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1 rounded font-bold">
                          NEW
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
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
                      <label className="text-sm font-medium text-on-surface-variant">
                        Project Goals & Objectives (one per line)
                      </label>
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
                      <label className="text-sm font-medium text-on-surface-variant">
                        Food Packages Distributed / Stats (comma-separated, matches years)
                      </label>
                      <input
                        value={packagesDistributed}
                        onChange={(e) => setPackagesDistributed(e.target.value)}
                        placeholder="e.g. 530+, 530+"
                        className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              )}
              {error && <p className="text-sm font-semibold text-error">{error}</p>}
              <div className="flex justify-end pt-4 gap-4">
                {/* Form Footer Preview Button */}
                <button
                  type="button"
                  onClick={() => setPreviewItem(constructPreviewPayload())}
                  className="px-6 py-3 font-semibold border border-outline-variant text-on-surface rounded-lg bg-white hover:bg-surface-container transition-all active:scale-95 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                  Live Preview Unsaved
                </button>

                <button
                  disabled={isPublishing || isPublished}
                  className={`px-8 py-3 font-bold rounded-lg shadow-md transition-all flex items-center gap-2 ${
                    isPublished ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-primary-container active:scale-95"
                  }`}
                  type="submit"
                >
                  {isPublishing ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span>{" "}
                      {editId ? "Updating..." : "Publishing..."}
                    </>
                  ) : isPublished ? (
                    <>
                      <span className="material-symbols-outlined">check_circle</span>{" "}
                      {editId ? "Updated!" : "Published!"}
                    </>
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
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">
                {recentContent.length}
              </span>
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {recentContent.map((item) => (
                <div
                  key={item.id}
                  className={`flex justify-between items-start group hover:bg-surface p-2 -mx-2 rounded transition-colors ${
                    editId === item.id ? "bg-surface border border-primary/20" : ""
                  }`}
                >
                  <div
                    onClick={() => handleEditClick(item)}
                    className="flex items-center gap-3 cursor-pointer overflow-hidden min-w-0 flex-1"
                  >
                    <div
                      className={`w-10 h-10 rounded flex-shrink-0 flex items-center justify-center ${
                        item.status === "Published" ? "bg-primary/10" : "bg-secondary/10"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-sm ${
                          item.status === "Published" ? "text-primary" : "text-secondary"
                        }`}
                      >
                        {item.type === "Impact Stories"
                          ? "format_quote"
                          : item.status === "Published"
                          ? "image"
                          : "draft"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      {/* Clicking the title opens Preview; clicking the icon or the row opens Edit */}
                      <p
                        onClick={(e) => { e.stopPropagation(); handleSidebarPreview(item); }}
                        className={`text-sm font-bold hover:text-primary hover:underline cursor-pointer transition-colors truncate ${
                          editId === item.id ? "text-primary" : "text-on-surface"
                        }`}
                        title="Click to preview"
                      >
                        {item.title}
                      </p>
                      <p className="text-[12px] text-outline truncate">
                        {item.type} • {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 ml-2">
                    <button
                      onClick={() => handleSidebarPreview(item)}
                      className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                      title="Preview Content"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                      title="Edit Content"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteItem(item)}
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

      {/* Live Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex flex-col justify-start">
          {/* Sticky Header Control Bar */}
          <div className="sticky top-0 bg-slate-900 text-white z-10 px-6 py-4 flex justify-between items-center shadow-lg w-full">
            <div className="flex items-center gap-2">
              <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded text-xs font-bold uppercase">
                {previewItem.id === "draft-preview" ? "Live Unsaved Preview" : "Published Preview"}
              </span>
              <span className="text-slate-400 font-medium truncate max-w-sm sm:max-w-md">
                — {previewItem.title}
              </span>
            </div>
            <button
              onClick={() => setPreviewItem(null)}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold rounded-lg transition-all text-sm flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              Close Preview
            </button>
          </div>

          {/* Modal Content container */}
          <div className="bg-surface flex-grow p-4 md:p-8">
            <div className="max-w-[1200px] mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-outline-variant/30 py-8">
              <ProgramDetailView program={previewItem} />
            </div>
          </div>
        </div>
      )}

      {/* Rich Delete Confirmation Modal */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-outline-variant max-w-md w-full shadow-2xl p-6 overflow-hidden animate-fade-in space-y-6">
            <div>
              <h3 className="text-lg font-bold text-error flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span>
                Delete Program
              </h3>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                Are you sure you want to permanently delete this content item? This action is irreversible.
              </p>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-[11px] font-semibold text-outline uppercase tracking-wider">Title</p>
                <p className="text-sm font-bold text-on-surface">{deleteItem.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-outline uppercase tracking-wider">Type</p>
                  <p className="text-sm font-semibold text-on-surface">{deleteItem.type}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-outline uppercase tracking-wider">Published</p>
                  <p className="text-sm font-semibold text-on-surface">
                    {deleteItem.created_at ? new Date(deleteItem.created_at).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-outline uppercase tracking-wider">Gallery Images</p>
                <p className="text-sm font-semibold text-on-surface">
                  {deleteItem.images?.length || 0} images in strip
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold text-error italic bg-error/5 p-2.5 rounded border border-error/15">
              ⚠️ This action cannot be undone and will automatically remove all associated gallery database records.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteItem(null)}
                className="px-4 py-2 border border-outline-variant hover:bg-surface-container rounded-lg text-sm font-bold transition-all"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-5 py-2 bg-error hover:bg-error-container text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-1 active:scale-95"
              >
                {isDeleting ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Delete Program
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
