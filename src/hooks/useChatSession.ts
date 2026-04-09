import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SESSION_ID_KEY = 'chatSessionId';

export const useChatSession = () => {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  const createNewSession = () => {
    const newSessionId = uuidv4();
    sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
    setSessionId(newSessionId);
  };

  return { sessionId, createNewSession };
};
