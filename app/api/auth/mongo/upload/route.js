import fs from "fs";
import { NextResponse } from "next/server";
const readline = require("readline");

export async function POST(req) {
  console.log("inside POST handler", req.body);

  // const stream = fs.createReadStream("path/to/your/file.csv");
  // const reader = readline.createInterface({
  //   input: stream,
  //   crlfDelay: Infinity,
  // });

  // reader.on("line", (line) => {
  //   const columns = line.split(",");
  //   // Handle the columns array
  // });

  // reader.on("close", () => {
  //   // Handle the end of the file
  // });

  return new NextResponse([]);
}
