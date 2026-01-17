
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ProductEntry, ReportSettings } from '../types';

// Extend jsPDF to include autoTable
interface JsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => void;
}

export const generatePDF = async (entries: ProductEntry[], settings: ReportSettings) => {
  const doc = new jsPDF() as JsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();
  const font = settings.primaryFont || 'helvetica';
  
  // Extract date components from reportDate
  const reportDateObj = new Date(settings.reportDate || new Date());
  const reportDay = reportDateObj.getDate().toString().padStart(2, '0');
  const reportMonth = reportDateObj.toLocaleString('default', { month: 'long' });
  const reportYear = reportDateObj.getFullYear().toString();
  
  // Generate a unique report number: PREFIX-YYYYMMDD-XXXX
  const dateStr = reportDateObj.toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  const reportNumber = `${settings.reportPrefix || 'RPT'}-${dateStr}-${randomStr}`;

  // Header background
  doc.setFillColor(37, 99, 235); // Blue-600
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Logo handling
  let headerTextX = pageWidth / 2;
  if (settings.logoData) {
    try {
      doc.addImage(settings.logoData, 'PNG', 14, 10, 25, 25);
      headerTextX = 45; // Shift text to the right if logo exists
    } catch (e) {
      console.error("Failed to add logo to PDF", e);
    }
  }

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont(font, 'bold');
  const alignment = settings.logoData ? 'left' : 'center';
  doc.text(settings.companyName.toUpperCase(), headerTextX, 22, { align: alignment });
  
  doc.setFontSize(14);
  doc.setFont(font, 'normal');
  doc.text('Quality Assurance - Product Test Report', headerTextX, 32, { align: alignment });

  // Metadata Info
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont(font, 'bold');
  doc.text('REPORT DETAILS', 14, 55);
  
  doc.setFont(font, 'normal');
  doc.text(`Report ID: ${reportNumber}`, 14, 62);
  doc.text(`Tester Name: ${settings.testerName}`, 14, 67);

  // Dedicated Date/Month/Year Section
  const dateSectionX = pageWidth - 70;
  const dateSectionY = 55;
  
  doc.setFont(font, 'bold');
  doc.setFontSize(9);
  doc.setTextColor(37, 99, 235);
  doc.text('REPORT ISSUE DATE', dateSectionX, dateSectionY);
  
  // Draw simple "boxes" or clear sections for D / M / Y
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(245, 245, 245);
  doc.rect(dateSectionX, dateSectionY + 3, 15, 12, 'F'); // Day box
  doc.rect(dateSectionX + 17, dateSectionY + 3, 25, 12, 'F'); // Month box
  doc.rect(dateSectionX + 44, dateSectionY + 3, 15, 12, 'F'); // Year box
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(reportDay, dateSectionX + 7.5, dateSectionY + 11, { align: 'center' });
  doc.text(reportMonth, dateSectionX + 29.5, dateSectionY + 11, { align: 'center' });
  doc.text(reportYear, dateSectionX + 51.5, dateSectionY + 11, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('DATE', dateSectionX + 7.5, dateSectionY + 18, { align: 'center' });
  doc.text('MONTH', dateSectionX + 29.5, dateSectionY + 18, { align: 'center' });
  doc.text('YEAR', dateSectionX + 51.5, dateSectionY + 18, { align: 'center' });
  
  // Summary Stats on the right (moved slightly down to accommodate date boxes)
  const passed = entries.filter(e => e.result === 'PASS').length;
  doc.setFont(font, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text(`Total Products: ${entries.length}`, pageWidth - 14, 78, { align: 'right' });
  doc.text(`Overall Result: ${passed === entries.length ? 'PASS' : 'MIXED'}`, pageWidth - 14, 83, { align: 'right' });

  // Table header/body definition
  const tableColumn = [
    "SL",
    "Test Date",
    "Product & Series",
    "Rating (PF)",
    "Timing",
    "Cycles",
    "Ops",
    "Total Ops",
    "Result"
  ];

  const tableRows = entries.map(entry => [
    entry.serialNumber,
    entry.testDate,
    `${entry.productName}\n(${entry.seriesName})`,
    `${entry.ratedCurrent}\n(${entry.powerFactor})`,
    `${entry.onTime} On\n${entry.offTime} Off`,
    entry.cycles,
    entry.operations,
    entry.totalOperations,
    entry.result
  ]);

  doc.autoTable({
    startY: 90,
    head: [tableColumn],
    body: tableRows,
    theme: settings.tableTheme || 'striped',
    headStyles: { 
      fillColor: [37, 99, 235], 
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      font: font,
      halign: 'center'
    },
    styles: { 
      fontSize: 7.5, 
      cellPadding: 2,
      font: font,
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 20 },
      2: { halign: 'left', cellWidth: 35 },
      8: { fontStyle: 'bold' }
    }
  });

  // Remarks Section
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  if (entries.some(e => e.remarks)) {
    doc.setFont(font, 'bold');
    doc.setFontSize(11);
    doc.text('TEST REMARKS:', 14, finalY + 15);
    doc.setFont(font, 'normal');
    doc.setFontSize(9);
    
    let currentY = finalY + 22;
    entries.forEach((entry) => {
      if (entry.remarks) {
        const text = `${entry.serialNumber}: ${entry.remarks}`;
        const splitText = doc.splitTextToSize(text, pageWidth - 28);
        
        if (currentY + (splitText.length * 5) > 280) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.text(splitText, 14, currentY);
        currentY += (splitText.length * 5) + 3;
      }
    });
  }

  // Signature Section
  const footerY = doc.internal.pageSize.getHeight() - 40;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, footerY, 70, footerY);
  doc.setFontSize(9);
  doc.setTextColor(0,0,0);
  doc.text('Prepared By', 14, footerY + 5);
  doc.text(settings.testerName, 14, footerY + 10);

  doc.line(pageWidth - 70, footerY, pageWidth - 14, footerY);
  doc.text('Approved By', pageWidth - 70, footerY + 5);

  // Footer Pagination
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont(font, 'normal');
    doc.text(
      `Page ${i} of ${pageCount} - Report ID: ${reportNumber} - ${settings.companyName}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`${settings.companyName.replace(/\s+/g, '_')}_Report_${reportNumber}.pdf`);
};
