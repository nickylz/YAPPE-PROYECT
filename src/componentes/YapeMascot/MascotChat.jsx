import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../context/authContext";
import { useMascot } from "../../context/MascotContext";
import { Send, MessageCircle, ArrowDown, User, LifeBuoy, ShoppingBag } from 'lucide-react';

const MascotChat = ({ onClose }) => {
  const { usuarioActual } = useAuth();
  const { triggerAction } = useMascot();
  const navigate = useNavigate();
  const location = useLocation();
  const chatEndRef = useRef(null);
  
  const [history, setHistory] = useState([]);
  const [options, setOptions] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // 1. Lógica de inicialización por Ruta
  useEffect(() => {
    const initChat = async () => {
      setHistory([]); // Limpiar historial al abrir
      await delay(400);
      
      const nombre = usuarioActual?.displayName || "Yaperito";

      if (location.pathname.includes('/perfil')) {
        addMessage('bot', `¡Hola ${nombre}! Estás en tu zona personal. ¿Quieres que te ayude a actualizar tus datos?`);
        setOptions([
          { label: 'Editar Perfil ✍️', action: 'nav', path: '/perfil/edit' },
          { label: 'Ver puestos de trabajo', action: 'nav', path: '/pedidos' },
          { label: 'Regresar al Inicio', action: 'nav', path: '/' }
        ]);
      } 
      else if (location.pathname.includes('/reclamos')) {
        triggerAction('thinking');
        addMessage('bot', 'Lamento que algo no haya salido bien. Cuéntame, ¿cuál es el inconveniente?');
        setOptions([
          { label: 'Pedido no llegó ❌', action: 'reclamar', type: 'logistica' },
          { label: 'Mala atención', action: 'reclamar', type: 'calidad' },
          { label: 'Hablar con soporte 👤', action: 'soporte' }
        ]);
      } 
      else {
        addMessage('bot', `¡Hola! Soy YapeMascot. 💜 ¿En qué puedo ayudarte hoy?`);
        showMainMenu();
      }
    };

    initChat();
  }, [location.pathname]);

  // Scroll automático
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, options]);

  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  const addMessage = (sender, text) => setHistory(prev => [...prev, { sender, text }]);

  const showMainMenu = () => {
    setOptions([
      { label: 'Ver Productos 🛍️', action: 'nav', path: '/productos' },
      { label: 'Ir a mi Perfil 👤', action: 'nav', path: '/perfil' },
      { label: 'Tengo un Reclamo 🚩', action: 'nav', path: '/reclamos' }
    ]);
  };

  const handleOptionClick = async (option) => {
    addMessage('user', option.label);
    setOptions([]);
    await delay(600);

    switch (option.action) {
      case 'nav':
        addMessage('bot', '¡Entendido! Vamos para allá...');
        await delay(500);
        navigate(option.path);
        break;
      
      case 'reclamar':
        addMessage('bot', `He tomado nota sobre el problema de ${option.type}. Por favor, escribe los detalles abajo.`);
        setInputVisible(true);
        break;

      case 'soporte':
        addMessage('bot', 'Conectando con un agente... Por favor espera un momento.');
        break;

      default:
        showMainMenu();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    addMessage('user', inputValue);
    setInputValue('');
    setInputVisible(false);
    
    // Aquí conectarías con Firebase para guardar el mensaje
    setTimeout(() => {
      addMessage('bot', '¡Mensaje recibido! Revisaremos tu caso de inmediato. ✅');
      showMainMenu();
    }, 1000);
  };

  return (
    <div className="w-[320px] h-[450px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 flex-none">
      
      {/* HEADER: Gradiente Turquesa Yape */}
      <div className="bg-gradient-to-r from-[#00d1b2] to-[#00bfa5] p-5 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">YapeMascot</h3>
            <span className="text-[10px] text-white/80 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> En línea ahora
            </span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="hover:bg-black/10 p-2 rounded-full transition-colors"
        >
          <ArrowDown size={20} />
        </button>
      </div>

      {/* BODY: Área de mensajes */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#f9fbfb] flex flex-col gap-4 custom-scrollbar">
        {history.map((msg, i) => (
          <div 
            key={i} 
            className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all ${
              msg.sender === 'bot' 
                ? 'bg-white text-gray-700 self-start border-tl-none rounded-tl-none' 
                : 'bg-[#00d1b2] text-white self-end rounded-tr-none'
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* Opciones Interactivas */}
        {options.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleOptionClick(opt)}
                className="w-full py-2.5 px-4 bg-white border border-[#00d1b2] text-[#00d1b2] rounded-xl text-xs font-bold hover:bg-[#00d1b2] hover:text-white transition-all duration-200 text-left shadow-sm flex justify-between items-center group"
              >
                {opt.label}
                <span className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">→</span>
              </button>
            ))}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* FOOTER: Input dinámico */}
      {inputVisible ? (
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
          <input 
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#00d1b2]/30 transition-all"
            placeholder="Escribe tu mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
          <button 
            type="submit" 
            className="bg-[#00d1b2] text-white p-2.5 rounded-xl hover:bg-[#00bfa5] shadow-lg transition-transform active:scale-90"
          >
            <Send size={18} />
          </button>
        </form>
      ) : (
        <div className="p-3 text-center bg-gray-50 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            Powered by YapeMascot Engine
          </p>
        </div>
      )}
    </div>
  );
};

export default MascotChat;