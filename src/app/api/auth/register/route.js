import bcrypt from "bcryptjs";
import { prisma } from "@/libs/prisma";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Parse the JSON request body
    const { name, email, password, adminCode } = await request.json();

    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Default role is CUSTOMER. If the provided adminCode matches the one in .env, assign ADMIN role.
    let role = "CUSTOMER";
    if (adminCode && adminCode === process.env.ADMIN_CODE) {
      role = "ADMIN";
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, // Either "CUSTOMER" or "ADMIN"
      },
    });

    // Generate a random token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    // Store the token in the database
    await prisma.emailVerificationToken.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });

    // // create a verification URL
    // const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${token}`;

    // // Configure nodemailer
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: Number(process.env.SMTP_PORT),
    //   secure: false,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });

    // // Send the email
    // await transporter.sendMail({
    //   from: process.env.SMTP_FROM,
    //   to: user.email,
    //   subject: "Verify your email address",
    //   html: `
    //     <p>Hello ${user.name},</p>
    //     <p>Please verify your email address by clicking the link below:</p>
    //     <a href="${verificationUrl}">Verify email address</a>
    //   `,
    // });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
