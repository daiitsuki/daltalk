import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
    <Container>
      <Title>TalkTalk</Title>
      <LoginForm onSubmit={handleLogin}>
        <NicknameInput
          type="text"
          placeholder="프로필 명을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <PasswordInput
          type="password"
          placeholder="패스워드를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoginButton type="submit">채팅방 입장</LoginButton>
      </LoginForm>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #6f42c1;
  margin-bottom: 2rem;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const NicknameInput = styled.input`
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const PasswordInput = styled.input`
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const LoginButton = styled.button`
  padding: 0.8rem;
  font-size: 1rem;
  color: #ffffff;
  background-color: #6f42c1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5a32a3;
  }
`;

export default LoginPage;