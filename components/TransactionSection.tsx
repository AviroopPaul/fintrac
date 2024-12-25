import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import { Transaction } from "@/models/Transaction";

interface TransactionSectionProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onUpdate: (transaction: Transaction) => void;
}

export default function TransactionSection({
  transactions,
  onAddTransaction,
  onDelete,
  onUpdate,
}: TransactionSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-slate-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Add Transaction
        </h2>
        <TransactionForm onAdd={onAddTransaction} />
      </div>
      <div className="bg-slate-800 p-6 rounded-lg shadow">
        <TransactionList
          transactions={transactions}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
}
