import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    try {
      const item = localStorage.getItem('user');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) {
      navigate('/');
    }
  }, [user, navigate]);

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleChangeNickname = () => {
    const newNickname = prompt(
      '어떤 이름으로 보여지고 싶나요?',
      user.displayName || '',
    );
    if (newNickname && newNickname.trim() !== '') {
      updateUser({ displayName: newNickname });
      alert('프로필명이 변경되었습니다.');
    }
  };

  return { user, handleChangeNickname };
};
