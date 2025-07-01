
import React, { useState, useEffect, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { TransactionTable } from './components/TransactionTable';
import { Dashboard } from './components/Dashboard';
import { processTransactions } from './services/fraudDetectionService';
import { Transaction, ProcessedTransaction, RawTransaction } from './types';
import { REQUIRED_COLUMNS } from './constants';

// Social Media Icons (simple SVGs for brevity)
const SocialIcon: React.FC<{ href: string; path: string; label: string }> = ({ href, path, label }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="text-slate-400 hover:text-[var(--brand-primary)] transition-colors duration-300">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
      <path d={path} />
    </svg>
  </a>
);

// Paths for common social media icons (simplified)
const socialIconsPaths = {
  linkedin: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
  github: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
  instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 1.172.052 1.805.242 2.228.42.447.184.773.392 1.13.748.358.357.565.682.748 1.13.18.423.368.97.42 2.228.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.052 1.172-.242 1.805-.42 2.228-.184.447-.392.773-.748 1.13-.357.358-.682.565-1.13.748-.423.18-1.05.368-2.228.42-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.172-.052-1.805-.242-2.228-.42-.447-.184-.773-.392-1.13-.748-.358-.357-.565-.682-.748-1.13-.18-.423-.368.97-.42-2.228-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.052-1.172.242-1.805.42-2.228.184-.447.392.773.748-1.13.357-.358.682.565 1.13-.748.423-.18.97-.368 2.228-.42 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.28.058-2.177.247-2.948.552-.796.315-1.428.73-2.064 1.367s-1.052 1.268-1.367 2.064c-.305.771-.494 1.668-.552 2.948-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.28.247 2.177.552 2.948.315.796.73 1.428 1.367 2.064s1.268 1.052 2.064 1.367c.771.305 1.668.494 2.948.552 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.28-.058 2.177-.247 2.948-.552.796-.315 1.428.73 2.064-1.367s1.052-1.268 1.367-2.064c.305-.771.494-1.668-.552-2.948.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.28-.247-2.177-.552-2.948-.315-.796-.73-1.428-1.367-2.064s-1.268-1.052-2.064-1.367c-.771-.305-1.668-.494-2.948-.552-.025-.001-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  youtube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  blog: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z",
};


const App: React.FC = () => {
  const [currentTransactions, setCurrentTransactions] = useState<Transaction[]>([]);
  const [processedTransactions, setProcessedTransactions] = useState<ProcessedTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const brand = {
    shortName: "HERE AND NOW AI",
    longName: "HERE AND NOW AI - Artificial Intelligence Research Institute",
    website: "https://hereandnowai.com",
    slogan: "designed with passion for innovation",
    logo: {
      title: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png",
    },
    socialMedia: {
      blog: { url: "https://hereandnowai.com/blog", path: socialIconsPaths.blog, label: "Blog" },
      linkedin: { url: "https://www.linkedin.com/company/hereandnowai/", path: socialIconsPaths.linkedin, label: "LinkedIn" },
      instagram: { url: "https://instagram.com/hereandnow_ai", path: socialIconsPaths.instagram, label: "Instagram" },
      github: { url: "https://github.com/hereandnowai", path: socialIconsPaths.github, label: "GitHub" },
      x: { url: "https://x.com/hereandnow_ai", path: socialIconsPaths.x, label: "X (Twitter)" },
      youtube: { url: "https://youtube.com/@hereandnow_ai", path: socialIconsPaths.youtube, label: "YouTube" },
    }, // Added trailing comma
  }; // Semicolon here is correct.


  const parseAmount = (amountStr: string): number => {
    const cleanedAmount = amountStr.replace(/[^\d.-]/g, '');
    return parseFloat(cleanedAmount);
  };

  const transformRawTransactions = useCallback((rawTxs: RawTransaction[]): Transaction[] => {
    return rawTxs.map(rt => {
      const transformedTransaction: Transaction = {
        ...rt, 
        amount: parseAmount(rt.amount), 
        originalAmount: rt.amount,      
      };
      return transformedTransaction;
    });
  }, []);

  const handleFileProcessed = useCallback((data: RawTransaction[], name: string) => {
    setError(null);
    setIsLoading(true);
    setFileName(name);
    
    setTimeout(() => {
      try {
        const transformedData = transformRawTransactions(data);
        setCurrentTransactions(transformedData);
      } catch (e) {
        console.error("Error transforming transactions:", e);
        setError("Error processing transaction amounts. Please check amount column format.");
        setCurrentTransactions([]); 
        setProcessedTransactions([]);
        setIsLoading(false);
      }
    }, 500);
  }, [transformRawTransactions]);

  useEffect(() => {
    if (currentTransactions.length > 0) {
      const results = processTransactions(currentTransactions); 
      setProcessedTransactions(results);
      setIsLoading(false);
    } else {
      setProcessedTransactions([]);
      if (fileName) { 
         setIsLoading(false);
      }
    }
  }, [currentTransactions, fileName]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 p-4 sm:p-6 lg:p-8 font-sans">
      <header className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <img src={brand.logo.title} alt={`${brand.shortName} Logo`} className="h-20 sm:h-24 md:h-28" />
        </div>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Upload your transaction data (.csv) to analyze for fraudulent activity. 
          <span className="block sm:inline mt-1 sm:mt-0 sm:ml-1 text-[var(--brand-primary)] opacity-90">{brand.shortName}: {brand.slogan}.</span>
        </p>
      </header>

      <main className="space-y-8">
        <section id="input" className="bg-slate-800 shadow-2xl rounded-xl p-6 ring-1 ring-slate-700">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--brand-primary)]">📥 Upload Transaction Data</h2>
          <FileUpload onFileProcessed={handleFileProcessed} setIsLoading={setIsLoading} setError={setError} />
          {fileName && !isLoading && !error && (
            <p className="mt-4 text-sm text-green-400">Successfully loaded <span className="font-semibold">{fileName}</span>.</p>
          )}
          {isLoading && <p className="mt-4 text-sm text-blue-400 animate-pulse">Processing your file, please wait...</p>}
          {error && <p className="mt-4 text-sm text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
           <div className="mt-4 text-xs text-slate-500">
            <p className="font-semibold">Minimum required columns:</p>
            <code className="block bg-slate-700 p-2 rounded-md mt-1 text-slate-300 whitespace-pre-wrap">
              {REQUIRED_COLUMNS.join(', ')}
            </code>
          </div>
        </section>

        {processedTransactions.length > 0 && !isLoading && (
          <>
            <section id="dashboard" className="bg-slate-800 shadow-2xl rounded-xl p-6 ring-1 ring-slate-700">
              <h2 className="text-2xl font-semibold mb-6 text-[var(--brand-primary)]">📊 Interactive Dashboard</h2>
              <Dashboard transactions={processedTransactions} />
            </section>

            <section id="results" className="bg-slate-800 shadow-2xl rounded-xl p-6 ring-1 ring-slate-700">
              <h2 className="text-2xl font-semibold mb-6 text-[var(--brand-primary)]">📋 Transaction Analysis Results</h2>
              <TransactionTable transactions={processedTransactions} />
            </section>
          </>
        )}
         {currentTransactions.length === 0 && !isLoading && !error && fileName && (
            <section className="bg-slate-800 shadow-2xl rounded-xl p-6 ring-1 ring-slate-700 text-center">
                <p className="text-slate-400">No transactions found in the uploaded file or file is empty after header.</p>
            </section>
        )}
      </main>

      <footer className="mt-12 pt-8 border-t border-slate-700 text-center text-sm text-slate-500 space-y-3">
        <p>&copy; {new Date().getFullYear()} {brand.longName}. All rights reserved.</p>
        <p>Developed by Sakthi Kannan [ AI Products Engineering Team ]</p>
        <div className="flex justify-center space-x-4">
          {Object.entries(brand.socialMedia).map(([key, { url, path, label }]) => (
            <SocialIcon key={key} href={url} path={path} label={label}/>
          ))}
        </div>
        <p className="text-xs pt-2">Powered by <a href={brand.website} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--brand-primary)] transition-colors">{brand.shortName}</a></p>
      </footer>
    </div>
  );
};

export default App;
