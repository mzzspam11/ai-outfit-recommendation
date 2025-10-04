# Database Setup Instructions

## Setting Up Supabase Database

Your Fashion AI application requires a Supabase database for authentication and user profiles. Follow these steps to set it up:

### Step 1: Apply the Migration

You need to apply the database migration to create the `profiles` table and set up Row Level Security policies.

The migration file is located at: `supabase/migrations/20250104_create_profiles.sql`

To apply it, you have two options:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase/migrations/20250104_create_profiles.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the migration

#### Option B: If you have Supabase CLI access
```bash
# This would be the command, but currently the database connection needs to be configured
supabase db push
```

### Step 2: Verify the Setup

After applying the migration, verify that:
1. The `profiles` table exists in your database
2. Row Level Security is enabled
3. The policies are created correctly

You can check this in the Supabase Dashboard:
- Go to Table Editor → profiles (to see the table)
- Go to Authentication → Policies (to see the RLS policies)

### What the Migration Creates

The migration creates:

1. **profiles table** with columns:
   - id (linked to auth.users)
   - email, name, avatar_url
   - member_since
   - Style preferences: gender, style, colors, fit, occasions, comfort_level
   - Timestamps: created_at, updated_at

2. **Row Level Security policies** that ensure:
   - Users can only read their own profile
   - Users can only update their own profile
   - Users can insert their own profile during signup

3. **Automatic timestamp updates** via trigger function

### Authentication Setup

Your Supabase project already has authentication enabled. The app uses:
- Email/password authentication
- Automatic profile creation on signup
- Session management

### Environment Variables

Make sure your `.env` file has the correct Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Testing the Application

After setting up the database:

1. Start the development server (if not already running)
2. Click "Sign Up" in the top right corner
3. Create a new account
4. You should be able to:
   - View your profile
   - Edit your profile information
   - Update style preferences
   - Upload a profile picture URL
   - Sign out and sign in again

## Troubleshooting

If you encounter issues:

1. **"There was an issue when interacting with the database"**
   - Make sure the migration has been applied
   - Check that your Supabase credentials are correct
   - Verify the database connection in Supabase dashboard

2. **Cannot sign up or sign in**
   - Check that email authentication is enabled in Supabase
   - Verify the profiles table exists
   - Check browser console for detailed error messages

3. **Profile not loading**
   - Verify the RLS policies are correctly set up
   - Check that the user ID matches between auth.users and profiles table
