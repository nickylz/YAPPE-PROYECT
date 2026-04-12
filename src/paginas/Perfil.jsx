import { useState } from "react";
import { useAuth } from "../context/authContext";
import PerfilForm from '../componentes/PerfilForm';
import Responder from '../componentes/Responder'; // Importamos tu nuevo componente
import { User, MessageSquare } from 'lucide-react';

export default function Perfil() {
  const { usuarioActual, cargandoAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (cargandoAuth || !usuarioActual) {
    return (
      <div className="min-h-screen bg-[#fff3f0] flex items-center justify-center">
        <p className="text-[#7a1a0a] font-semibold animate-pulse">Cargando tu perfil...</p>
      </div>
    );
  }

  // Definimos las pestañas como botones
  const tabs = [
    { id: 'perfil', label: 'Gestionar Perfil', icon: <User size={18} /> },
    { id: 'mensajes', label: 'Bandeja de Reclamos', icon: <MessageSquare size={18} /> },
  ];

  const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label;

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return <PerfilForm user={usuarioActual} />;
      case 'mensajes':
        return <Responder />; // Aquí se carga el archivo Responder.jsx
      default:
        return <PerfilForm user={usuarioActual} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fff3f0]">
      <div className="w-full">
        {/* Banner de Bienvenida con ancho completo */}
        <div className="w-full bg-gradient-to-r from-[#7e1d91] via-[#8f3cbf] to-[#bd6fe4] shadow-[0_40px_120px_rgba(126,29,145,0.18)] py-16 md:py-20 text-center text-white mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-[#f3e6ff]/90 mb-4 font-black">Intranet</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight px-4 md:px-0 italic">
            ¡Hola, {usuarioActual.nombre || usuarioActual.username}!
          </h1>
          <p className="mt-4 text-[#f7ebff]/90 max-w-3xl mx-auto text-base md:text-xl px-4 md:px-0 font-medium">
            Desde aquí puedes gestionar tu cuenta y revisar tus mensajes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* --- ASIDE: MENÚ DE BOTONES --- */}
          <aside className="md:w-1/4 lg:w-1/5">
            {/* Móvil: Selector tipo Dropdown */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-full flex justify-between items-center text-left px-6 py-4 rounded-3xl font-black transition-all duration-200 bg-[#7e1d91] text-white shadow-lg"
              >
                <span>{activeTabLabel}</span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Escritorio: Lista de Botones */}
            <nav className={`flex-col space-y-3 ${isMenuOpen ? 'flex' : 'hidden'} md:flex`}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 text-left px-6 py-4 rounded-3xl font-black transition-all duration-300 w-full text-sm uppercase tracking-wider ${
                    activeTab === tab.id 
                    ? 'bg-[#7e1d91] text-white shadow-[0_15px_35px_rgba(126,29,145,0.25)] scale-105' 
                    : 'bg-white text-[#4f2f7a] border border-[#ece0ff] hover:bg-[#f7efff] hover:translate-x-1'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* --- MAIN: CONTENIDO DINÁMICO --- */}
          <main className="md:w-3/4 lg:w-4/5">
            <div className="bg-white p-2 md:p-8 rounded-4xl shadow-[0_20px_70px_rgba(126,29,145,0.06)] border border-[#e6d7ff] overflow-hidden">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}