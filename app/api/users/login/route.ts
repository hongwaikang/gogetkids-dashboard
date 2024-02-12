import {connect} from "@/app/lib/dbConfig2";
import User from "@/app/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

connect()

export async function POST(request: NextRequest) {
  try {

    const reqBody = await request.json();
    const {email, password} = reqBody;
    console.log(reqBody);

    const user = await User.findOne({email})
    if (!user) {
      return NextResponse.json({error: "User does not exist"}, {status: 400})
    }

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({error: "Invalid password"}, {status: 400})
    }

  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
}