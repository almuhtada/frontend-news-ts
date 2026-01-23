import React, { useState, useEffect } from "react";
import {
  Save,
  RefreshCw,
  FileText,
  BookOpen,
  Users,
  ClipboardList,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Sidebar from "../../components/components-admin/sidebar";
import {
  pageContentsService,
  defaultGriyaQuranContent,
  defaultProgramPengajarContent,
  defaultPendaftaranContent,
  type GriyaQuranContent,
  type ProgramPengajarContent,
  type PendaftaranContent,
  type GriyaQuranProgram,
  type GriyaQuranHalaqah,
  type PengurusItem,
  type AccountItem,
  type WhatsappContact,
} from "../../services/pageContents";

type TabType = "griya-quran" | "program-pengajar" | "pendaftaran";

const PageContents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("griya-quran");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Content states
  const [griyaQuran, setGriyaQuran] = useState<GriyaQuranContent>(
    defaultGriyaQuranContent,
  );
  const [programPengajar, setProgramPengajar] =
    useState<ProgramPengajarContent>(defaultProgramPengajarContent);
  const [pendaftaran, setPendaftaran] = useState<PendaftaranContent>(
    defaultPendaftaranContent,
  );

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Fetch all contents
  const fetchContents = async () => {
    setIsLoading(true);
    try {
      const [griya, program, daftar] = await Promise.all([
        pageContentsService
          .getByKey<GriyaQuranContent>("griya-quran")
          .catch(() => null),
        pageContentsService
          .getByKey<ProgramPengajarContent>("program-pengajar")
          .catch(() => null),
        pageContentsService
          .getByKey<PendaftaranContent>("pendaftaran")
          .catch(() => null),
      ]);

      if (griya?.data?.content) setGriyaQuran(griya.data.content);
      if (program?.data?.content) setProgramPengajar(program.data.content);
      if (daftar?.data?.content) setPendaftaran(daftar.data.content);
    } catch (error) {
      console.error("Error fetching contents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSave = async (key: TabType) => {
    setIsSaving(true);
    try {
      let content;
      let title;
      switch (key) {
        case "griya-quran":
          content = griyaQuran;
          title = "Griya Quran";
          break;
        case "program-pengajar":
          content = programPengajar;
          title = "Program & Pengajar";
          break;
        case "pendaftaran":
          content = pendaftaran;
          title = "Pendaftaran";
          break;
      }

      await pageContentsService.upsert({
        page_key: key,
        title,
        content,
        status: "publish",
      });

      setSuccessMessage(`${title} berhasil disimpan!`);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { key: "griya-quran" as TabType, label: "Griya Quran", icon: BookOpen },
    {
      key: "program-pengajar" as TabType,
      label: "Program & Pengajar",
      icon: Users,
    },
    {
      key: "pendaftaran" as TabType,
      label: "Pendaftaran",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Kelola Konten Halaman
            </h1>
          </div>
          <p className="text-slate-600">
            Edit konten halaman Griya Quran, Program Pengajar, dan Pendaftaran
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-4" />
            <p className="text-slate-500">Memuat konten...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Content Editor */}
            <div className="p-6">
              {activeTab === "griya-quran" && (
                <GriyaQuranEditor
                  content={griyaQuran}
                  onChange={setGriyaQuran}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                />
              )}
              {activeTab === "program-pengajar" && (
                <ProgramPengajarEditor
                  content={programPengajar}
                  onChange={setProgramPengajar}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                />
              )}
              {activeTab === "pendaftaran" && (
                <PendaftaranEditor
                  content={pendaftaran}
                  onChange={setPendaftaran}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                />
              )}
            </div>

            {/* Save Button */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => handleSave(activeTab)}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-slate-300 transition-all"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {successMessage}
          </div>
        )}
      </main>
    </div>
  );
};

// ============================================
// Section Component
// ============================================
interface SectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  isExpanded,
  onToggle,
  children,
}) => (
  <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
    >
      <span className="font-semibold text-slate-700">{title}</span>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-slate-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-slate-500" />
      )}
    </button>
    {isExpanded && <div className="p-4 space-y-4">{children}</div>}
  </div>
);

