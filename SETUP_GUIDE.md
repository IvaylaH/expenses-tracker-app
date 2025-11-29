# Expense Tracker Application - Setup Guide

## Overview
This is a modern Expense Tracker application built with Vite, React, Material UI, and Supabase. It allows users to track their expenses with image uploads, categorization, and real-time updates.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory with your Supabase credentials:

```
VITE_SUPABASE_URL=https://xlrvicgogkzfuutpziyb.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Create Supabase Storage Bucket
1. Go to your Supabase project dashboard
2. Navigate to Storage
3. Create a new bucket named "expense-images"
4. Make it public

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Schema

### Users Table
- `id` (BIGSERIAL PRIMARY KEY)
- `firstName` (VARCHAR(20) NOT NULL)
- `lastName` (VARCHAR(20) NOT NULL)
- `user_id` (VARCHAR(25) NOT NULL UNIQUE)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### Expenses Table
- `id` (BIGSERIAL PRIMARY KEY)
- `user_id` (VARCHAR(25) NOT NULL) - Foreign Key to users.user_id
- `image_url` (VARCHAR(5000)) - Optional
- `merchant` (VARCHAR(1000) NOT NULL)
- `purchase_date` (TIMESTAMP NOT NULL)
- `amount` (DECIMAL(10, 2) NOT NULL)
- `currency` (VARCHAR(50) NOT NULL)
- `category` (VARCHAR(50) NOT NULL)
- `status` (VARCHAR(2000) NOT NULL)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

## Features

### User Identification
- Enter First Name, Last Name, and ID
- Automatic user creation on first login
- Persistent user identification

### Expense Management
- Add new expenses with merchant, date, amount, currency, category, and status
- Upload receipt images (JPG, JPEG, PNG, WEBP, GIF)
- View all expenses in a sortable table
- Real-time updates when new expenses are added

### Statistics Dashboard
- Total expenses amount
- Breakdown by category
- Breakdown by status
- Visual cards with gradient backgrounds

### User Interface
- Modern, clean design with calming color palette
- Material UI components
- Responsive layout
- Real-time data refresh
- Manual refresh button

## Color Palette
- Primary Blue: #6B9BD1 (Soft Blue)
- Secondary Green: #8FBC8F (Dark Sea Green)
- Background: #F5F7FA (Light Grayish-Blue)
- Text Primary: #2C3E50 (Dark Blue-Gray)
- Text Secondary: #7F8C8D (Medium Gray)

## Project Structure
```
src/
├── components/
│   ├── UserIdentification.jsx    # User login component
│   ├── ExpenseForm.jsx           # Add expense form
│   └── ExpenseHistory.jsx        # Expenses table and statistics
├── services/
│   └── expenseService.js         # Supabase API calls
├── lib/
│   └── supabaseClient.js         # Supabase client initialization
├── theme/
│   └── theme.js                  # Material UI theme configuration
├── App.jsx                       # Main application component
└── main.jsx                      # Application entry point
```

## Available Scripts

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## Best Practices Implemented

1. **Component Architecture**: Modular, reusable components
2. **Service Layer**: Centralized API calls in `expenseService.js`
3. **Error Handling**: Comprehensive try-catch blocks and user feedback
4. **Real-time Updates**: Supabase subscriptions for live data
5. **Form Validation**: Client-side validation before submission
6. **File Upload**: Image type and size validation
7. **Responsive Design**: Mobile-friendly layout
8. **Clean Code**: Well-organized, documented code

## Troubleshooting

### Storage Bucket Not Found
- Ensure the "expense-images" bucket is created in Supabase
- Make sure the bucket is set to public

### Images Not Uploading
- Check file size (max 5MB)
- Verify file type (JPG, JPEG, PNG, WEBP, GIF)
- Check Supabase storage permissions

### Real-time Updates Not Working
- Verify Supabase project has real-time enabled
- Check browser console for errors
- Ensure user_id is correctly passed to components

## Support
For issues or questions, check the Supabase documentation or React Material UI documentation.

