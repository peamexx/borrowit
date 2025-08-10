
import styles from './login.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

import { useAuthStore } from '@services/login/global/userStore';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [value, setValue] = useState({ id: 'admin' });

  const handleClick = async () => {
    if (value.id === '') {
      alert('빈 칸을 채워주세요.');
      return;
    };

    await login({ id: value.id });

    setTimeout(() => {
      navigate("/");
    }, 200);
  }

  return (
    <div className={styles.login}>
      <Message className={styles.float} severity="warn" text="이 사이트는 포트폴리오용으로 제작되었습니다. 간편한 접속을 위해 비밀번호를 생략하였습니다." />
      <div className={styles.inner}>
        <h2>사내 서비스 신청</h2>
        <FloatLabel>
          <InputText id="id" value={value.id} onChange={(e) => setValue((prev) => ({ ...prev, id: e.target.value }))} />
          <label htmlFor="id">아이디</label>
        </FloatLabel>
        <Message text="아이디: admin" />
        <Button label="로그인" onClick={handleClick} />
      </div>
    </div>
  )
}

export default Login
