import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

const SuccessPrompt = ({ promptMessage }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/70 backdrop-blur-lg max-w-md w-full px-8 py-8 rounded-3xl shadow-xl text-center animate-fadeIn font-sans relative border border-white/30">
        <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center bg-green-500 text-white rounded-full shadow-md">
          <Check size={40} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {promptMessage}
        </h2>
        <Link
          href="/controlpanel"
          className="inline-block mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-md"
        >
          Continue
        </Link>
      </div>

      {/* Optional animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SuccessPrompt;
