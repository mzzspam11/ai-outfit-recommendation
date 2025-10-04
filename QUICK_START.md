# Quick Start Guide - Fashion AI

## Immediate Next Steps

### 1. Set Up the Database (REQUIRED)

Your app won't work until you apply the database migration:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" in the sidebar
4. Open the file `supabase/migrations/20250104_create_profiles.sql`
5. Copy ALL the SQL code
6. Paste it into the SQL Editor
7. Click "Run" button
8. You should see "Success. No rows returned"

### 2. Test Your Application

After setting up the database:

1. Open your application
2. Click "Sign Up" in the top right
3. Create a test account:
   - Name: Your Name
   - Email: test@example.com
   - Password: test123
4. You should be automatically logged in
5. Click on your profile icon (top right)
6. Try "Edit Profile" to update your information

### 3. Verify Everything Works

Test these features:
- [ ] Sign up with a new account
- [ ] Sign out
- [ ] Sign in with your account
- [ ] View your profile
- [ ] Edit your profile (name, avatar, preferences)
- [ ] Take the style quiz
- [ ] View recommendations

## What's New

### Top Navigation Bar
- **When NOT logged in**: "Sign In" and "Sign Up" buttons appear in top right
- **When logged in**: Your profile picture/icon with dropdown menu

### User Profile Menu
Click on your profile icon to see:
- My Profile - View your profile page
- Edit Profile - Update your information
- Sign Out - Log out of your account

### Edit Profile Page
Update:
- Profile picture (paste any image URL)
- Your name
- Style preferences:
  - Gender
  - Style type
  - Color preferences
  - Fit preferences
  - Occasion types
  - Comfort level

## Common Issues

### "Error loading profile"
- Make sure you've applied the database migration
- Check that your .env file has correct Supabase credentials

### "Cannot sign up"
- Verify the database migration was successful
- Check browser console for error messages
- Make sure email authentication is enabled in Supabase

### Profile picture not showing
- Make sure you're using a valid image URL
- The URL should start with http:// or https://
- Try using a Pexels image URL for testing

## Example Profile Picture URLs

For testing, you can use these:
```
https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg
https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg
https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg
```

## Need Help?

1. Check DATABASE_SETUP.md for detailed setup instructions
2. Check PROJECT_SUMMARY.md for complete feature overview
3. Look at browser console for error messages
4. Verify Supabase dashboard shows the profiles table

## File Structure Quick Reference

```
Important files you might need to modify:

src/components/
  - Login.tsx          # Sign in page
  - Signup.tsx         # Sign up page
  - EditProfile.tsx    # Edit profile page
  - Profile.tsx        # View profile page
  - Navbar.tsx         # Top navigation with auth

src/contexts/
  - AuthContext.tsx    # Authentication logic

.env                   # Supabase credentials
DATABASE_SETUP.md      # Database setup instructions
```

## Your Supabase Credentials

Located in `.env`:
```
VITE_SUPABASE_URL=https://aceoaunvplvkgdsbhsur.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

## Ready to Deploy?

Once everything works locally:
1. Make sure all changes are committed to GitHub
2. Your database migration should be applied in production
3. Environment variables should be set in your hosting platform
4. Build the project: `npm run build`
5. Deploy the `dist` folder
