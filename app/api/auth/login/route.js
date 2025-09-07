import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/user';
import admin from '../../../lib/firebaseAdmin';

export async function POST(req) {
  await dbConnect();
  const { token } = await req.json();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decodedToken;

    let user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { $setOnInsert: { firebaseUid: uid, email, name } },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ success: false, message: 'Authentication failed' }, { status: 401 });
  }
}