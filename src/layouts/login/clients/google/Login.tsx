
import styles from './login.module.css';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';

import { useAuthStore } from '@services/login/global/userStore';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const toast = useRef<any>(null);

  const [value, setValue] = useState({ id: 'admin-google' });

  const handleClick = async () => {
    if (value.id === '') {
      alert('빈 칸을 채워주세요.');
      return;
    };

    const res = await login({ id: value.id });
    if (!res.success) {
      toast.current?.show({ severity: 'error', summary: '로그인 실패', detail: '아이디를 확인해주세요.', life: 3000 });
      return;
    }

    setTimeout(() => {
      navigate("/");
    }, 200);
  }

  return (
    <div className={styles.login}>
      <Toast ref={toast} />
      <Message className={styles.float} severity="warn" text="이 사이트는 포트폴리오용으로 제작되었습니다. 간편한 접속을 위해 비밀번호를 생략하였습니다." />
      <div className={styles.inner}>
        <h2>업체A 로그인 페이지</h2>
        <FloatLabel>
          <InputText id="id" value={value.id} onChange={(e) => setValue((prev) => ({ ...prev, id: e.target.value }))} />
          <label htmlFor="id">아이디</label>
        </FloatLabel>
        <Message text="아이디: admin-google" />
        <Button label="로그인" onClick={handleClick} />
      </div>
    </div>
  )
}

export default Login
