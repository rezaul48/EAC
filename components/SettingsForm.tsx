
import React, { useState } from 'react';
import { ReportSettings } from '../types';
import { Image as ImageIcon, Upload, Hash, Type, Layout, Palette, Calendar } from 'lucide-react';

interface SettingsFormProps {
  settings: ReportSettings;
  onUpdate: (settings: ReportSettings) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState<ReportSettings>(settings);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoData: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const inputClasses = "w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors";
  const labelClasses = "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-1">
          <label className={labelClasses}>Company Name</label>
          <input required value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} className={inputClasses} placeholder="e.g. Acme Industries Ltd." />
        </div>
        <div className="space-y-1">
          <label className={labelClasses}>Tester Name</label>
          <input required value={formData.testerName} onChange={e => setFormData({ ...formData, testerName: e.target.value })} className={inputClasses} placeholder="e.g. John Doe" />
        </div>
        <div className="space-y-1">
          <label className={labelClasses}>Report Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
            <input type="date" required value={formData.reportDate} onChange={e => setFormData({ ...formData, reportDate: e.target.value })} className={`${inputClasses} pl-10`} />
          </div>
        </div>
        <div className="space-y-1">
          <label className={labelClasses}>Report ID Prefix</label>
          <div className="relative">
             <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
             <input required value={formData.reportPrefix} onChange={e => setFormData({ ...formData, reportPrefix: e.target.value.toUpperCase() })} className={`${inputClasses} pl-10`} placeholder="e.g. RPT" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 transition-colors">
        <h3 className="md:col-span-3 text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest flex items-center gap-2">
          <Layout size={16} /> PDF Report Styling
        </h3>
        <div className="space-y-1">
          <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Table Theme</label>
          <select value={formData.tableTheme} onChange={e => setFormData({ ...formData, tableTheme: e.target.value as any })} className={`${inputClasses} border-blue-200 dark:border-blue-800 font-medium`}>
            <option value="striped">Striped (Recommended)</option>
            <option value="grid">Grid (All Borders)</option>
            <option value="plain">Plain (Simple)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Primary Font</label>
          <div className="relative">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 dark:text-blue-500" size={16} />
            <select value={formData.primaryFont} onChange={e => setFormData({ ...formData, primaryFont: e.target.value as any })} className={`${inputClasses} pl-10 border-blue-200 dark:border-blue-800 font-medium`}>
              <option value="helvetica">Helvetica (Sans Serif)</option>
              <option value="times">Times (Serif)</option>
              <option value="courier">Courier (Monospace)</option>
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">App Theme</label>
          <div className="relative">
            <Palette className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 dark:text-blue-500" size={16} />
            <select value={formData.uiTheme} onChange={e => setFormData({ ...formData, uiTheme: e.target.value as any })} className={`${inputClasses} pl-10 border-blue-200 dark:border-blue-800 font-medium`}>
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>Company Logo</label>
        <div className="flex flex-col md:flex-row items-center gap-4 p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            {formData.logoData ? (
              <img src={formData.logoData} alt="Logo preview" className="max-w-full max-h-full object-contain" />
            ) : (
              <ImageIcon className="text-gray-300 dark:text-gray-700" size={40} />
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200">Logo Upload</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Recommended size: 200x200px. PNG or JPG.</p>
            <label className="inline-flex items-center gap-2 cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <Upload size={16} />
              Choose File
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98]">
        Save Configuration
      </button>
    </form>
  );
};

export default SettingsForm;
