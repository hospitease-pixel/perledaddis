import * as Supabase from '@supabase/supabase-js'

const supabaseUrl = 'https://lvefapdwqfoulazqjosz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2ZWZhcGR3cWZvdWxhenFqb3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4ODAwNjAsImV4cCI6MjA5NjQ1NjA2MH0.9sDwESA-wbBsqlsyLThlJLm2H87XB9Nv-tJZS2ceQsk';

export const supabase = Supabase.createClient(supabaseUrl, supabaseAnonKey)
