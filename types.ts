
export interface ProductEntry {
  id: string;
  serialNumber: string;
  productName: string;
  seriesName: string;
  ratedCurrent: string;
  powerFactor: string;
  onTime: string;
  offTime: string;
  cycles: number;
  operations: number;
  totalOperations: number;
  result: string;
  remarks: string;
  testDate: string;
}

export interface ReportSettings {
  companyName: string;
  testerName: string;
  reportPrefix: string;
  logoData?: string; // base64 string
  tableTheme: 'striped' | 'grid' | 'plain';
  primaryFont: 'helvetica' | 'times' | 'courier';
  uiTheme: 'light' | 'dark';
  reportDate: string; // YYYY-MM-DD
}
