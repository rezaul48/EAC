
import React, { useState, useEffect } from 'react';
import { ProductEntry } from '../types';

interface ProductFormProps {
  onSubmit: (entry: Omit<ProductEntry, 'id'>) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    serialNumber: '',
    productName: '',
    seriesName: '',
    ratedCurrent: '',
    powerFactor: '0.8',
    onTime: '',
    offTime: '',
    cycles: 1,
    operations: 1,
    result: 'PASS',
    remarks: '',
    testDate: new Date().toISOString().split('T')[0]
  });

  const [totalOperations, setTotalOperations] = useState(1);

  useEffect(() => {
    setTotalOperations(formData.cycles * formData.operations);
  }, [formData.cycles, formData.operations]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'cycles' || name === 'operations') ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      totalOperations
    });
  };

  const inputClasses = "w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none";
  const labelClasses = "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-1">
        <label className={labelClasses}>Serial Number (সিরিয়াল নাম্বার)</label>
        <input required name="serialNumber" value={formData.serialNumber} onChange={handleChange} className={inputClasses} placeholder="e.g. SN-001" />
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>Product Name (প্রোডাক্টের নাম)</label>
        <input required name="productName" value={formData.productName} onChange={handleChange} className={inputClasses} placeholder="Product Name" />
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>Series Name (সিরিজের নাম)</label>
        <input required name="seriesName" value={formData.seriesName} onChange={handleChange} className={inputClasses} placeholder="Series" />
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>Rated Current (রেটেড কারেন্ট)</label>
        <input required name="ratedCurrent" value={formData.ratedCurrent} onChange={handleChange} className={inputClasses} placeholder="e.g. 10A" />
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>Power Factor (পাওয়ার ফ্যাক্টর)</label>
        <input name="powerFactor" value={formData.powerFactor} onChange={handleChange} className={inputClasses} placeholder="e.g. 0.8" />
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>Test Date (টেস্টের তারিখ)</label>
        <input type="date" required name="testDate" value={formData.testDate} onChange={handleChange} className={inputClasses} />
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>Result (রেজাল্ট)</label>
        <select name="result" value={formData.result} onChange={handleChange} className={inputClasses}>
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
          <option value="PENDING">PENDING</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>On Time (অন টাইম)</label>
        <input name="onTime" value={formData.onTime} onChange={handleChange} className={inputClasses} placeholder="e.g. 5s" />
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>Off Time (অফ টাইম)</label>
        <input name="offTime" value={formData.offTime} onChange={handleChange} className={inputClasses} placeholder="e.g. 10s" />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl grid grid-cols-2 gap-4 md:col-span-3 border border-blue-100 dark:border-blue-900/30">
        <div className="space-y-1">
          <label className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase">Cycles (সাইকেল)</label>
          <input type="number" name="cycles" value={formData.cycles} onChange={handleChange} className="w-full p-3 border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase">Operation (অপারেশন)</label>
          <input type="number" name="operations" value={formData.operations} onChange={handleChange} className="w-full p-3 border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="col-span-2 pt-2 border-t border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
          <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">Total Calculated Operations:</span>
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">{totalOperations}</span>
        </div>
      </div>

      <div className="space-y-1 md:col-span-3">
        <label className={labelClasses}>Remarks (রিমার্কস)</label>
        <textarea name="remarks" value={formData.remarks} onChange={handleChange} className={`${inputClasses} h-24 resize-none`} placeholder="Any additional notes..." />
      </div>

      <div className="md:col-span-3 pt-4">
        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98]">
          Submit
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
