import { connect } from "@/app/lib/dbConfig2";
import User from "@/app/models/userModel";
import Session from "@/app/models/sessionModel"; // Import the Session model
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAuthToken, setAuthToken, setSchoolName, getSchoolName } from "@/app/lib/global";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      school_name: user.school_name,
    };

    const token = await jwt.sign(
      tokenData,
      process.env.TOKEN_SECRET!,
      { expiresIn: "1d" }
    );

    // Store the session in the 'sessions' collection using the Session model
    await Session.create({ sessionName: 'currentSession', token });

    setAuthToken(token); // Set the authToken
    setSchoolName(user.school_name); // Set the school name

    console.log("AuthToken after setting:", getAuthToken()); // Log the authToken
    console.log("School name after setting:", getSchoolName()); // Log the school name

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
