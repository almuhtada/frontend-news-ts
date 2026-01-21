import { useState, useEffect, useCallback } from "react";
import { aboutService } from "../../../services/about";
import { API_BASE_URL } from "../../../config/api";
import type { AboutSection, SectionFormData } from "./types";

export const useAboutPage = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, SectionFormData>>({});
  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await aboutService.getAll();
      setSections(response.data);

      const initialFormData: Record<string, SectionFormData> = {};
      const initialPreviews: Record<string, string> = {};

      response.data.forEach((section) => {
        initialFormData[section.section_key] = {
          title: section.title || "",
          content: section.content || "",
          image_url: section.image_url || "",
        };
        if (section.image_url) {
          const imageUrl = section.image_url.startsWith("http")
            ? section.image_url
            : `http://localhost:3001${section.image_url}`;
          initialPreviews[section.section_key] = imageUrl;
        }
      });

      setFormData(initialFormData);
      setImagePreviews(initialPreviews);
    } catch (error) {
      console.error("Error fetching about sections:", error);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleInputChange = useCallback(
    (key: string, field: "title" | "content" | "image_url", value: string) => {
      setFormData((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          [field]: value,
        },
      }));
    },
    []
  );

  const handleImageChange = useCallback(
    (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          alert("File harus berupa gambar");
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert("Ukuran file maksimal 5MB");
          return;
        }

        setImageFiles((prev) => ({ ...prev, [key]: file }));

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => ({
            ...prev,
            [key]: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const removeImage = useCallback((key: string) => {
    setImageFiles((prev) => ({ ...prev, [key]: null }));
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[key];
      return newPreviews;
    });
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        image_url: "",
      },
    }));
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.data.url;
  };

  const handleSave = async (sectionKey: string) => {
    try {
      setSaving(true);
      setUploading((prev) => ({ ...prev, [sectionKey]: true }));

      let imageUrl = formData[sectionKey].image_url;

      const imageFile = imageFiles[sectionKey];
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const data = formData[sectionKey];
      const section = sections.find((s) => s.section_key === sectionKey);

      await aboutService.upsert({
        section_key: sectionKey,
        title: data.title,
        content: data.content,
        image_url: imageUrl || undefined,
        order_number: section?.order_number || 0,
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setImageFiles((prev) => ({ ...prev, [sectionKey]: null }));

      await fetchSections();
    } catch (error) {
      console.error("Error saving section:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setSaving(false);
      setUploading((prev) => ({ ...prev, [sectionKey]: false }));
    }
  };

  return {
    // State
    sections,
    loading,
    saving,
    showSuccess,
    showError,
    uploading,
    formData,
    imagePreviews,

    // Actions
    handleInputChange,
    handleImageChange,
    removeImage,
    handleSave,
  };
};
