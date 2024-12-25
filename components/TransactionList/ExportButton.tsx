import React, { useState } from 'react';
import { FaDownload } from "react-icons/fa";
import type { Transaction } from "@/models/Transaction";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

interface ExportButtonProps {
  transactions: Transaction[];
}

export default function ExportButton({ transactions }: ExportButtonProps) {
  const [showExportOptions, setShowExportOptions] = useState(false);

  const exportToExcel = () => {
    const data = transactions.map((t) => ({
      Date: new Date(t.date).toLocaleDateString(),
      Description: t.description,
      Category: t.category,
      Type: t.type,
      Amount: t.amount,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
    setShowExportOptions(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableColumn = ["Date", "Description", "Category", "Type", "Amount"];
    const tableRows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type,
      `₹${t.amount.toFixed(2)}`,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("transactions.pdf");
    setShowExportOptions(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowExportOptions(!showExportOptions)}
        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md transition-all duration-300 border-2 bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
      >
        <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
        Export
      </button>

      {showExportOptions && (
        <div className="absolute right-0 mt-2 w-40 sm:w-48 rounded-md shadow-lg bg-white/10 backdrop-blur-md border border-white/20 z-50">
          <div className="py-1">
            <button
              onClick={exportToExcel}
              className="block w-full px-4 py-2 text-xs sm:text-sm text-white/90 hover:bg-white/10 text-left"
            >
              Download as Excel
            </button>
            <button
              onClick={exportToPDF}
              className="block w-full px-4 py-2 text-xs sm:text-sm text-white/90 hover:bg-white/10 text-left"
            >
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 