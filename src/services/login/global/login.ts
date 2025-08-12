import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "@services/firebase/firebase";

export const doLogin = async (formData: any) => {
  const client: string = import.meta.env.VITE_CLIENT || 'default';

  const companyQuery = query(
    collection(db, "company_master"),
    where("companyName", "==", client)
  );
  const companySnapshot = await getDocs(companyQuery);
  if (companySnapshot.empty) {
    console.warn('Login Fail: company');
    return null;
  }

  const userQuery = query(
    collection(db, "member_master"),
    where("id", "==", formData.id),
    where("companyRef", "==", companySnapshot.docs[0].ref),
    where("useYn", "==", "Y"),
  );
  const querySnapshot = await getDocs(userQuery);
  if (querySnapshot.empty) {
    console.warn('Login Fail: user');
    return null;
  }

  const roleDoc: any = await getDoc(querySnapshot.docs[0].data().roleRef);
  if (!roleDoc.exists()) {
    console.warn('Login Fail: role');
    return null;
  }

  return {
    username: querySnapshot.docs[0].data().username,
    id: querySnapshot.docs[0].data().id,
    companyName: companySnapshot.docs[0].data().companyName,
    roleName: roleDoc.data().roleName,
    permissions: roleDoc.data().permissions,
  }
}

export const doLogout = async () => {
  // 뭔가 서버 작업한다고 가정
  return new Promise((res) => res(true));
}