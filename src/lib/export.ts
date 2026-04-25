import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadPng(element: HTMLElement, filename = 'competence-radar') {
  const dataUrl = await toPng(element, { pixelRatio: 2, backgroundColor: '#fafaf9', cacheBust: true });
  triggerDownload(dataUrl, `${filename}.png`);
}

export async function downloadJpg(element: HTMLElement, filename = 'competence-radar') {
  const dataUrl = await toJpeg(element, { pixelRatio: 2, backgroundColor: '#ffffff', quality: 0.95, cacheBust: true });
  triggerDownload(dataUrl, `${filename}.jpg`);
}

export async function downloadPdf(element: HTMLElement, filename = 'competence-radar') {
  const dataUrl = await toPng(element, { pixelRatio: 2, backgroundColor: '#fafaf9' });
  const img = new Image();
  img.src = dataUrl;
  await new Promise((res) => { img.onload = res; });

  const ratio = img.height / img.width;
  const pdfWidth = 200; // mm
  const pdfHeight = pdfWidth * ratio;

  const pdf = new jsPDF({ orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape', unit: 'mm' });
  const margin = 5;
  pdf.addImage(dataUrl, 'PNG', margin, margin, pdfWidth, pdfHeight);
  pdf.save(`${filename}.pdf`);
}
