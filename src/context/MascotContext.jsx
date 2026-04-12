import React, { createContext, useContext, useState } from 'react';

const MascotContext = createContext();

export const MascotProvider = ({ children }) => {
  const [mood, setMood] = useState('idle'); // idle, happy, thinking, excited
  const [message, setMessage] = useState('');

  const triggerAction = (newMood, newMessage = '') => {
    setMood(newMood);
    if (newMessage) setMessage(newMessage);
  };

  return (
    <MascotContext.Provider value={{ mood, message, triggerAction }}>
      {children}
    </MascotContext.Provider>
  );
};

export const useMascot = () => useContext(MascotContext);