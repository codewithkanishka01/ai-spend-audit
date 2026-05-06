import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role for backend operations
const resendApiKey = process.env.RESEND_API_KEY || '';

// Initialize clients conditionally (so app doesn't crash if keys are missing in dev)
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, result } = body;

    if (!email || !result) {
      return NextResponse.json({ error: 'Missing email or result data' }, { status: 400 });
    }

    const auditId = uuidv4().split('-')[0]; // Generate short ID for the shareable URL

    // 1. Store in Database (if configured)
    if (supabase) {
      const { error: dbError } = await supabase
        .from('audits')
        .insert([
          { 
            id: auditId, 
            email: email, 
            result_data: result,
            created_at: new Date().toISOString()
          }
        ]);
        
      if (dbError) {
        console.error('Supabase error:', dbError);
        // Continue anyway for the sake of the MVP if table doesn't exist yet
      }
    } else {
      console.warn('Supabase not configured. Skipping DB insert.');
    }

    // 2. Send Transactional Email (if configured)
    if (resend) {
      const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/audit/${auditId}`;
      
      try {
        await resend.emails.send({
          from: 'Credex Audits <onboarding@resend.dev>', // Update with a verified domain later
          to: [email],
          subject: 'Your AI Spend Audit Report',
          html: `
            <h2>Your AI Spend Audit is ready!</h2>
            <p>You have the potential to save <strong>$${result.totalPotentialSavings}/month</strong>.</p>
            <p>View your full, shareable report here: <a href="${shareUrl}">${shareUrl}</a></p>
            <br/>
            <p>Thanks,<br/>The Credex Team</p>
          `,
        });
      } catch (emailError) {
         console.error('Resend error:', emailError);
      }
    } else {
       console.warn('Resend not configured. Skipping email send.');
    }

    // Return the generated ID so the client can navigate/show it
    return NextResponse.json({ success: true, auditId });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
