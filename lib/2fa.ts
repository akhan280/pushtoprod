"use server"
import { createClient } from '@supabase/supabase-js'


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function sendOTP(phone: string) {

  try {
    console.log(`Attempting to send OTP to ${phone}`);
    
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phone,
    })

    if (error) {
      console.error('Error sending OTP:', error);
      throw(error);
    } else {
      console.log('OTP sent successfully:', data);
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
    throw(err);
  }
}

export async function verifyOTP(otp: string, phone: string) {

  try {
    console.log(`Verifying OTP for ${phone}`);

    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone,
      type: 'sms',
      token: otp,
    });

    if (error) {
      console.error("Error verifying OTP:", error);
      return false;
    } else {
      console.log("OTP verified successfully:", data);
      return true;
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return false;
  }
}

