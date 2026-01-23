// src/components/Modal.jsx
import React from 'react';
import { MdClose, MdWarning, MdInfo, MdCheckCircle } from 'react-icons/md';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  type = 'info',
  size = 'md'
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    info: { icon: MdInfo, color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' },
    warning: { icon: MdWarning, color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30' },
    danger: { icon: MdWarning, color: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30' },
    success: { icon: MdCheckCircle, color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const { icon: Icon, color } = typeConfig[type];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className={`inline-block w-full ${sizeClasses[size]} my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MdClose className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;