import { Dialog } from '@headlessui/react';
import { PlusIcon, ArrowPathIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface WelcomeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeGuide({ isOpen, onClose }: WelcomeGuideProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-2xl bg-slate-800 p-4 sm:p-8 border border-slate-700">
          <Dialog.Title className="text-xl sm:text-2xl font-bold text-white mb-4">
            Welcome to Your Financial Tracker! 🎉
          </Dialog.Title>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <PlusIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-400">Add Transactions</h3>
                <p className="text-sm sm:text-base text-slate-300">Start by adding your first income or expense transaction to begin tracking your finances.</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-green-400">View Analytics</h3>
                <p className="text-sm sm:text-base text-slate-300">Get insights into your spending patterns and track your savings progress with visual charts.</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <ArrowPathIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-purple-400">AI Analysis</h3>
                <p className="text-sm sm:text-base text-slate-300">Receive personalized financial advice and spending insights powered by AI.</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 sm:mt-8 w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Get Started
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 