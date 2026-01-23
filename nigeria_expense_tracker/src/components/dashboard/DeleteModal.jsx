import React from 'react';
import { LuAlertTriangle, LuTrash2, LuX } from "react-icons/lu";

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-scale-up">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-danger-50 text-danger-600 rounded-full flex items-center justify-center mb-4">
            <LuAlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Clear All Data?</h3>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            This action cannot be undone. You will lose all your tracked expenses and budget settings.
          </p>
          
          <div className="flex flex-col w-full gap-3">
            <button 
              onClick={onConfirm}
              className="w-full py-4 bg-danger-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-danger-700 transition-all shadow-lg shadow-danger-100"
            >
              <LuTrash2 size={18} /> Delete Everything
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;