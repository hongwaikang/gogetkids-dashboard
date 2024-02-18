import { connect } from "@/app/lib/dbConfig2";
import User from "@/app/models/userModel";
import School from "@/app/models/schoolModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password, school_name, firstname, lastname, role, company_name, address, postalcode } = reqBody;

        // Create a separate constant for address and postalcode
        const userSchoolName = school_name;
        const userCompanyName = company_name;
        const userAddress = address;
        const userPostalCode = postalcode;

        console.log("User School Name:", school_name);
        console.log("User Company Name:", company_name);
        console.log("User Address:", userAddress);
        console.log("User Postal Code:", userPostalCode);

        // Check if user already exists
        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            firstname,
            lastname,
            school_name,
            role,
            company_name,
            address,
            postalcode
        });

        const savedUser = await newUser.save();
        console.log(savedUser);

        return NextResponse.json({ message: "User signed up successfully", user: savedUser });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
