import MainLayout from "@/components/layout/MainLayout";
import { useState, useRef } from "react";
import { Upload, FileText, Presentation, File, Image, Video, X, Check, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const subjects = ["Data Structures", "Artificial Intelligence", "Mathematics", "Operating Systems", "Database Systems", "Computer Networks", "Physics", "Chemistry", "Economics", "Other"];

const fileTypeIcons: Record<string, typeof FileText> = {
  "application/pdf": FileText,
  "application/vnd.ms-powerpoint": Presentation,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": Presentation,
  "application/msword": File,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": File,
};

export default function UploadPage() {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploaded(true);
    setTimeout(() => setUploaded(false), 3000);
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setTags("");
    setSubject("");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <MainLayout title="Upload Notes" subtitle="Share your study materials with the community">
      <div className="p-6 max-w-3xl mx-auto">
        {uploaded && (
          <div className="mb-6 bg-success-light border border-success/30 text-success rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <Check className="w-5 h-5" />
            <p className="font-medium">Notes uploaded successfully! Your contribution will help other students.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drop zone */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              dragOver
                ? "border-primary bg-primary-light"
                : selectedFile
                ? "border-success bg-success-light"
                : "border-border hover:border-primary/50 hover:bg-secondary"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-success" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatSize(selectedFile.size)}</p>
                </div>
                <button
                  type="button"
                  className="ml-auto w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground text-lg">Drop your files here</h3>
                <p className="text-muted-foreground text-sm mt-1">or click to browse from your device</p>
                <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
                  {[
                    { icon: FileText, label: "PDF", color: "text-red-500" },
                    { icon: Presentation, label: "PPT", color: "text-orange-500" },
                    { icon: File, label: "DOC", color: "text-blue-500" },
                    { icon: Image, label: "IMG", color: "text-green-500" },
                    { icon: Video, label: "VID", color: "text-purple-500" },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-xl">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-xs font-medium text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">Max file size: 50MB</p>
              </>
            )}
          </div>

          {/* Form fields */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
            <div>
              <Label className="text-sm font-medium text-foreground">Title *</Label>
              <Input
                className="mt-1.5"
                placeholder="e.g., Complete Data Structures Notes - Week 7"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-foreground">Subject *</Label>
              <div className="relative mt-1.5">
                <select
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm appearance-none focus:ring-2 focus:ring-ring focus:outline-none"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-foreground">Description</Label>
              <Textarea
                className="mt-1.5 resize-none"
                placeholder="Briefly describe what topics are covered in these notes..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-foreground">Tags</Label>
              <Input
                className="mt-1.5"
                placeholder="e.g., trees, graphs, recursion (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Tags help others discover your notes</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 gradient-primary text-white h-11 shadow-glow text-base"
              disabled={!selectedFile || !title || !subject}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload & Share
            </Button>
            <Button type="button" variant="outline" className="h-11 px-6">
              Save Draft
            </Button>
          </div>

          <div className="flex items-start gap-2 p-4 bg-accent-light rounded-xl border border-accent/20">
            <AlertCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <p className="text-xs text-accent-foreground">
              By uploading, you confirm that these notes are your own work or you have permission to share them. Plagiarized content will be removed.
            </p>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
