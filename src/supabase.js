import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://caolwvyfkwzpqzdwpwty.supabase.co";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
