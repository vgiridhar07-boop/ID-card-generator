import React, { useState } from 'react';
import { CardOrientation, ExportFormat } from '@/types/id-card';
import { exportCardSideAsPng, exportCr80Pdf, exportA4SheetPdf } from '@/lib/export-card';
import { X, Download, FileText, Image as ImageIcon, Printer, CheckCircle, Loader2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  getFrontNode: () => HTMLElement | null;
  getBackNode: () => HTMLElement | null;
  orientation: CardOrientation;
  studentName: string;
  studentId: string;
  institutionName: string;
  course: string;
}

export function ExportModal({
  isOpen,
  onClose,
  getFrontNode,
  getBackNode,
  orientation,
  studentName,
  studentId,
  institutionName,
  course,
}: ExportModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const sanitizeFilename = (suffix: string) => {
    const rawId = studentId || 'STUDENT';
    const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
    return `${cleanId}_${suffix}`;
  };

  const handleExportCr80 = async () => {
    const frontNode = getFrontNode();
    const backNode = getBackNode();
    if (!frontNode || !backNode) {
      alert('Card capture nodes not ready. Please try again in a moment.');
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage('Rasterizing CR80 Front & Back at 300 DPI...');
      const filename = sanitizeFilename('CR80_Card');
      await exportCr80Pdf(frontNode, backNode, filename, orientation);
      setStatusMessage('CR80 PDF generated successfully!');
      setTimeout(() => {
        setIsProcessing(false);
        setStatusMessage(null);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('CR80 PDF Export error:', err);
      alert('Failed to generate CR80 PDF. Please check console for details.');
      setIsProcessing(false);
      setStatusMessage(null);
    }
  };

  const handleExportA4Sheet = async () => {
    const frontNode = getFrontNode();
    const backNode = getBackNode();
    if (!frontNode || !backNode) {
      alert('Card capture nodes not ready.');
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage('Composing A4 Print Sheet with precision crop marks...');
      const filename = sanitizeFilename('A4_Print_Sheet');
      await exportA4SheetPdf(frontNode, backNode, filename, orientation, {
        institutionName,
        studentName,
        studentId,
        course,
      });
      setStatusMessage('A4 Print Sheet exported successfully!');
      setTimeout(() => {
        setIsProcessing(false);
        setStatusMessage(null);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('A4 Sheet Export error:', err);
      alert('Failed to generate A4 Print Sheet PDF.');
      setIsProcessing(false);
      setStatusMessage(null);
    }
  };

  const handleExportPng = async (side: 'front' | 'back' | 'both') => {
    const frontNode = getFrontNode();
    const backNode = getBackNode();
    if (!frontNode || !backNode) return;

    try {
      setIsProcessing(true);
      if (side === 'front' || side === 'both') {
        setStatusMessage('Exporting high-resolution Front PNG (3x Scale)...');
        await exportCardSideAsPng(frontNode, sanitizeFilename('Front'));
      }
      if (side === 'back' || side === 'both') {
        setStatusMessage('Exporting high-resolution Back PNG (3x Scale)...');
        await exportCardSideAsPng(backNode, sanitizeFilename('Back'));
      }
      setStatusMessage('PNG Export complete!');
      setTimeout(() => {
        setIsProcessing(false);
        setStatusMessage(null);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('PNG Export error:', err);
      alert('Failed to export PNG.');
      setIsProcessing(false);
      setStatusMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs select-none overflow-y-auto">
      <div className="w-full max-w-lg bg-studio-panel border border-studio-border rounded-lg shadow-float overflow-hidden my-auto max-h-[92vh] max-h-[92dvh] flex flex-col">
        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-studio-border flex items-center justify-between bg-studio-canvas shrink-0">
          <div>
            <h2 className="font-sans font-bold text-[14.5px] sm:text-[15px] text-studio-ink-primary">
              Export Production ID Card
            </h2>
            <p className="text-[10.5px] sm:text-[11px] text-studio-ink-secondary mt-0.5">
              Select export format for direct PVC printing or standard sheet die-cutting.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="min-h-[44px] min-w-[44px] -mr-2 rounded text-studio-ink-muted hover:text-studio-ink-primary hover:bg-studio-subtle transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-5 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">
          {/* Status Message / Spinner */}
          {isProcessing && (
            <div className="p-3 bg-studio-canvas border border-studio-action/30 rounded-md flex items-center gap-3 text-studio-action">
              <Loader2 className="w-5 h-5 animate-spin shrink-0" />
              <span className="font-mono text-[12px] font-medium">{statusMessage}</span>
            </div>
          )}

          {/* Option 1: CR80 Single Card PDF */}
          <div className="p-3 sm:p-3.5 border border-studio-border hover:border-studio-action/40 rounded-lg bg-white transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-studio-subtle flex items-center justify-center text-studio-action shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[13px] text-studio-ink-primary">
                      CR80 Direct PVC Card PDF
                    </span>
                    <span className="px-1.5 py-0.2 bg-studio-action text-white rounded text-[9.5px] font-mono">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-studio-ink-secondary mt-0.5 leading-snug">
                    2-Page document (Page 1: Front, Page 2: Back) sized strictly to 53.98 × 85.60 mm. Zero margins, formatted for direct card printers (Zebra, Fargo, Evolis).
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleExportCr80}
                disabled={isProcessing}
                className="w-full sm:w-auto min-h-[44px] sm:min-h-0 px-4 py-2 bg-studio-action hover:bg-studio-action-hover text-white rounded text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CR80 PDF</span>
              </button>
            </div>
          </div>

          {/* Option 2: A4 Print Sheet PDF */}
          <div className="p-3 sm:p-3.5 border border-studio-border hover:border-studio-action/40 rounded-lg bg-white transition-all">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded bg-studio-subtle flex items-center justify-center text-studio-ink-primary shrink-0 mt-0.5">
                <Printer className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-[13px] text-studio-ink-primary block">
                  A4 Print Sheet PDF with Cut Guides
                </span>
                <p className="text-[11px] text-studio-ink-secondary mt-0.5 leading-snug">
                  Front and Back laid out side-by-side on standard 210 × 297 mm paper with precision corner register crop marks, folding centerline, and institution specifications.
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleExportA4Sheet}
                disabled={isProcessing}
                className="w-full sm:w-auto min-h-[44px] sm:min-h-0 px-4 py-2 bg-studio-panel hover:bg-studio-subtle border border-studio-border text-studio-ink-primary rounded text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Printer className="w-3.5 h-3.5 text-studio-ink-secondary" />
                <span>Export A4 Sheet PDF</span>
              </button>
            </div>
          </div>

          {/* Option 3: PNG High-Res */}
          <div className="p-3 sm:p-3.5 border border-studio-border rounded-lg bg-white">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded bg-studio-subtle flex items-center justify-center text-studio-ink-primary shrink-0 mt-0.5">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-[13px] text-studio-ink-primary block">
                  High-Resolution PNG (300 DPI Equivalent)
                </span>
                <p className="text-[11px] text-studio-ink-secondary mt-0.5 leading-snug">
                  Sharp raster images (972 × 1542 px at 3x scale) ideal for student portals, archival records, or digital wallets.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => handleExportPng('front')}
                    disabled={isProcessing}
                    className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-0 px-3 py-2 sm:py-1 bg-studio-canvas hover:bg-studio-subtle border border-studio-border text-studio-ink-primary rounded text-[11.5px] font-medium transition-colors text-center"
                  >
                    Front PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportPng('back')}
                    disabled={isProcessing}
                    className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-0 px-3 py-2 sm:py-1 bg-studio-canvas hover:bg-studio-subtle border border-studio-border text-studio-ink-primary rounded text-[11.5px] font-medium transition-colors text-center"
                  >
                    Back PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportPng('both')}
                    disabled={isProcessing}
                    className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-0 px-3 py-2 sm:py-1 bg-studio-canvas hover:bg-studio-subtle border border-studio-border text-studio-ink-primary rounded text-[11.5px] font-medium transition-colors text-center"
                  >
                    Both Sides
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-studio-border bg-studio-canvas flex items-center justify-between text-[11px] font-mono text-studio-ink-muted shrink-0 pb-safe">
          <span className="truncate">Standard: ISO/IEC 7810 ID-1</span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-3 py-1 text-studio-ink-secondary hover:text-studio-ink-primary font-medium flex items-center justify-center transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
