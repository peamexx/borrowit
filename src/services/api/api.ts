import { doc, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "@services/firebase/firebase";

export const getDueListUser = async (user: any) => {
  const dueQuery = query(
    collection(db, "due_master"),
    where("memberRef", "==", doc(db, user.userRefStr)),
  );
  const dueSnapshot = await getDocs(dueQuery);
  if (dueSnapshot.empty) {
    console.warn('Get DueList Fail');
    return null;
  }

  const movieNames: any[] = [];
  for (const dueDoc of dueSnapshot.docs) {
    const dueData = dueDoc.data();
    const movieSnap = await getDoc(dueData.movieRef);

    if (movieSnap.exists()) {
      const movieData: any = movieSnap.data();
      movieNames.push({
        createDate: dueData.createDate,
        endDate: dueData.endDate,
        dday: _getDday(dueData.endDate),
        movieName: movieData.movieName,
      });
    }
  }

  return movieNames;
}

export const getDueListAllUsers = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10); // ex. "2025-08-13"

  const dueQuery = query(
    collection(db, "due_master"),
    where("endDate", "<", todayStr)
  );
  const dueSnapshot = await getDocs(dueQuery);
  if (dueSnapshot.empty) {
    console.warn('Get DueList Fail');
    return null;
  }

  const movieNames: any[] = [];
  for (const dueDoc of dueSnapshot.docs) {
    const dueData = dueDoc.data();
    const movieSnap = await getDoc(dueData.movieRef);
    const userSnap = await getDoc(dueData.memberRef);

    if (movieSnap.exists()) {
      const movieData: any = movieSnap.data();
      movieNames.push({
        createDate: dueData.createDate,
        endDate: dueData.endDate,
        dday: _getDday(dueData.endDate),
        movieName: movieData.movieName,
        username: (userSnap.data() as any)?.username || '',
      });
    }
  }

  return movieNames;
}

function _getDday(targetDateStr: string): string {
  const today = new Date();
  const [year, month, day] = targetDateStr.split("-").map(Number);
  const target = new Date(year, month - 1, day); // 로컬 타임 기준

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `-${diffDays}`;
  if (diffDays === 0) return '0';
  return `+${Math.abs(diffDays)}`;
}