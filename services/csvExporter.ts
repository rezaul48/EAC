
import { ProductEntry, ReportSettings } from '../types';

export const exportToCSV = (entries: ProductEntry[], settings: ReportSettings) => {
  if (entries.length === 0) return;

  const headers = [
    "Serial Number",
    "Test Date",
    "Product Name",
    "Series Name",
    "Rated Current",
    "Power Factor",
    "On Time",
    "Off Time",
    "Cycles",
    "Operations",
    "Total Operations",
    "Result",
    "Remarks"
  ];

  const csvRows = entries.map(entry => {
    return [
      entry.serialNumber,
      entry.testDate,
      `"${entry.productName.replace(/"/g, '""')}"`,
      `"${entry.seriesName.replace(/"/g, '""')}"`,
      entry.ratedCurrent,
      entry.powerFactor,
      entry.onTime,
      entry.offTime,
      entry.cycles,
      entry.operations,
      entry.totalOperations,
      entry.result,
      `"${(entry.remarks || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `${settings.companyName.replace(/\s+/g, '_')}_Test_Data_${dateStr}.csv`;
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
