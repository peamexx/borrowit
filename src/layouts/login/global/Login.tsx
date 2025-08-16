
import styles from './login.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

import { useAuthStore } from '@services/auth/userStore';
import { useToast } from '@services/toast/ToastProvider';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { openToast } = useToast();

  const [value, setValue] = useState({ id: 'admin' });

  const handleKeyDown = (e: any) => {
    if (e.code.toLowerCase() === 'enter') {
      handleClick();
    }
  }

  const handleClick = async () => {
    if (value.id === '') {
      alert('빈 칸을 채워주세요.');
      return;
    };

    const res = await login({ id: value.id });
    if (!res.success) {
      openToast({ severity: 'error', summary: '로그인 실패', detail: '아이디를 확인해주세요.', life: 3000 });
      return;
    }

    setTimeout(() => {
      navigate("/");
    }, 200);
  }

  return (
    <div className={styles.login}>
      <Message className={styles.float} severity="warn" text="이 사이트는 포트폴리오용으로 제작되었습니다. 간편한 접속을 위해 비밀번호를 생략하였습니다." />
      <div className={styles.inner}>
        <h2>일반 로그인 페이지</h2>
        <FloatLabel>
          <InputText id="id" value={value.id} onChange={(e) => setValue((prev) => ({ ...prev, id: e.target.value }))} onKeyDown={handleKeyDown} />
          <label htmlFor="id">아이디</label>
        </FloatLabel>
        <Message text="관리자 계정은 admin, 유저는 user1을 입력해주세요." />
        <Button label="로그인" onClick={handleClick} />
      </div>
    </div>
  )
}

export default Login
