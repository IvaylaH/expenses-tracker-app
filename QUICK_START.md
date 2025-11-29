# Quick Start Guide - Expense Tracker

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Storage Bucket
1. Go to https://supabase.com/dashboard/project/xlrvicgogkzfuutpziyb/storage/buckets
2. Click "New bucket"
3. Name it: `expense-images`
4. Make it public
5. Click "Create bucket"

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open Application
Visit `http://localhost:5173` in your browser

## 📝 How to Use

### 1. Identify Yourself
- Enter your First Name
- Enter your Last Name
- Enter your unique ID
- Click "Continue"

### 2. Add an Expense
- Click "Add Expense" button in the top right
- Fill in the form:
  - **Merchant**: Where you made the purchase
  - **Purchase Date**: When you made the purchase
  - **Amount**: How much you spent
  - **Currency**: Currency type (e.g., USD)
  - **Category**: Type of expense (e.g., Food, Transport)
  - **Status**: Current status (e.g., Pending, Completed)
  - **Comment**: Additional notes (optional)
  - **Image**: Upload receipt image (optional)
- Click "Add Expense"

### 3. View Your Expenses
- See all your expenses in the table
- View statistics at the top:
  - Total expenses
  - Breakdown by category
  - Breakdown by status
- Click "Refresh" to manually refresh data
- Click on "View" to see uploaded images

### 4. Logout
- Click "Logout" button to start over

## 🎨 Features

✅ User identification with automatic account creation
✅ Add expenses with detailed information
✅ Upload receipt images (JPG, PNG, WEBP, GIF)
✅ Real-time data updates
✅ Statistics dashboard
✅ Responsive design
✅ Modern, calming interface

## 📊 Statistics Shown

- **Total Expenses**: Sum of all expenses
- **By Category**: Total spent in each category
- **By Status**: Total expenses by status

## 🖼️ Supported Image Formats

- JPG / JPEG
- PNG
- WEBP
- GIF
- Max size: 5MB

## ⚙️ Environment Variables

The `.env.local` file is already configured with:
- Supabase URL
- Supabase Anonymous Key

No additional setup needed!

## 🐛 Troubleshooting

**Images not uploading?**
- Check that "expense-images" bucket exists in Supabase
- Verify bucket is set to public
- Check file size (max 5MB)
- Check file type (JPG, PNG, WEBP, GIF)

**Data not showing?**
- Refresh the page
- Click the "Refresh" button
- Check browser console for errors

**Can't identify?**
- Make sure all three fields are filled
- Check that your ID is unique

## 📚 Documentation

- See `SETUP_GUIDE.md` for detailed setup instructions
- See `IMPLEMENTATION_SUMMARY.md` for technical details

## 🎯 Next Steps

1. Test the application with sample data
2. Upload some receipt images
3. Check the statistics dashboard
4. Try the real-time updates by opening in multiple tabs

Enjoy tracking your expenses! 💰

