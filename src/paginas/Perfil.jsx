import { useState } from "react";
import { useAuth } from "../context/authContext";
import PerfilForm from '../componentes/PerfilForm';

export default function Perfil() {
  const { usuarioActual, cargandoAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (cargandoAuth || !usuarioActual) {
    return (
      <div className="min-h-screen bg-[#fff3f0] flex items-center justify-center">
        <p className="text-[#7a1a0a] font-semibold">Cargando tu perfil...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'perfil', label: 'Gestionar Perfil' },
  ];

  const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label;

  const renderContent = () => {
    return <PerfilForm user={usuarioActual} />;
  };

  return (
    <div className="min-h-screen bg-[#fff3f0]">
      <div className="w-full">
        {/* Banner de Bienvenida */}
        <div className="w-full bg-linear-to-r from-[#7e1d91] via-[#8f3cbf] to-[#bd6fe4] shadow-[0_40px_120px_rgba(126,29,145,0.18)] py-16 md:py-20 text-center text-white mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-[#f3e6ff]/90 mb-4">Mi perfil</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight px-4 md:px-0">
            ¡Bienvenido a tu Perfil, {usuarioActual.nombre || usuarioActual.username}!
          </h1>
          <p className="mt-4 text-[#f7ebff]/90 max-w-3xl mx-auto text-base md:text-xl px-4 md:px-0">
            Administra tu información personal y mantén tu cuenta actualizada.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4 lg:w-1/5">
            {/* --- Botón de Menú para Móviles --- */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-full flex justify-between items-center text-left px-4 py-3 rounded-3xl font-semibold transition-all duration-200 bg-[#7e1d91] text-white shadow-lg"
              >
                <span>{activeTabLabel}</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${isMenuOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* --- Navegación --- */}
            <nav className={`flex-col space-y-3 ${isMenuOpen ? 'flex' : 'hidden'} md:flex`}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMenuOpen(false); // Cierra el menú al seleccionar
                  }}
                  className={`text-left px-5 py-4 rounded-3xl font-semibold transition-all duration-200 w-full text-sm ${activeTab === tab.id ? 'bg-[#7e1d91] text-white shadow-[0_18px_40px_rgba(126,29,145,0.22)]' : 'bg-white text-[#4f2f7a] border border-[#ece0ff] hover:bg-[#f7efff]'}`}>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="md:w-3/4 lg:w-4/5">
            <div className="bg-white p-6 md:p-8 rounded-4xl shadow-[0_18px_60px_rgba(126,29,145,0.08)] border border-[#e6d7ff]">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}