import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../db/config";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function useRoleProtection(allowedRoles: string[]) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        navigate("/unauthorized");
        return;
      }

      const role = userSnap.data().role;
      if (!allowedRoles.includes(role)) {
        navigate("/unauthorized");
        return;
      }

      setLoading(false);
    };

    checkRole();
  }, [allowedRoles, navigate]);

  return loading;
}
