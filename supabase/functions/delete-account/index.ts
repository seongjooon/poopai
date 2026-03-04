// @ts-nocheck
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  // Get the user's JWT from the request
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse(401, { error: 'Missing authorization header' });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Create a client with the user's JWT to get their ID
  const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: userError } = await userClient.auth.getUser();

  if (userError || !user) {
    return jsonResponse(401, { error: 'Invalid or expired token' });
  }

  // Use service role client to delete user data and account
  const adminClient = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // 1. Delete user's poop logs
    const { error: logsError } = await adminClient
      .from('poop_logs')
      .delete()
      .eq('user_id', user.id);

    if (logsError) {
      console.error('[delete-account] Failed to delete logs:', logsError);
    }

    // 2. Delete the auth user
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('[delete-account] Failed to delete user:', deleteError);
      return jsonResponse(500, { error: 'Failed to delete account' });
    }

    return jsonResponse(200, { ok: true, message: 'Account deleted successfully' });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[delete-account] error:', errMsg);
    return jsonResponse(500, { error: 'Failed to delete account', detail: errMsg });
  }
});
