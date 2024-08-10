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

  const initialFunctions = async () => {};

  // const addUserToDB = async () => {
  //   try {
  //     await axios.post("/api/mongo/createUser", {
  //       email: session?.user?.email,
  //       name: session?.user?.name,
  //     });
  //   } catch (error) {
  //     console.error("Error adding user to DB:", error);
  //   }
  // };

  if (status === "authenticated") {
    return (
      <div className="min-h-screen w-full bg-[#13274D] text-white flex flex-col items-center gap-20">
        <div>this is the home page</div>
        <Toaster />
      </div>
    );
  } else if (status === "loading") {
    return <Loading />;
  }
}