// ============================================
// Input Components
// ============================================
const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}> = ({ label, value, onChange, placeholder, multiline }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
      />
    )}
  </div>
);

// ============================================
// Griya Quran Editor
// ============================================
interface GriyaQuranEditorProps {
  content: GriyaQuranContent;
  onChange: (content: GriyaQuranContent) => void;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
}

const GriyaQuranEditor: React.FC<GriyaQuranEditorProps> = ({
  content,
  onChange,
  expandedSections,
  toggleSection,
}) => {
  const updateHeader = (
    field: keyof GriyaQuranContent["header"],
    value: string,
  ) => {
    onChange({ ...content, header: { ...content.header, [field]: value } });
  };

  const updateVisiMisi = (field: "visi" | "misi", value: string | string[]) => {
    onChange({ ...content, vpiMisi: { ...content.vpiMisi, [field]: value } });
  };

  const updateProgram = (
    index: number,
    field: keyof GriyaQuranProgram,
    value: string,
  ) => {
    const newPrograms = [...content.programs];
    newPrograms[index] = { ...newPrograms[index], [field]: value };
    onChange({ ...content, programs: newPrograms });
  };

  const addProgram = () => {
    onChange({
      ...content,
      programs: [
        ...content.programs,
        { title: "", description: "", schedule: "" },
      ],
    });
  };

  const removeProgram = (index: number) => {
    onChange({
      ...content,
      programs: content.programs.filter((_, i) => i !== index),
    });
  };

  const updateHalaqah = (
    index: number,
    field: keyof GriyaQuranHalaqah,
    value: string,
  ) => {
    const newHalaqah = [...content.halaqah];
    newHalaqah[index] = { ...newHalaqah[index], [field]: value };
    onChange({ ...content, halaqah: newHalaqah });
  };

  const addHalaqah = () => {
    onChange({
      ...content,
      halaqah: [...content.halaqah, { name: "", description: "" }],
    });
  };

  const removeHalaqah = (index: number) => {
    onChange({
      ...content,
      halaqah: content.halaqah.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <Section
        title="Header"
        isExpanded={expandedSections["gq-header"] !== false}
        onToggle={() => toggleSection("gq-header")}
      >
        <InputField
          label="Judul"
          value={content.header.title}
          onChange={(v) => updateHeader("title", v)}
        />
        <InputField
          label="Deskripsi"
          value={content.header.description}
          onChange={(v) => updateHeader("description", v)}
          multiline
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Alamat"
            value={content.header.address}
            onChange={(v) => updateHeader("address", v)}
          />
          <InputField
            label="Telepon"
            value={content.header.phone}
            onChange={(v) => updateHeader("phone", v)}
          />
        </div>
      </Section>

      <Section
        title="Visi & Misi"
        isExpanded={expandedSections["gq-visimisi"] !== false}
        onToggle={() => toggleSection("gq-visimisi")}
      >
        <InputField
          label="Visi"
          value={content.vpiMisi.visi}
          onChange={(v) => updateVisiMisi("visi", v)}
          multiline
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Misi
          </label>
          {content.vpiMisi.misi.map((misi, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={misi}
                onChange={(e) => {
                  const newMisi = [...content.vpiMisi.misi];
                  newMisi[i] = e.target.value;
                  updateVisiMisi("misi", newMisi);
                }}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <button
                onClick={() =>
                  updateVisiMisi(
                    "misi",
                    content.vpiMisi.misi.filter((_, idx) => idx !== i),
                  )
                }
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              updateVisiMisi("misi", [...content.vpiMisi.misi, ""])
            }
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="w-4 h-4" /> Tambah Misi
          </button>
        </div>
      </Section>

      <Section
        title="Program"
        isExpanded={expandedSections["gq-programs"] !== false}
        onToggle={() => toggleSection("gq-programs")}
      >
        {content.programs.map((program, i) => (
          <div key={i} className="p-4 bg-slate-50 rounded-lg mb-3">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-slate-500">
                Program {i + 1}
              </span>
              <button
                onClick={() => removeProgram(i)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <InputField
                label="Judul"
                value={program.title}
                onChange={(v) => updateProgram(i, "title", v)}
              />
              <InputField
                label="Deskripsi"
                value={program.description}
                onChange={(v) => updateProgram(i, "description", v)}
              />
              <InputField
                label="Jadwal"
                value={program.schedule}
                onChange={(v) => updateProgram(i, "schedule", v)}
              />
            </div>
          </div>
        ))}
        <button
          onClick={addProgram}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-4 h-4" /> Tambah Program
        </button>
      </Section>

      <Section
        title="Halaqah"
        isExpanded={expandedSections["gq-halaqah"] !== false}
        onToggle={() => toggleSection("gq-halaqah")}
      >
        {content.halaqah.map((h, i) => (
          <div key={i} className="p-4 bg-slate-50 rounded-lg mb-3">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-slate-500">
                Halaqah {i + 1}
              </span>
              <button
                onClick={() => removeHalaqah(i)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Nama"
                value={h.name}
                onChange={(v) => updateHalaqah(i, "name", v)}
              />
              <InputField
                label="Keterangan"
                value={h.description}
                onChange={(v) => updateHalaqah(i, "description", v)}
              />
            </div>
          </div>
        ))}
        <button
          onClick={addHalaqah}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-4 h-4" /> Tambah Halaqah
        </button>
      </Section>
    </div>
  );
};

// ============================================
// Program Pengajar Editor
// ============================================
interface ProgramPengajarEditorProps {
  content: ProgramPengajarContent;
  onChange: (content: ProgramPengajarContent) => void;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
}

const ProgramPengajarEditor: React.FC<ProgramPengajarEditorProps> = ({
  content,
  onChange,
  expandedSections,
  toggleSection,
}) => {
  const updateHeader = (
    field: keyof ProgramPengajarContent["header"],
    value: string,
  ) => {
    onChange({ ...content, header: { ...content.header, [field]: value } });
  };

  const updateList = (
    field: "programs" | "masyayikh" | "asatidz" | "mentors",
    value: string[],
  ) => {
    onChange({ ...content, [field]: value });
  };

  const updatePengurus = (
    index: number,
    field: keyof PengurusItem,
    value: string,
  ) => {
    const newPengurus = [...content.pengurus];
    newPengurus[index] = { ...newPengurus[index], [field]: value };
    onChange({ ...content, pengurus: newPengurus });
  };

  const ListEditor: React.FC<{
    field: "programs" | "masyayikh" | "asatidz" | "mentors";
    title: string;
  }> = ({ field, title }) => (
    <Section
      title={title}
      isExpanded={expandedSections[`pp-${field}`] !== false}
      onToggle={() => toggleSection(`pp-${field}`)}
    >
      {content[field].map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const newList = [...content[field]];
              newList[i] = e.target.value;
              updateList(field, newList);
            }}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <button
            onClick={() =>
              updateList(
                field,
                content[field].filter((_, idx) => idx !== i),
              )
            }
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={() => updateList(field, [...content[field], ""])}
        className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
      >
        <Plus className="w-4 h-4" /> Tambah
      </button>
    </Section>
  );

  return (
    <div>
      <Section
        title="Header"
        isExpanded={expandedSections["pp-header"] !== false}
        onToggle={() => toggleSection("pp-header")}
      >
        <InputField
          label="Judul"
          value={content.header.title}
          onChange={(v) => updateHeader("title", v)}
        />
        <InputField
          label="Deskripsi"
          value={content.header.description}
          onChange={(v) => updateHeader("description", v)}
          multiline
        />
      </Section>

      <ListEditor field="programs" title="Program Pesantren" />
      <ListEditor field="masyayikh" title="Dewan Masyayikh" />
      <ListEditor field="asatidz" title="Dewan Guru / Asatidz" />

      <Section
        title="Badan Pengurus"
        isExpanded={expandedSections["pp-pengurus"] !== false}
        onToggle={() => toggleSection("pp-pengurus")}
      >
        {content.pengurus.map((p, i) => (
          <div key={i} className="p-4 bg-slate-50 rounded-lg mb-3">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-slate-500">
                Pengurus {i + 1}
              </span>
              <button
                onClick={() =>
                  onChange({
                    ...content,
                    pengurus: content.pengurus.filter((_, idx) => idx !== i),
                  })
                }
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Jabatan"
                value={p.role}
                onChange={(v) => updatePengurus(i, "role", v)}
              />
              <InputField
                label="Nama"
                value={p.name}
                onChange={(v) => updatePengurus(i, "name", v)}
              />
            </div>
          </div>
        ))}
        <button
          onClick={() =>
            onChange({
              ...content,
              pengurus: [...content.pengurus, { role: "", name: "" }],
            })
          }
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-4 h-4" /> Tambah Pengurus
        </button>
      </Section>

      <ListEditor field="mentors" title="Tim Mentor" />

      <Section
        title="CTA"
        isExpanded={expandedSections["pp-cta"] !== false}
        onToggle={() => toggleSection("pp-cta")}
      >
        <InputField
          label="Teks CTA"
          value={content.ctaText}
          onChange={(v) => onChange({ ...content, ctaText: v })}
          multiline
        />
      </Section>
    </div>
  );
};

// ============================================
// Pendaftaran Editor
// ============================================
interface PendaftaranEditorProps {
  content: PendaftaranContent;
  onChange: (content: PendaftaranContent) => void;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
}

const PendaftaranEditor: React.FC<PendaftaranEditorProps> = ({
  content,
  onChange,
  expandedSections,
  toggleSection,
}) => {
  const updateHeader = (
    field: keyof PendaftaranContent["header"],
    value: string,
  ) => {
    onChange({ ...content, header: { ...content.header, [field]: value } });
  };

  const updateAccount = (
    index: number,
    field: keyof AccountItem,
    value: string,
  ) => {
    const newAccounts = [...content.accounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    onChange({ ...content, accounts: newAccounts });
  };

  const updateContact = (
    index: number,
    field: keyof WhatsappContact,
    value: string,
  ) => {
    const newContacts = [...content.whatsappContacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    onChange({ ...content, whatsappContacts: newContacts });
  };

  return (
    <div>
      <Section
        title="Header"
        isExpanded={expandedSections["pf-header"] !== false}
        onToggle={() => toggleSection("pf-header")}
      >
        <InputField
          label="Judul"
          value={content.header.title}
          onChange={(v) => updateHeader("title", v)}
        />
        <InputField
          label="Deskripsi"
          value={content.header.description}
          onChange={(v) => updateHeader("description", v)}
          multiline
        />
      </Section>

      <Section
        title="Informasi Umum"
        isExpanded={expandedSections["pf-info"] !== false}
        onToggle={() => toggleSection("pf-info")}
      >
        <InputField
          label="Link Formulir"
          value={content.formLink}
          onChange={(v) => onChange({ ...content, formLink: v })}
        />
        <InputField
          label="Biaya Pendaftaran"
          value={content.registrationFee}
          onChange={(v) => onChange({ ...content, registrationFee: v })}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Tanggal Mulai"
            value={content.timelineStart}
            onChange={(v) => onChange({ ...content, timelineStart: v })}
          />
          <InputField
            label="Tanggal Selesai"
            value={content.timelineEnd}
            onChange={(v) => onChange({ ...content, timelineEnd: v })}
          />
        </div>
      </Section>

      <Section
        title="Persyaratan"
        isExpanded={expandedSections["pf-requirements"] !== false}
        onToggle={() => toggleSection("pf-requirements")}
      >
        {content.requirements.map((req, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={req}
              onChange={(e) => {
                const newReqs = [...content.requirements];
                newReqs[i] = e.target.value;
                onChange({ ...content, requirements: newReqs });
              }}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <button
              onClick={() =>
                onChange({
                  ...content,
                  requirements: content.requirements.filter(
                    (_, idx) => idx !== i,
                  ),
                })
              }
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            onChange({
              ...content,
              requirements: [...content.requirements, ""],
            })
          }
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-4 h-4" /> Tambah Persyaratan
        </button>
      </Section>

      <Section
        title="Rekening Pembayaran"
        isExpanded={expandedSections["pf-accounts"] !== false}
        onToggle={() => toggleSection("pf-accounts")}
      >
        {content.accounts.map((acc, i) => (
          <div key={i} className="p-4 bg-slate-50 rounded-lg mb-3">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-slate-500">
                Rekening {i + 1}
              </span>
              <button
                onClick={() =>
                  onChange({
                    ...content,
                    accounts: content.accounts.filter((_, idx) => idx !== i),
                  })
                }
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputField
                label="Bank/E-Wallet"
                value={acc.bank}
                onChange={(v) => updateAccount(i, "bank", v)}
              />
              <InputField
                label="Nomor Rekening"
                value={acc.number}
                onChange={(v) => updateAccount(i, "number", v)}
              />
              <InputField
                label="Atas Nama"
                value={acc.name}
                onChange={(v) => updateAccount(i, "name", v)}
              />
            </div>
          </div>
        ))}
        <button
          onClick={() =>
            onChange({
              ...content,
              accounts: [
                ...content.accounts,
                { bank: "", number: "", name: "" },
              ],
            })
          }
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-4 h-4" /> Tambah Rekening
        </button>
      </Section>

      <Section
        title="Kontak WhatsApp"
        isExpanded={expandedSections["pf-contacts"] !== false}
        onToggle={() => toggleSection("pf-contacts")}
      >
        {content.whatsappContacts.map((contact, i) => (
          <div key={i} className="p-4 bg-slate-50 rounded-lg mb-3">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-slate-500">
                Kontak {i + 1}
              </span>
              <button
                onClick={() =>
                  onChange({
                    ...content,
                    whatsappContacts: content.whatsappContacts.filter(
                      (_, idx) => idx !== i,
                    ),
                  })
                }
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Nama"
                value={contact.name}
                onChange={(v) => updateContact(i, "name", v)}
              />
              <InputField
                label="Nomor WA"
                value={contact.number}
                onChange={(v) => updateContact(i, "number", v)}
              />
            </div>
          </div>
        ))}
        <button
          onClick={() =>
            onChange({
              ...content,
              whatsappContacts: [
                ...content.whatsappContacts,
                { name: "", number: "" },
              ],
            })
          }
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-4 h-4" /> Tambah Kontak
        </button>
      </Section>

      <Section
        title="Langkah Pendaftaran"
        isExpanded={expandedSections["pf-steps"] !== false}
        onToggle={() => toggleSection("pf-steps")}
      >
        {content.steps.map((step, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
              {i + 1}
            </span>
            <input
              type="text"
              value={step}
              onChange={(e) => {
                const newSteps = [...content.steps];
                newSteps[i] = e.target.value;
                onChange({ ...content, steps: newSteps });
              }}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <button
              onClick={() =>
                onChange({
                  ...content,
                  steps: content.steps.filter((_, idx) => idx !== i),
                })
              }
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            onChange({ ...content, steps: [...content.steps, ""] })
          }
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-4 h-4" /> Tambah Langkah
        </button>
      </Section>
    </div>
  );
};

export default PageContents;
