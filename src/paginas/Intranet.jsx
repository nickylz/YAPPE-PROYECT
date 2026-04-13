import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import GestionUsuarios from "../componentes/GestionUsuarios";
import GestionReclamos from "../componentes/GestionReclamos";
import GestionPostulaciones from "../componentes/GestionPostulaciones"; // Importa el nuevo

export default function Intranet() {
  const { usuarioActual } = useAuth();
  const esAdmin = usuarioActual?.rol === "admin";
  const navigate = useNavigate();

  // Definición de pestañas basada en roles
  const allTabs = [
    { id: 'reclamos', label: 'Gestión de Reclamos', roles: ['admin'], component: <GestionReclamos /> },
    { id: 'usuarios', label: 'Gestión de Usuarios', roles: ['admin'], component: <GestionUsuarios /> },
    { id: 'postulaciones', label: 'Gestión de CVs', roles: ['admin'], component: <GestionPostulaciones /> },
  ];

  const availableTabs = allTabs.filter(tab => tab.roles.includes(usuarioActual?.rol));
  
  const [activeTab, setActiveTab] = useState(availableTabs[0]?.id || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
    navigate('/intranet', { replace: true });
  };
  
  // Pantalla de error si no hay acceso o usuario
  if (!usuarioActual || availableTabs.length === 0) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center text-center p-4">
        <div className="bg-white rounded-4xl shadow-xl p-8 max-w-md border border-[#e6d7ff]">
          <h1 className="text-3xl font-bold text-[#7e1d91]">Acceso Denegado</h1>
          <p className="text-[#4f2f7a] mt-4 font-medium">No tienes los permisos necesarios para ver esta página.</p>
        </div>
      </div>
    );
  }

  const activeTabDetails = availableTabs.find(tab => tab.id === activeTab);
  const activeTabLabel = activeTabDetails?.label;

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* --- Banner de Bienvenida (Estilo Perfil.jsx) --- */}
      <div className="w-full bg-linear-to-r from-[#7e1d91] via-[#8f3cbf] to-[#bd6fe4] shadow-[0_40px_120px_rgba(126,29,145,0.18)] py-16 md:py-20 text-center text-white mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-[#f3e6ff]/90 mb-4">Panel de Administración</p>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight px-4 md:px-0">
          ¡Bienvenido a la Intranet, {usuarioActual.nombre || usuarioActual.username}!
        </h1>
        <p className="mt-4 text-[#f7ebff]/90 max-w-3xl mx-auto text-base md:text-xl px-4 md:px-0">
          Estás conectado como <span className="font-bold underline decoration-[#5eead4]">{usuarioActual.rol}</span>. Gestiona los módulos del sistema desde aquí.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* --- Navegación Lateral (Estilo Perfil.jsx) --- */}
          <aside className="md:w-1/4 lg:w-1/5">
            {/* Menú Móvil */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-full flex justify-between items-center text-left px-5 py-4 rounded-3xl font-semibold transition-all duration-200 bg-[#7e1d91] text-white shadow-lg"
              >
                <span>{activeTabLabel}</span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Menú Desktop */}
            <nav className={`flex-col space-y-3 ${isMenuOpen ? 'flex' : 'hidden'} md:flex`}>
              {availableTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`text-left px-5 py-4 rounded-3xl font-semibold transition-all duration-200 w-full text-sm ${
                    activeTab === tab.id 
                      ? 'bg-[#7e1d91] text-white shadow-[0_18px_40px_rgba(126,29,145,0.22)]' 
                      : 'bg-white text-[#4f2f7a] border border-[#ece0ff] hover:bg-[#f7efff]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* --- Contenido Principal (Estilo Perfil.jsx) --- */}
          <main className="md:w-3/4 lg:w-4/5">
            <div className="bg-white p-6 md:p-8 rounded-4xl shadow-[0_18px_60px_rgba(126,29,145,0.08)] border border-[#e6d7ff]">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#4f2f7a] mb-8 border-b border-[#f7efff] pb-4">
                {activeTab === 'reclamos' ? "Gestión de Reclamos y Quejas" : activeTabLabel}
              </h2>
              <div className="text-[#4f2f7a]">
                {activeTabDetails?.component}
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}