// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bykodzpccfujhxighpzi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5a29kenBjY2Z1amh4aWdocHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1OTY2NjcsImV4cCI6MjA1NTE3MjY2N30.mHp-WHEBeGz8KniHZ2NFaiOVzRuoOAqfYonNwo3O8ik";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);