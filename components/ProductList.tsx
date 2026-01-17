
import React from 'react';
import { Trash2, Package, Tag, Zap, Activity, Calendar } from 'lucide-react';
import { ProductEntry } from '../types';

interface ProductListProps {
  entries: ProductEntry[];
  onDelete: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ entries, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-left relative group transition-colors">
          <button 
            onClick={() => onDelete(entry.id)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all md:opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={18} />
          </button>
          
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm text-blue-600 dark:text-blue-400">
              <Package size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                {entry.serialNumber}
                <span className="text-gray-300 dark:text-gray-700 mx-1">|</span>
                <span className="flex items-center gap-1 font-medium text-gray-400 dark:text-gray-500 normal-case">
                  <Calendar size={12} /> {entry.testDate}
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{entry.productName}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{entry.seriesName}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Rating</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{entry.ratedCurrent} (PF: {entry.powerFactor})</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Result</span>
              <span className={`text-sm font-bold ${
                entry.result === 'PASS' ? 'text-green-600 dark:text-green-400' : entry.result === 'FAIL' ? 'text-red-600 dark:text-red-400' : 'text-orange-500 dark:text-orange-400'
              }`}>{entry.result}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Timing (On/Off)</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{entry.onTime} / {entry.offTime}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Operations</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{entry.totalOperations} total</span>
            </div>
          </div>
          
          {entry.remarks && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">"{entry.remarks}"</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
