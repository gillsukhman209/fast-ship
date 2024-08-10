"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./comps/Loading";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const { data: session, status } = useSession();

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

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    onFileUpload(data);
  };

  if (status === "authenticated") {
    return (
      <div className="min-h-screen w-full  text-black flex flex-col items-center gap-20">
        <div
          className="text-2xl text-black bg-red-500 p-2 rounded-md"
          onClick={() => signOut()}
        >
          Logout
        </div>
        <div className="">Welcome {session?.user?.email} </div>
        <Toaster />
      </div>
    );
  } else if (status === "loading") {
    return <Loading />;
  }
}
