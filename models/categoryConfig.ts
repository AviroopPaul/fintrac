import {
  FaUtensils,
  FaBus,
  FaGamepad,
  FaShoppingBag,
  FaFileInvoiceDollar,
  FaPiggyBank,
  FaMoneyBillWave,
  FaMedkit,
  FaGraduationCap,
  FaQuestionCircle,
} from "react-icons/fa";
import { IconType } from 'react-icons';

export const defaultCategories = [
  'Income',
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Investments',
  'Education',
  'Other'
] as const;

// Create a type from the default categories
export type DefaultCategory = typeof defaultCategories[number];

// Update the CategoryConfig interface to be more specific
export interface CategoryConfig {
  [key: string]: {
    colors: string;
    icon: IconType;
    backgroundColor: string;
  };
}

export const categoryConfig: CategoryConfig = {
  'UK': {
    colors: "bg-gray-400/20 text-gray-300",
    icon: FaQuestionCircle,
    backgroundColor: 'rgba(156, 163, 175, 0.6)',
  },
  'Test': {
    colors: "bg-gray-400/20 text-gray-300",
    icon: FaQuestionCircle,
    backgroundColor: 'rgba(156, 163, 175, 0.6)',
  },
  'Food & Dining': {
    colors: "bg-orange-400/20 text-orange-300",
    icon: FaUtensils,
    backgroundColor: 'rgba(251, 146, 60, 0.6)',
  },
  'Transportation': {
    colors: "bg-blue-400/20 text-blue-300",
    icon: FaBus,
    backgroundColor: 'rgba(59, 130, 246, 0.6)',
  },
  'Shopping': {
    colors: "bg-pink-400/20 text-pink-300",
    icon: FaShoppingBag,
    backgroundColor: 'rgba(236, 72, 153, 0.6)',
  },
  'Bills & Utilities': {
    colors: "bg-red-400/20 text-red-300",
    icon: FaFileInvoiceDollar,
    backgroundColor: 'rgba(239, 68, 68, 0.6)',
  },
  'Entertainment': {
    colors: "bg-purple-400/20 text-purple-300",
    icon: FaGamepad,
    backgroundColor: 'rgba(168, 85, 247, 0.6)',
  },
  'Healthcare': {
    colors: "bg-emerald-400/20 text-emerald-300",
    icon: FaMedkit,
    backgroundColor: 'rgba(34, 197, 94, 0.6)',
  },
  'Investments': {
    colors: "bg-green-400/20 text-green-300",
    icon: FaPiggyBank,
    backgroundColor: 'rgba(45, 212, 191, 0.6)',
  },
  'Income': {
    colors: "bg-teal-400/20 text-teal-300",
    icon: FaMoneyBillWave,
    backgroundColor: 'rgba(14, 165, 233, 0.6)',
  },
  'Education': {
    colors: "bg-yellow-400/20 text-yellow-300",
    icon: FaGraduationCap,
    backgroundColor: 'rgba(234, 179, 8, 0.6)',
  },
  'Other': {
    colors: "bg-gray-400/20 text-gray-300",
    icon: FaQuestionCircle,
    backgroundColor: 'rgba(156, 163, 175, 0.6)',
  },
};

export const getDefaultCategoryConfig = (category: string) => {
  const defaultConfig = {
    colors: "bg-gray-400/20 text-gray-300",
    icon: FaQuestionCircle,
    backgroundColor: 'rgba(156, 163, 175, 0.6)',
  };
  
  return categoryConfig[category] || defaultConfig;
}; 