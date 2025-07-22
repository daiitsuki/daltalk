import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';

function LoginPage() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (nickname.trim() === '' || password.trim() === '') {
      alert('프로필 명과 패스워드를 모두 입력하세요.');
      return;
    }
    if (password !== '0604') {
      alert('패스워드가 올바르지 않습니다.');
      return;
    }
    try {
      const userCredential = await signInAnonymously(auth);
      localStorage.setItem('user', JSON.stringify({ ...userCredential.user, displayName: nickname }));
      navigate('/chat');
    } catch (error) {
      console.error("Error signing in anonymously: ", error);
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl text-[#6f42c1] mb-8">TalkTalk</h1>
      <form onSubmit={handleLogin} className="flex flex-col w-full">
        <input
          type="text"
          placeholder="프로필 명을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="p-3 text-base border border-gray-300 rounded mb-4"
        />
        <input
          type="password"
          placeholder="패스워드를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 text-base border border-gray-300 rounded mb-4"
        />
        <button type="submit" className="p-3 text-base text-white bg-[#6f42c1] border-none rounded cursor-pointer transition-colors duration-200 hover:bg-[#5a32a3]">
          채팅방 입장
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
