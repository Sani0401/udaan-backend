import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://buexbqpyivpwkmiovfpw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZXhicXB5aXZwd2ttaW92ZnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMDcyNzcsImV4cCI6MjA1MDU4MzI3N30.Kya-UJ0gKALNYmNdhfBk3NJDrBXNMkEmYHRmzUr5l-Y')


export default supabase;