import { useCallback, useEffect, useRef, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export default function useBookings(uid) {
  const [state, setState] = useState({ uid, status: 'loading', bookings: [] });
  const generation = useRef(0);
  const invalidate = useCallback(() => { generation.current++; }, []);
  const reload = useCallback(async () => {
    const request = ++generation.current;
    if (!uid) return;
    setState({ uid, status: 'loading', bookings: [] });
    try {
      const snapshot = await getDocs(query(collection(db, 'bookings'),
        where('uid', '==', uid), orderBy('createdAt', 'asc')));
      if (request === generation.current) {
        setState({ uid, status: 'success', bookings: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) });
      }
    } catch {
      if (request === generation.current) setState({ uid, status: 'error', bookings: [] });
    }
  }, [uid]);
  useEffect(() => {
    reload();
    return invalidate;
  }, [reload, invalidate]);
  // Never render another account's results while the new effect is pending.
  return { ...(state.uid === uid ? state : { status: 'loading', bookings: [] }), reload };
}
