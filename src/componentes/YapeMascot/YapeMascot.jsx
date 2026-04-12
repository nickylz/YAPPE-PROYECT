import React, { useState } from 'react';
import MascotChat from './MascotChat';
const YapeMascot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      
      {/* Ventana de Chat: Aparece sobre el botón */}
      {isOpen && (
        <div className="mb-4 pointer-events-auto animate-in fade-in zoom-in duration-300 origin-bottom-right">
          <MascotChat onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* --- EL BOTÓN (Estilo exacto a la foto) --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          pointer-events-auto
          w-16 h-16 
          rounded-full 
          flex items-center justify-center 
          shadow-[0_8px_30px_rgb(0,0,0,0.12)]
          transition-all duration-300 
          hover:scale-110 active:scale-95
          ${isOpen ? 'bg-[#24c091]' : 'bg-[#00d1b2]'}
        `}
      >
        {isOpen ? (
          /* Icono X para cerrar */
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Icono de Chat Blanco (basado en tu imagen) */
          <div className="relative flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              className="w-9 h-9 fill-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" />
              {/* Líneas horizontales características */}
              <line x1="7" y1="8" x2="17" y2="8" stroke="#00d1b2" strokeWidth="2" strokeLinecap="round" />
              <line x1="7" y1="12" x2="17" y2="12" stroke="#00d1b2" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Notificación de alerta (Punto rosado) */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500 border-2 border-white"></span>
          </span>
        )}
      </button>

      {/* Sombra de apoyo en el suelo (Opcional para realismo) */}
      {!isOpen && (
        <div className="mr-4 mt-1 w-8 h-1 bg-black/10 rounded-[100%] blur-sm pointer-events-none"></div>
      )}
    </div>
  );
};

export default YapeMascot;