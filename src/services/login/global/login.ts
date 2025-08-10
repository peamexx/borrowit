import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "@services/firebase/firebase";

export const doLogin = async (formData: any) => {
  const client: string = import.meta.env.VITE_CLIENT || 'default';

  const userQuery = query(
    collection(db, "member_master"),
    where("id", "==", formData.id),
    where("companyName", "==", client.toUpperCase()),
    where("useYn", "==", "Y"),
  );
  const querySnapshot = await getDocs(userQuery);
  if (querySnapshot.empty) return null;

  const roleDoc: any = await getDoc(querySnapshot.docs[0].data().roleRef);
  if (!roleDoc.exists()) return null;

  return {
    username: querySnapshot.docs[0].data().username,
    id: querySnapshot.docs[0].data().id,
    roleName: roleDoc.data().roleName,
    permissions: roleDoc.data().permissions,
  }
}

export const doLogout = async () => {
  // 뭔가 서버 작업한다고 가정
  return new Promise((res) => res(true));
}