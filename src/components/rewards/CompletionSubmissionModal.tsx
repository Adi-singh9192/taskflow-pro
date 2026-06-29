import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Link, Code, FileText, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { Task } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import api from '../../lib/api';
import toast from 'react-hot-toast';

interface CompletionSubmissionModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (verificationResult: any) => void;
}

const PROOF_TYPES = [
  { id: "Screenshot", label: "Screenshot Image", icon: UploadCloud, placeholder: "Enter direct image URL or upload details" },
  { id: "GitHub Repository", label: "GitHub Repository", icon: Code, placeholder: "e.g., https://github.com/username/project" },
  { id: "Live Website URL", label: "Live Website URL", icon: Link, placeholder: "e.g., https://my-deployed-app.vercel.app" },
  { id: "PDF", label: "PDF Document", icon: FileText, placeholder: "Enter document URL or submission link" },
  { id: "Google Drive Link", label: "Google Drive Link", icon: Link, placeholder: "e.g., https://drive.google.com/file/d/..." },
  { id: "Image", label: "Image File URL", icon: UploadCloud, placeholder: "Enter direct image URL" },
  { id: "Video", label: "Video File URL", icon: Link, placeholder: "Enter screen recording or demo video URL" },
  { id: "Document", label: "Document Link", icon: FileText, placeholder: "Enter Google Doc, Notion, or text link" },
  { id: "External URL", label: "External URL", icon: Link, placeholder: "Enter any external proof URL" }
];

export function CompletionSubmissionModal({ task, isOpen, onClose, onSuccess }: CompletionSubmissionModalProps) {
  const [proofType, setProofType] = useState("GitHub Repository");
  const [proofValue, setProofValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofValue.trim()) {
      return toast.error("Please provide the proof details or link!");
    }

    setIsVerifying(true);
    const loadingToast = toast.loading("Gemini AI is auditing your proof submission... Please wait.", {
      style: {
        border: '1px solid var(--color-primary)',
        background: 'var(--color-card)',
        color: 'var(--color-text-main)',
      }
    });

    try {
      const response = await api.post(`/rewards/tasks/${task._id}/submit-completion`, {
        proofType,
        proofValue
      });
      
      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        toast.success("Task verification complete! Rewards granted.");
        onSuccess(response.data);
      } else {
        toast.error("AI Verification Failed. Please see feedback.");
        onSuccess(response.data); // Still open the verification result view to show reasoning
      }
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.error || "Task verification failed. Check connection.");
    } finally {
      setIsVerifying(false);
    }
  };

  const activeProof = PROOF_TYPES.find(p => p.id === proofType) || PROOF_TYPES[1];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg overflow-hidden"
      >
        <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-card)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--color-primary)] animate-pulse" />
              <div>
                <h2 className="font-heading font-bold text-lg text-[var(--color-text-main)]">Submit Proof of Work</h2>
                <p className="text-[11px] text-[var(--color-text-muted)] truncate max-w-[300px]">
                  Task: {task.title}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              disabled={isVerifying}
              className="p-2 text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-hover)] rounded-xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
            <div className="p-4 rounded-xl bg-gradient-to-r from-[rgba(232,255,0,0.04)] to-[rgba(255,28,247,0.04)] border border-[rgba(232,255,0,0.1)] flex gap-3">
              <AlertCircle className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
              <div className="text-xs text-[var(--color-text-muted)] space-y-1">
                <span className="font-bold text-[var(--color-text-main)]">How Verification Works:</span>
                <p>Submit genuine, high-quality proof. Google Gemini analyzes repository commits, visual screenshots, URLs, or deliverables to evaluate authenticity and quality.</p>
              </div>
            </div>

            {/* Proof Type Selector */}
            <div className="space-y-2">
              <label className="text-xs text-[var(--color-text-muted)] font-bold uppercase tracking-widest">
                Select Proof Type
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-[var(--color-border)] bg-[var(--color-background)] rounded-xl">
                {PROOF_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = proofType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setProofType(type.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[rgba(232,255,0,0.08)] border-[var(--color-primary)] text-[var(--color-primary)] shadow-md"
                          : "bg-transparent border-transparent text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-hover)]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Proof Value input */}
            <div className="space-y-2">
              <label className="text-xs text-[var(--color-text-muted)] font-bold uppercase tracking-widest flex items-center justify-between">
                <span>Proof URL or Link</span>
                <span className="text-[10px] font-mono normal-case text-[var(--color-primary)]">
                  Required
                </span>
              </label>
              <div className="relative">
                <activeProof.icon className="absolute left-3 top-3 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  required
                  placeholder={activeProof.placeholder}
                  value={proofValue}
                  onChange={(e) => setProofValue(e.target.value)}
                  disabled={isVerifying}
                  className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--color-text-main)] transition-all"
                />
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                Provide a shareable, open access link (e.g., public Github repos, public Drive links) so the AI can verify successfully.
              </p>
            </div>

            {/* Submit buttons */}
            <div className="pt-4 border-t border-[var(--color-border)] flex gap-3">
              <Button
                variant="ghost"
                type="button"
                disabled={isVerifying}
                onClick={onClose}
                className="flex-1 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isVerifying}
                className="flex-1 gap-2 bg-[var(--color-primary)] text-black hover:opacity-90 cursor-pointer shadow-[0_0_15px_rgba(232,255,0,0.35)]"
              >
                <Sparkles className="w-4 h-4" />
                {isVerifying ? "AI Auditing..." : "Submit Verification"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
