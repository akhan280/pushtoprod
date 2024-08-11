import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/utils/supabase-server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const supabase = createClient();

  try {
    const body = await req.json();
    const { phone, code } = body;

    const { data, error } = await supabase.auth.verifyOtp({ phone: phone, token: code, type: 'sms' });

    if (!data.user?.id || error) {
      console.error('[Submit OTP] An error occurred:', error, phone, code, data);
      return NextResponse.json({ error: 'Incorrect code' }, { status: 500 });
    }

    console.log('[API AUTH] Creating User in Prisma')
    const response = await prisma?.user.upsert({
      update: {},
      create: {
        id: data.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        paid: false,
      },
      where: {
        id: data.user.id
      },
    })

    return NextResponse.json({ response: "Successfully verified OTP"}, { status: 200 });

  } catch (err) {
    console.error('[Submit OTP] An unexpected error occurred:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
