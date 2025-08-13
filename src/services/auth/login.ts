import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "@services/firebase/firebase";

export const doLogin = async (formData: any) => {
  const client: string = import.meta.env.VITE_CLIENT || 'default';

  // 1. env에 맞는 업체 데이터 가져오기.
  const companyQuery = query(
    collection(db, "company_master"),
    where("companyName", "==", client)
  );
  const companySnapshot = await getDocs(companyQuery);
  if (companySnapshot.empty) {
    console.warn('Login Fail: company');
    return null;
  }

  // 2. id와 업체 정보로 user 데이터 가져오기.
  const userQuery = query(
    collection(db, "member_master"),
    where("id", "==", formData.id),
    where("companyRef", "==", companySnapshot.docs[0].ref),
  );
  const querySnapshot = await getDocs(userQuery);
  if (querySnapshot.empty) {
    console.warn('Login Fail: user');
    return null;
  }

  // 3. user 권한 가져오기.
  const roleDoc: any = await getDoc(querySnapshot.docs[0].data().roleRef);
  if (!roleDoc.exists()) {
    console.warn('Login Fail: role');
    return null;
  }

  return {
    userRefStr: querySnapshot.docs[0].ref.path,
    username: querySnapshot.docs[0].data().username,
    id: querySnapshot.docs[0].data().id,
    companyRefStr: companySnapshot.docs[0].ref.path,
    companyName: companySnapshot.docs[0].data().companyName,
    roleName: roleDoc.data().roleName,
    permissions: roleDoc.data().permissions.map((p: any) => p.id)
  }
}

export const doLogout = async () => {
  // 뭔가 서버 작업한다고 가정
  return new Promise((res) => res(true));
}