import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase URL or Service Role Key in .env.local")
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedAdmin() {
  console.log("Seeding Admin User...")
  
  const email = "admin@abtournaments.local"
  const password = "admintournaments391!"
  
  // 1. Create or get user in Supabase Auth
  const { data: { users }, error: fetchError } = await supabaseAdmin.auth.admin.listUsers()
  
  let adminUser = users?.find(u => u.email === email)

  if (!adminUser) {
    console.log("Creating new auth user...")
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm
    })

    if (createError) {
      console.error("Error creating admin user:", createError)
      return
    }
    
    adminUser = newUser.user
    console.log("Auth user created:", adminUser?.id)
  } else {
    console.log("Auth user already exists:", adminUser.id)
    // Update password just in case
    await supabaseAdmin.auth.admin.updateUserById(adminUser.id, { password })
  }

  // 2. Ensure public.users table exists and insert profile
  console.log("Upserting profile in public.users...")
  
  // Attempt upsert (requires table to exist)
  const { error: profileError } = await supabaseAdmin
    .from('users')
    .upsert({
      id: adminUser?.id,
      name: 'Admin',
      email: email,
      phone: null,
      role: 'admin'
    })

  if (profileError) {
    console.error(`
      Error upserting into public.users. 
      Please ensure you have created the users table in your Supabase SQL editor:
      
      create table if not exists public.users (
        id uuid primary key references auth.users(id) on delete cascade,
        name text not null,
        email text,
        phone text,
        role text not null default 'user',
        created_at timestamp with time zone default timezone('utc'::text, now()) not null
      );
    `)
    console.error("Detailed error:", profileError.message)
  } else {
    console.log("✅ Admin seeding complete!")
  }
}

seedAdmin()
