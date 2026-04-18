import React, { useState } from "react";
import { ChevronDown, Send } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import mascotaYapeImg from "../img/yape-mascot.png";

const MascotChat = ({ onClose, onOpenLogin }) => {
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  // ESTADO PARA LA CONVERSACIÓN
  const [mensajes, setMensajes] = useState([
    {
      texto: "¡Hola! Soy YapeMascot. 💜 ¿Buscas chamba o tienes alguna duda?",
      emisor: "bot",
    },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Agregar mensaje del usuario
    const nuevoMensaje = { texto: inputValue, emisor: "usuario" };
    setMensajes((prev) => [...prev, nuevoMensaje]);
    setInputValue("");

    // 2. Simular respuesta del bot para que no se quede vacío
    setTimeout(() => {
      setMensajes((prev) => [
        ...prev,
        {
          texto:
            "¡Ntp! Déjame reviso esa información por ti. 💜 ¿En qué más puedo ayudarte?",
          emisor: "bot",
        },
      ]);
    }, 1000);
  };

  const handleProfileNavigation = () => {
    if (usuarioActual) {
      navigate(`/perfil/${usuarioActual.displayName || "usuario"}`);
    } else {
      onOpenLogin();
      onClose();
    }
  };

  return (
    <div className="w-[calc(100vw-2rem)] sm:w-[350px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
      {/* CABECERA */}
      <div className="bg-[#00d1b2] p-4 sm:p-5 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={mascotaYapeImg}
              alt="Mascota"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 p-1 object-contain"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#00d1b2] rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg leading-none">
              YapeMascot
            </h3>
            <p className="text-[10px] opacity-90 font-medium italic">
              En línea ahora
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-black/10 p-1 rounded-full transition-colors"
        >
          <ChevronDown size={28} />
        </button>
      </div>

      {/* CUERPO DEL CHAT DINÁMICO */}
      <div className="p-4 sm:p-5 bg-gray-50 flex-1 max-h-[45vh] sm:max-h-[380px] overflow-y-auto space-y-4 flex flex-col">
        {mensajes.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.emisor === "usuario" ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2`}
          >
            <div
              className={`p-3 px-4 rounded-2xl shadow-sm max-w-[85%] text-sm leading-relaxed ${
                msg.emisor === "usuario"
                  ? "bg-[#7422ff] text-white rounded-tr-none"
                  : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
              }`}
            >
              {msg.texto}
            </div>
          </div>
        ))}

        {/* BOTONES DE ACCIÓN (Chips) - Se muestran siempre abajo del primer mensaje */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            to="/productos"
            className="py-2 px-4 bg-white border border-[#00d1b2] text-[#00d1b2] rounded-full text-[11px] font-bold hover:bg-[#00d1b2] hover:text-white transition-all shadow-sm"
          >
            Ver Puestos 📄
          </Link>
          <button
            onClick={handleProfileNavigation}
            className="py-2 px-4 bg-white border border-[#00d1b2] text-[#00d1b2] rounded-full text-[11px] font-bold hover:bg-[#00d1b2] hover:text-white transition-all shadow-sm"
          >
            Mi Perfil 👤
          </button>
          <Link
            to="/centrodeayuda"
            className="py-2 px-4 bg-white border border-[#00d1b2] text-[#00d1b2] rounded-full text-[11px] font-bold hover:bg-[#00d1b2] hover:text-white transition-all shadow-sm"
          >
            Ayuda 🚩
          </Link>
        </div>
      </div>

      {/* BARRA DE ENTRADA */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-gray-100 border-none rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#00d1b2] outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className={`p-2.5 rounded-full transition-all ${inputValue.trim() ? "bg-[#7422ff] text-white shadow-md" : "bg-gray-200 text-gray-400 opacity-50"}`}
        >
          <Send size={18} />
        </button>
      </form>

      <div className="pb-2 text-center bg-white">
        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
          YAPEMASCOT ENGINE 2026
        </p>
      </div>
    </div>
  );
};

export default MascotChat;
