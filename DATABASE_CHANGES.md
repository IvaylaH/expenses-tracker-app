# Database Changes - User Identification (Manual User Creation)

## Summary
Modified the application to use manual user creation in the database. Users are pre-created by administrators, and the UserIdentification component only **identifies** existing users by verifying their credentials (firstName, lastName, and userId).

## Changes Made

### 1. Database Function (Kept for Reference)
The PostgreSQL function `generate_user_id()` remains in the database for manual user creation:

```sql
CREATE OR REPLACE FUNCTION generate_user_id() RETURNS VARCHAR AS $$
DECLARE
  chars VARCHAR := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result VARCHAR := '';
  i INT;
BEGIN
  FOR i IN 1..5 LOOP
    result := result || substr(chars, floor(random() * 36) + 1, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

### 2. Frontend Changes

#### UserIdentification Component (`src/components/UserIdentification.jsx`)
- **Restored**: All three input fields (firstName, lastName, userId)
- **Updated**: Form requires all three fields
- **Updated**: handleIdentify function to pass all three parameters to getOrCreateUser
- **Purpose**: Identifies existing users only (does NOT create new users)

#### ExpenseService (`src/services/expenseService.js`)
- **Updated**: `getOrCreateUser()` function now **verifies** user exists instead of creating
- **Updated**: Function signature takes `firstName`, `lastName`, and `userId`
- **Updated**: Queries database to find user matching all three criteria
- **Updated**: Returns user if found, throws error if not found
- **Error Handling**: Shows user-friendly message "User not found. Please check your credentials and try again."

## How It Works

1. **Admin creates users** in Supabase database with:
   - firstName (e.g., "John")
   - lastName (e.g., "Doe")
   - user_id (e.g., "A1B2C" - 5-character alphanumeric)

2. **User identifies themselves** by entering:
   - First Name
   - Last Name
   - User ID

3. **Application verifies** the user exists in database with matching credentials

4. **If verified**: User is logged in and can:
   - Add new expenses
   - View their expense history
   - See statistics

5. **If not verified**: Error message displayed, user must re-enter credentials

## Benefits

✅ **Admin Control** - Only pre-created users can access the system
✅ **Security** - Prevents unauthorized user creation
✅ **Simplified Identification** - Users just enter their credentials
✅ **Consistent Format** - All user_ids are exactly 5 characters (letters and numbers)
✅ **Data Integrity** - No duplicate or invalid user entries

## User ID Format

- **Length**: 5 characters
- **Characters**: A-Z (uppercase) and 0-9 (digits)
- **Examples**: A1B2C, XYZ99, 12345, ABCDE
- **Total Possible Combinations**: 36^5 = 60,466,176

## How to Create Users

Users must be manually created in the Supabase database. You can:

### Option 1: Using Supabase Dashboard
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Run this query to create a user:
```sql
INSERT INTO users (firstName, lastName, user_id)
VALUES ('John', 'Doe', 'A1B2C');
```

### Option 2: Using generate_user_id() Function
```sql
INSERT INTO users (firstName, lastName, user_id)
VALUES ('Jane', 'Smith', generate_user_id());
```

### Option 3: Bulk Insert
```sql
INSERT INTO users (firstName, lastName, user_id) VALUES
('John', 'Doe', 'A1B2C'),
('Jane', 'Smith', 'X9Y8Z'),
('Bob', 'Johnson', 'M5N6O');
```

## Testing

To test the changes:

1. **Create a test user** in Supabase:
   ```sql
   INSERT INTO users (firstName, lastName, user_id)
   VALUES ('Test', 'User', 'TEST1');
   ```

2. **Start the application**: `npm run dev`

3. **Identify yourself** by entering:
   - First Name: `Test`
   - Last Name: `User`
   - User ID: `TEST1`

4. **Click Continue** - You should be logged in

5. **Add expenses** and verify they appear in the history

6. **Try invalid credentials** - Should show error message

## Files Modified

1. `src/components/UserIdentification.jsx` - Restored ID field, updated form logic
2. `src/services/expenseService.js` - Changed to verify user instead of create
3. Database - generate_user_id() function remains for manual user creation

## Status

✅ **Complete** - All changes implemented and tested

