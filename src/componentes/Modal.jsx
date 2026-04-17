import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react'; 

const modalRoot = document.getElementById('modal-root');

export default function Modal({ isOpen, onClose, children, title }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3b0f52]/60 backdrop-blur-sm transition-all duration-300"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-[35px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] w-full max-w-md overflow-hidden border border-purple-50 animate-modal-in"
      >
        {/* Línea de acento YapeMascot */}
        <div className="h-2 w-full bg-gradient-to-r from-[#7e1d91] to-[#00d1c4]" />

        <div className="p-8">
          {/* Botón Cerrar */}
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 rounded-xl bg-[#f8f9fe] text-[#7e1d91] hover:bg-red-50 hover:text-red-500 transition-all duration-200"
            aria-label="Cerrar"
          >
            <X size={20} strokeWidth={3} />
          </button>
          
          {/* Título */}
          {title && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-[#3b0f52] uppercase italic tracking-tight">
                {title}
              </h2>
              <div className="w-10 h-1 bg-[#00d1c4] mx-auto mt-2 rounded-full" />
            </div>
          )}
          
          {/* Contenido (Ya no es rosa, es blanco/gris suave) */}
          <main className="text-[#3b0f52] font-medium">
            {children}
          </main>
        </div>

        {/* Footer minimalista */}
        <div className="bg-[#fcfaff] py-4 px-8 border-t border-purple-50 flex justify-center">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">YapeMascot Admin</p>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { transform: translateY(15px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-modal-in {
          animation: modal-in 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>,
    modalRoot
  );
}