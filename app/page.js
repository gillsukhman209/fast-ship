"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./comps/Loading";
import toast, { Toaster } from "react-hot-toast";
import UploadFile from "./comps/UploadFile.jsx";
import TradesTable from "./comps/TradesTable";

export default function Home() {
  const { data: session, status } = useSession();
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/api/auth/login";
    } else if (status === "authenticated") {
      initialFunctions();
    }
  }, [status]);

  const initialFunctions = async () => {
    await addUserToDB()
      .then((res) => {
        alert("user added to db" + res.data);
      })
      .catch((error) => {
        console.error("Error adding user to DB:", error);
      });
  };

  const addUserToDB = async () => {
    try {
      await axios.post("/api/auth/mongo/createUser", {
        email: session?.user?.email,
      });
    } catch (error) {
      console.error("Error adding user to DB:", error);
    }
  };

  if (status === "authenticated") {
    return (
      <div className="min-h-screen w-full  text-black flex flex-col items-center gap-20">
        <div>
          <h1>Trading Journal</h1>
          <UploadFile onFileUpload={setTrades} />
          <TradesTable trades={trades} />
        </div>

        <Toaster />
      </div>
    );
  } else if (status === "loading") {
    return <Loading />;
  }
}
