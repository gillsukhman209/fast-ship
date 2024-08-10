import connectDB from "../../../../../lib/connectDB";
import User from "../../../../../model/User";
import { NextResponse } from "next/server";
export async function POST(req, res) {
  console.log("inside create user");
  try {
    const { email } = await req.json();

    console.log(email);

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" });
    }
    await saveUserToDB(email);

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to create user", error);
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}

const saveUserToDB = async (email, name) => {
  const person = new User({
    email: email,
  });
  await person.save();
};
