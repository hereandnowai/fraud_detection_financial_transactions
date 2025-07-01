
import React, { useCallback, useRef } from 'react';
import { RawTransaction } from '../types';
import { REQUIRED_COLUMNS } from '../constants';

interface FileUploadProps {
  onFileProcessed: (data: RawTransaction[], fileName: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, setIsLoading, setError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError('No file selected.');
      return;
    }

    if (file.type !== 'text/csv') {
      setError('Invalid file type. Please upload a .csv file.');
      if(fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');

        if (lines.length < 2) {
          throw new Error('CSV file must contain a header row and at least one data row.');
        }

        const header = lines[0].split(',').map(h => h.trim().toLowerCase());
        const missingColumns = REQUIRED_COLUMNS.filter(col => !header.includes(col.toLowerCase()));

        if (missingColumns.length > 0) {
          throw new Error(`Missing required columns: ${missingColumns.join(', ')}.`);
        }
        
        const headerIndexMap: { [key: string]: number } = {};
        REQUIRED_COLUMNS.forEach(col => {
            const index = header.indexOf(col.toLowerCase());
            if (index !== -1) {
                headerIndexMap[col] = index;
            }
        });
        header.forEach((h, i) => {
            if (!REQUIRED_COLUMNS.includes(h)) {
                headerIndexMap[h] = i;
            }
        });

        const data: RawTransaction[] = lines.slice(1).map((line, rowIndex) => {
          const values = line.split(',');
          if (values.length < header.length) {
            console.warn(`Row ${rowIndex + 1} has fewer columns than header. Skipping.`);
            return null; 
          }

          const transaction: Partial<RawTransaction> & { [key: string]: string } = {};
          
          for (const colName in headerIndexMap) {
            const colIndex = headerIndexMap[colName];
            if (values[colIndex] !== undefined) {
                 transaction[colName] = values[colIndex].trim();
            } else {
                 transaction[colName] = '';
            }
          }
          
          return transaction as RawTransaction;
        }).filter(tx => tx !== null) as RawTransaction[];

        if (data.length === 0) {
          throw new Error('No valid data rows found in the CSV file.');
        }

        onFileProcessed(data, file.name);
      } catch (err) {
        console.error("CSV Parsing Error:", err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during file processing.';
        setError(`Error processing file: ${errorMessage}`);
        onFileProcessed([], file.name); 
      } finally {
        setIsLoading(false);
        if(fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.onerror = () => {
      setError('Failed to read the file.');
      setIsLoading(false);
      if(fileInputRef.current) fileInputRef.current.value = "";
    };

    reader.readAsText(file);
  }, [onFileProcessed, setIsLoading, setError]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <label 
        htmlFor="file-upload" 
        className="cursor-pointer bg-[var(--brand-primary)] text-[var(--brand-text-on-primary)] hover:bg-[var(--brand-primary-hover)] font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
      >
        Select .CSV File
      </label>
      <input
        id="file-upload"
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      <p className="text-sm text-slate-400">Ensure your CSV has the required headers and data.</p>
    </div>
  );
};
