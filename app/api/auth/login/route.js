import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import crypto from 'crypto';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const { password } = await request.json();

    let passwordSetting = null;
    try {
      passwordSetting = await prisma.settings.findUnique({
        where: { key: 'admin_password' }
      });
    } catch (e) {
      console.warn("Prisma settings query skipped:", e.message);
    }

    let isValid = false;

    if (passwordSetting && passwordSetting.value) {
      if (hashPassword(password) === passwordSetting.value) {
        isValid = true;
      }
    } else {
      const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
      if (password === adminPass) {
        isValid = true;
      }
    }

    if (isValid) {
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'admin_token',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
      return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
