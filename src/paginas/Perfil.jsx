import { useState } from "react";
import { useAuth } from "../context/authContext";
import PerfilForm from '../componentes/PerfilForm';
import Responder from '../componentes/Responder';
import MisConsultas from "../componentes/MisConsultas"; // Asegúrate de que la ruta sea correcta

// Componentes de Administración
import GestionUsuarios from "../componentes/GestionUsuarios";
import GestionReclamos from "../componentes/GestionReclamos";
import GestionPostulaciones from "../componentes/GestionPostulaciones"; 
import GestionSubirEmpleo from "../componentes/GestionSubirEmpleo";
import Preguntas from "../componentes/Preguntas";

import { 
  User, MessageSquare, LayoutDashboard, Briefcase, 
  Settings, Users, HelpCircle, PlusCircle, 
  Menu, X, MessageCircle
} from 'lucide-react';

export default function Perfil() {
  const { usuarioActual, cargandoAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (cargandoAuth || !usuarioActual) {
    return (
      <div className="min-h-screen bg-[#fcfaff] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7e1d91]/10 border-t-[#7e1d91] rounded-full animate-spin mb-4"></div>
        <p className="text-[#3b0f52] font-black uppercase italic text-[10px] tracking-[0.3em] animate-pulse">Cargando...</p>
      </div>
    );
  }

  const esAdmin = usuarioActual.rol === 'admin' || usuarioActual.rol === 'editor';

  // Configuración base del menú
  const menuConfig = [
    { id: 'perfil', label: 'Mi Perfil', icon: <Settings size={18} />, component: <PerfilForm /> },
  ];

  // Configuración condicional según el ROL
  if (esAdmin) {
    menuConfig.push(
      { id: 'usuarios', label: 'Usuarios', icon: <Users size={18} />, component: <GestionUsuarios /> },
      { id: 'reclamos', label: 'Reclamos + Quejas', icon: <LayoutDashboard size={18} />, component: <GestionReclamos /> },
      { id: 'empleos', label: 'Empleos', icon: <PlusCircle size={18} />, component: <GestionSubirEmpleo /> },
      { id: 'preguntas', label: 'Preguntas', icon: <HelpCircle size={18} />, component: <Preguntas /> }
    );
  } else {
    menuConfig.push(
      // --- SECCIÓN PARA USUARIOS COMUNES ---
      { 
        id: 'mis-consultas', 
        label: 'Mis Consultas', 
        icon: <MessageCircle size={18} />, 
        component: <MisConsultas /> 
      },
      { 
        id: 'mis-mensajes', 
        label: 'Chat de Soporte', 
        icon: <MessageSquare size={18} />, 
        component: <Responder /> 
      }
    );
  }

  const activeContent = menuConfig.find(tab => tab.id === activeTab)?.component || <PerfilForm />;

  return (
    <div className="min-h-screen bg-[#fcfaff] font-sans overflow-x-hidden">
      
      {/* -- BANNER COMPACTO Y CENTRADO --- */}
      <div className="w-full pt-16 md:pt-20 bg-[#3b0f52] relative overflow-hidden shadow-lg border-b-4 border-[#00d1c4]/20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3b0f52] via-[#7e1d91] to-[#601675] opacity-95"></div>
        <div className="absolute top-5 left-[5%] w-24 h-24 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10px] right-[5%] w-32 h-32 bg-purple-300/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="inline-block bg-[#00d1c4] text-[#3b0f52] px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-[0.2em] mb-4 shadow-xl shadow-[#00d1c4]/20">
              {esAdmin ? "Panel Administrativo" : "Mi Cuenta!"}
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white italic leading-[0.8] tracking-tighter mb-4">
              Bienvenido <br /> 
              <span className="text-white/95">a tu perfil</span>
            </h1>
            <div className="flex flex-col items-center">
              <p className="text-white/90 font-medium text-base md:text-xl">
                Hola, <span className="text-white font-black text-2xl md:text-5xl underline decoration-[#00d1c4] decoration-4 underline-offset-4">
                  {usuarioActual.nombre?.split(' ')[0] || 'Yaper@'}
                </span>
              </p>
              <p className="text-white/50 text-[10px] md:text-xs mt-3 font-bold uppercase tracking-[0.25em]">
                {esAdmin ? "Gestión de Ecosistema" : "Revisa tus consultas y datos"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DE CONTENIDO -- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* --- SIDEBAR -- */}
          <aside className="md:w-1/4 lg:w-72">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-full mb-6 flex items-center justify-center gap-3 px-6 py-4 bg-[#7e1d91] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl"
            >
              {isMenuOpen ? <X size={18}/> : <Menu size={18}/>} {isMenuOpen ? 'Cerrar' : 'Menú'}
            </button>

            <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col gap-2.5`}>
              {menuConfig.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 px-6 py-4 rounded-[22px] font-black transition-all duration-300 text-[10px] uppercase tracking-wider ${
                    activeTab === tab.id 
                    ? 'bg-[#7e1d91] text-white shadow-xl shadow-purple-200 scale-105 z-10 border-b-2 border-[#00d1c4]' 
                    : 'bg-white text-[#3b0f52] border border-purple-50 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-[#00d1c4]' : 'text-[#7e1d91]'}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>
          </aside>

          {/* --- PANEL PRINCIPAL --- */}
          <main className="flex-1">
            <div className="bg-white rounded-[40px] p-6 md:p-12 shadow-[0_20px_70px_rgba(0,0,0,0.03)] border border-white min-h-[550px]">
                <div className="mb-8 flex items-center justify-center md:justify-start gap-4 border-b border-gray-50 pb-6">
                    <div className="p-3 bg-[#fcfaff] rounded-xl text-[#7e1d91]">
                        {menuConfig.find(t => t.id === activeTab)?.icon}
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-[#3b0f52] uppercase italic tracking-tighter text-center md:text-left">
                        {menuConfig.find(t => t.id === activeTab)?.label}
                    </h2>
                </div>
                
                <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeContent}
                </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}