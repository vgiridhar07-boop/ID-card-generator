import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CardOrientation } from '@/types/id-card';
import { PRINT_GEOMETRY } from './constants';

interface CaptureOptions {
  scale?: number;
  backgroundColor?: string | null;
}

/**
 * Capture an offscreen or onscreen DOM node as high-res Canvas using html2canvas
 */
export async function captureNodeToCanvas(node: HTMLElement, options: CaptureOptions = {}): Promise<HTMLCanvasElement> {
  const scale = options.scale ?? PRINT_GEOMETRY.capturePx.scale;
  return await html2canvas(node, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: options.backgroundColor ?? null,
    logging: false,
    imageTimeout: 15000,
  });
}

/**
 * Exports a single side (Front or Back) as a crisp high-res 300 DPI PNG file
 */
export async function exportCardSideAsPng(node: HTMLElement, filename: string): Promise<void> {
  const canvas = await captureNodeToCanvas(node);
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  
  const link = document.createElement('a');
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports Mode 1 — Direct CR80 PVC Card PDF (Page 1 Front, Page 2 Back)
 * Dimensions strictly follow ISO/IEC 7810 ID-1 (53.98mm x 85.60mm or 85.60mm x 53.98mm)
 */
export async function exportCr80Pdf(
  frontNode: HTMLElement,
  backNode: HTMLElement,
  filename: string,
  orientation: CardOrientation
): Promise<void> {
  const isPortrait = orientation === 'portrait';
  const widthMm = isPortrait ? PRINT_GEOMETRY.mm.portrait.width : PRINT_GEOMETRY.mm.landscape.width;
  const heightMm = isPortrait ? PRINT_GEOMETRY.mm.portrait.height : PRINT_GEOMETRY.mm.landscape.height;

  // Capture both sides in parallel for maximum performance
  const [frontCanvas, backCanvas] = await Promise.all([
    captureNodeToCanvas(frontNode),
    captureNodeToCanvas(backNode),
  ]);

  const frontImg = frontCanvas.toDataURL('image/png', 1.0);
  const backImg = backCanvas.toDataURL('image/png', 1.0);

  const pdf = new jsPDF({
    orientation: isPortrait ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [widthMm, heightMm],
    compress: true,
  });

  // Page 1: Front
  pdf.addImage(frontImg, 'PNG', 0, 0, widthMm, heightMm, undefined, 'FAST');

  // Page 2: Back
  pdf.addPage([widthMm, heightMm], isPortrait ? 'portrait' : 'landscape');
  pdf.addImage(backImg, 'PNG', 0, 0, widthMm, heightMm, undefined, 'FAST');

  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(cleanFilename);
}

/**
 * Draws precision corner crop marks for print shop guillotine cutting
 */
function drawCropMarks(
  pdf: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  markLength = 3.5,
  markOffset = 1.2
) {
  pdf.setDrawColor(90, 94, 105); // #5A5E69
  pdf.setLineWidth(0.12);

  // Top-Left corner
  pdf.line(x - markOffset - markLength, y, x - markOffset, y); // horizontal left
  pdf.line(x, y - markOffset - markLength, x, y - markOffset); // vertical top

  // Top-Right corner
  pdf.line(x + w + markOffset, y, x + w + markOffset + markLength, y); // horizontal right
  pdf.line(x + w, y - markOffset - markLength, x + w, y - markOffset); // vertical top

  // Bottom-Left corner
  pdf.line(x - markOffset - markLength, y + h, x - markOffset, y + h); // horizontal left
  pdf.line(x, y + h + markOffset, x, y + h + markOffset + markLength); // vertical bottom

  // Bottom-Right corner
  pdf.line(x + w + markOffset, y + h, x + w + markOffset + markLength, y + h); // horizontal right
  pdf.line(x + w, y + h + markOffset, x + w, y + h + markOffset + markLength); // vertical bottom
}

/**
 * Exports Mode 2 — Standard A4 Print Sheet PDF (210mm x 297mm)
 * Front & Back side-by-side with crop marks, alignment centerlines, and institutional metadata
 */
export async function exportA4SheetPdf(
  frontNode: HTMLElement,
  backNode: HTMLElement,
  filename: string,
  orientation: CardOrientation,
  metadata: {
    institutionName: string;
    studentName: string;
    studentId: string;
    course: string;
  }
): Promise<void> {
  const [frontCanvas, backCanvas] = await Promise.all([
    captureNodeToCanvas(frontNode),
    captureNodeToCanvas(backNode),
  ]);

  const frontImg = frontCanvas.toDataURL('image/png', 1.0);
  const backImg = backCanvas.toDataURL('image/png', 1.0);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', // 210 x 297 mm
    compress: true,
  });

  const pageWidth = 210;
  const isPortrait = orientation === 'portrait';
  const cardW = isPortrait ? PRINT_GEOMETRY.mm.portrait.width : PRINT_GEOMETRY.mm.landscape.width;
  const cardH = isPortrait ? PRINT_GEOMETRY.mm.portrait.height : PRINT_GEOMETRY.mm.landscape.height;

  // Header Typography
  pdf.setTextColor(24, 26, 31); // #181A1F
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('STUDENT IDENTIFICATION — OFFICIAL PRINT SPECIFICATION SHEET', 20, 22);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(90, 94, 105); // #5A5E69
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  pdf.text(
    `ISO/IEC 7810 ID-1 Standard (CR80) • Card Size: ${cardW.toFixed(2)} × ${cardH.toFixed(2)} mm • Generated: ${dateStr}`,
    20,
    27
  );

  // Institution & Student Metadata Banner
  pdf.setDrawColor(227, 223, 214); // #E3DFD6
  pdf.setFillColor(246, 245, 241); // #F6F5F1
  pdf.roundedRect(20, 31, 170, 14, 1.5, 1.5, 'FD');

  pdf.setFontSize(8.5);
  pdf.setTextColor(24, 26, 31);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`INSTITUTION:`, 24, 37);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${metadata.institutionName || 'Unspecified Institution'}`, 48, 37);

  pdf.setFont('helvetica', 'bold');
  pdf.text(`STUDENT:`, 24, 42);
  pdf.setFont('helvetica', 'normal');
  pdf.text(
    `${metadata.studentName || 'Sample Student'} (${metadata.studentId || 'ID Pending'}) — ${metadata.course || 'General'}`,
    48,
    42
  );

  // Compute Card Positions
  const gap = isPortrait ? 14 : 8;
  const totalCardsWidth = cardW * 2 + gap;
  const startX = (pageWidth - totalCardsWidth) / 2;
  const startY = 62;

  const frontX = startX;
  const frontY = startY;
  const backX = startX + cardW + gap;
  const backY = startY;

  // Draw precision crop marks
  drawCropMarks(pdf, frontX, frontY, cardW, cardH);
  drawCropMarks(pdf, backX, backY, cardW, cardH);

  // Draw Card Images
  pdf.addImage(frontImg, 'PNG', frontX, frontY, cardW, cardH, undefined, 'FAST');
  pdf.addImage(backImg, 'PNG', backX, backY, cardW, cardH, undefined, 'FAST');

  // Sub-card captions
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(90, 94, 105);
  pdf.text('OBVERSE / FRONT (CR80)', frontX + cardW / 2, frontY + cardH + 7, { align: 'center' });
  pdf.text('REVERSE / BACK (CR80)', backX + cardW / 2, backY + cardH + 7, { align: 'center' });

  // Center folding alignment dotted line
  pdf.setDrawColor(180, 185, 195);
  pdf.setLineWidth(0.15);
  const midX = frontX + cardW + gap / 2;
  pdf.setLineDashPattern([1, 1.5], 0);
  pdf.line(midX, startY - 4, midX, startY + cardH + 12);
  pdf.setLineDashPattern([], 0); // reset dash

  pdf.setFontSize(6.5);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(140, 144, 156);
  pdf.text('FOLD / SEPARATE', midX, startY + cardH + 15, { align: 'center' });

  // Print Production Notes Footer
  const footerY = 248;
  pdf.setDrawColor(227, 223, 214);
  pdf.line(20, footerY, 190, footerY);

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(27, 54, 93); // Oxford Navy #1B365D
  pdf.text('PRODUCTION & DIE-CUT INSTRUCTIONS', 20, footerY + 6);

  pdf.setFontSize(7.5);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(90, 94, 105);
  const notes = [
    '1. Scale Setting: In your printer dialog, select "Actual Size" or "100% Scale". Never use "Fit to Page" or "Shrink to Fit".',
    '2. Stock Specification: Recommended for 280–350 GSM premium silk cardstock, synthetic Teslin, or laminated PVC sheets.',
    '3. Cutting: Align stainless steel ruler with the outer crop tick marks. Do not cut through the card art directly.',
    '4. Corner Radius: Standard CR80 specification requires a 3.18 mm (1/8") corner radius punch.',
  ];
  let curY = footerY + 11;
  for (const note of notes) {
    pdf.text(note, 20, curY);
    curY += 4.5;
  }

  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(cleanFilename);
}
