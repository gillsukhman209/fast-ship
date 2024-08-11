"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div className="min-h-screen w-full  text-black flex flex-col items-center gap-20">
      <div className="flex flex-col items-center gap-20 mt-20">
        <div>Hellos</div>
      </div>

      <Toaster />
    </div>
  );
}
