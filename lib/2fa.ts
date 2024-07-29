"use server"

import { createClient } from "./utils/supabase-server";

const supabase = createClient();

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

