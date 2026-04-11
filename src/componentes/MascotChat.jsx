import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { X, Send, MessageCircle, ArrowDown } from 'lucide-react';

const MascotChat = ({ onClose, triggerAction, anchorClass }) => { 
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  
  // Ref para evitar doble ejecución (Bug de mensajes duplicados)
  const hasGreeted = useRef(false);

  // Estados del Chat
  const [history, setHistory] = useState([]);
  const [options, setOptions] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');

  // Efecto de inicialización
  useEffect(() => {
    // Si ya saludamos, no hacer nada (Evita duplicados)
    if (hasGreeted.current) return;
    hasGreeted.current = true;

    setHistory([]);
    triggerAction('happy'); 

    const startConversation = async () => {
      await delay(300);
      addMessage('bot', '¡Hola! Soy Torti 🍰.');

      await delay(800);
      
      if (usuarioActual) {
        const name = usuarioActual.displayName || usuarioActual.nombre || usuarioActual.email?.split('@')[0] || "Amigo";
        setUserName(name);
        addMessage('bot', `¡Qué milagro verte por aquí, ${name}! ¿Todo bien?`);
        await delay(500);
        showMainMenu();
      } else {
        addMessage('bot', 'Oye, no reconozco tu cara... ¿Cómo te llamas?');
        setInputVisible(true);
      }
    };

    startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Scroll automático
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, options, inputVisible]);

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const addMessage = (sender, text) => {
    setHistory(prev => [...prev, { sender, text }]);
  };

  const showMainMenu = () => {
    addMessage('bot', '¿Qué se te antoja hacer?');
    triggerAction('idle');
    setOptions([
      { label: 'Recomiéndame algo rico 😋', action: 'recomendar' },
      { label: 'Cuéntame un chisme 🤫', action: 'secreto' },
      { label: 'Nada, solo pasaba (Bajar) ⬇️', action: 'cerrar' }
    ]);
  };

  const handleOptionClick = async (option) => {
    addMessage('user', option.label);
    setOptions([]);

    await delay(600);

    switch (option.action) {
      case 'recomendar':
        triggerAction('thinking');
        addMessage('bot', 'Mmm... déjame escanear tus gustos...');
        await delay(1200);
        triggerAction('excited');
        addMessage('bot', '¡Ya sé! Tienes cara de que te urge un Strawberry Cloud, esos trozos de fresa son irresistibles. 🍓☁️');
        setOptions([
          { label: '¡Uff, llévame ahí!', action: 'ir_productos' },
          { label: 'Mmm, mejor otra cosa', action: 'menu' }
        ]);
        break;

      case 'secreto':
        triggerAction('reading'); 
        addMessage('bot', 'Acércate, que no nos escuche el jefe...');
        await delay(1500);
        addMessage('bot', 'Dicen que si le das "Pagar" al carrito, te llega felicidad instantánea a tu casa. 🤭');
        triggerAction('happy');
        await delay(2000);
        showMainMenu();
        break;

      case 'ir_productos':
        addMessage('bot', '¡Vamonos! 🚀');
        await delay(500);
        navigate('/productos');
        break;

      case 'menu':
        showMainMenu();
        break;

      case 'cerrar':
        triggerAction('idle');
        addMessage('bot', '¡Dale! Aquí estaré cuidando la tienda. 👋');
        await delay(1000);
        onClose();
        break;

      default:
        showMainMenu();
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const name = inputValue;
    addMessage('user', name);
    setInputValue('');
    setInputVisible(false);
    setUserName(name);

    triggerAction('excited');
    await delay(600);
    addMessage('bot', `¡Ah, con que ${name}! Mucho gusto, ahora sí somos amigos.`);
    await delay(1000);
    showMainMenu();
  };

  return (
    <>
      <style>{`
        .chat-container {
          position: absolute; /* Se mantiene ABSOLUTE respecto a CakeMascot */
          width: 300px;
          height: 420px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: sans-serif;
          animation: popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid #f5bfb2;
          cursor: default;
          z-index: 10000;
        }
        
        /* 1. Anclaje vertical: ARRIBA */
        .chat-container.anchor-top {
          bottom: 90px; 
          top: auto;
        }

        /* 2. Anclaje vertical: ABAJO */
        .chat-container.anchor-bottom {
          bottom: auto;
          top: 90px; 
        }

        /* 3. Anclaje horizontal: Izquierda */
        .chat-container.anchor-left {
          left: 0;
          right: auto;
          /* Centrar sobre el centro (45px) de la mascota (90px) */
          transform: translateX(calc(-50% + 45px)); 
        }

        /* 4. Anclaje horizontal: Derecha */
        .chat-container.anchor-right {
          right: 0;
          left: auto;
          /* Mueve el chat hacia la derecha */
          transform: translateX(calc(50% - 45px));
        }

        .chat-header {
          background: linear-gradient(90deg, #d16170 0%, #e17a8d 100%);
          padding: 12px 15px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
        }
        .chat-body {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          background: #fffcfb;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .msg {
          padding: 10px 14px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.4;
          max-width: 85%;
          animation: slideIn 0.3s ease;
        }
        .msg-bot { background: #f0f2f5; color: #333; align-self: flex-start; border-bottom-left-radius: 4px; }
        .msg-user { background: #d16170; color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
        
        .options-grid { display: flex; flex-direction: column; gap: 8px; margin-top: 5px; }
        .opt-btn {
          background: white; border: 1px solid #d16170; color: #d16170;
          padding: 10px; border-radius: 25px; font-size: 13px; cursor: pointer;
          transition: all 0.2s; text-align: center; font-weight: 600;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .opt-btn:hover { background: #fff3f0; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(0,0,0,0.1); }

        .input-area { padding: 12px; border-top: 1px solid #eee; display: flex; gap: 8px; background: white; }
        .name-input { flex: 1; border: 1px solid #ddd; border-radius: 20px; padding: 8px 15px; font-size: 14px; outline: none; }
        .name-input:focus { border-color: #d16170; }
        .send-btn {
          background: #d16170; color: white; border: none; width: 38px; height: 38px;
          border-radius: 50%; display: flex; align-items: center; justify-center; cursor: pointer; transition: transform 0.2s;
        }
        .send-btn:hover { transform: scale(1.1); }

        @keyframes popUp { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .chat-body::-webkit-scrollbar { width: 6px; }
        .chat-body::-webkit-scrollbar-thumb { background: #f5bfb2; border-radius: 3px; }
      `}</style>

      <div 
        className={`chat-container ${anchorClass}`} 
        onMouseDown={(e) => e.stopPropagation()} 
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="chat-header">
          <div className="flex items-center gap-2">
            <div className="relative">
                <MessageCircle size={18} />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
            </div>
            <span>Torti Chat</span>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition" title="Bajar">
            <ArrowDown size={20} />
          </button>
        </div>

        <div className="chat-body">
          {history.map((msg, i) => (
            <div key={i} className={`msg ${msg.sender === 'bot' ? 'msg-bot' : 'msg-user'}`}>
              {msg.text}
            </div>
          ))}

          {options.length > 0 && (
            <div className="options-grid">
              {options.map((opt, i) => (
                <button key={i} className="opt-btn" onClick={() => handleOptionClick(opt)}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {inputVisible && (
          <form onSubmit={handleNameSubmit} className="input-area">
            <input 
              className="name-input" 
              placeholder="Escribe tu nombre..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
            <button type="submit" className="send-btn">
              <Send size={16} />
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default MascotChat; 