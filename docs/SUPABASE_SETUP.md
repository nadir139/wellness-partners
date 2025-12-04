# Supabase Setup Guide - Step by Step

## Step 1: Get Your Database URL

1. **Go to your Supabase dashboard:**
   - Navigate to https://supabase.com/dashboard
   - Click on your `wellness-partner` project

2. **Find your database connection string:**
   - On the left sidebar, click **"Project Settings"** (gear icon at bottom)
   - Click **"Database"** in the settings menu
   - Scroll down to **"Connection string"** section
   - You'll see several connection string options

3. **Copy the correct connection string:**
   - Look for **"URI"** or **"Connection string"**
   - It should look like:
     ```
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
   - **IMPORTANT:** If you see `[YOUR-PASSWORD]`, you need to replace it with your actual database password

4. **Find your database password:**
   - If you saved it during project creation, use that
   - If you forgot it:
     - Go to **"Project Settings" → "Database"**
     - Scroll to **"Reset Database Password"**
     - Click **"Generate a new password"** (SAVE IT IMMEDIATELY!)
     - Copy the new password
     - Replace `[YOUR-PASSWORD]` in the connection string with your password

## Step 2: Update Your `.env` File

1. **Open your `.env` file** in the project root:
   ```
   c:\Users\nadir\OneDrive\Desktop\llm-council\.env
   ```

2. **Add this line** (replace with your actual connection string):
   ```env
   # Existing variables
   OPENROUTER_API_KEY=...
   CLERK_SECRET_KEY=...
   STRIPE_SECRET_KEY=...
   STRIPE_WEBHOOK_SECRET=...

   # NEW: Supabase PostgreSQL Database
   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-ACTUAL-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

3. **Example of what it should look like:**
   ```env
   DATABASE_URL=postgresql://postgres.abcdefghijklmnop:MySecurePassword123!@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

## Step 3: Verify Connection (Test Before Creating Tables)

1. **Create a test script** to verify connection:

   Save this as `backend/test_connection.py`:
   ```python
   """Test Supabase connection."""
   import asyncio
   import os
   from dotenv import load_dotenv

   # Load environment variables
   load_dotenv()

   async def test_connection():
       from database import DatabaseManager

       print("🔍 Testing Supabase connection...")
       print(f"📍 DATABASE_URL: {os.getenv('DATABASE_URL')[:50]}...")

       try:
           # Initialize database
           DatabaseManager.initialize()
           print("✅ Database manager initialized")

           # Try to connect
           session = DatabaseManager.get_session()
           print("✅ Session created")

           # Execute a simple query
           from sqlalchemy import text
           result = await session.execute(text("SELECT version();"))
           version = result.scalar()
           print(f"✅ Connected to PostgreSQL!")
           print(f"📊 Version: {version}")

           await session.close()
           await DatabaseManager.close()

           print("\n🎉 Connection successful! Ready to create tables.")

       except Exception as e:
           print(f"\n❌ Connection failed: {e}")
           print("\nCommon issues:")
           print("1. Check if DATABASE_URL is correct in .env")
           print("2. Verify password doesn't contain special characters that need escaping")
           print("3. Make sure you're using the 'Pooler' connection string (port 6543)")
           raise

   if __name__ == "__main__":
       asyncio.run(test_connection())
   ```

2. **Run the test:**
   ```bash
   cd backend
   python test_connection.py
   ```

   **Expected output:**
   ```
   🔍 Testing Supabase connection...
   📍 DATABASE_URL: postgresql://postgres.abcdefghij...
   ✅ Database manager initialized
   ✅ Session created
   ✅ Connected to PostgreSQL!
   📊 Version: PostgreSQL 15.x ...

   🎉 Connection successful! Ready to create tables.
   ```

## Step 4: Create Database Tables

1. **Create table creation script:**

   Save this as `backend/create_tables.py`:
   ```python
   """Create all database tables in Supabase."""
   import asyncio
   from database import DatabaseManager

   async def create_tables():
       print("🔨 Creating database tables...")

       try:
           # Initialize database
           DatabaseManager.initialize()
           print("✅ Database initialized")

           # Create all tables
           await DatabaseManager.create_tables()
           print("✅ Tables created successfully!")

           # List tables to verify
           session = DatabaseManager.get_session()
           from sqlalchemy import text
           result = await session.execute(text("""
               SELECT table_name
               FROM information_schema.tables
               WHERE table_schema = 'public'
               ORDER BY table_name;
           """))
           tables = result.fetchall()

           print("\n📋 Created tables:")
           for table in tables:
               print(f"   - {table[0]}")

           await session.close()
           await DatabaseManager.close()

           print("\n🎉 Database setup complete!")
           print("\nNext steps:")
           print("1. ✅ Database is ready")
           print("2. 🔄 Update main.py to use db_storage")
           print("3. 🧪 Test with backend server")

       except Exception as e:
           print(f"\n❌ Failed to create tables: {e}")
           raise

   if __name__ == "__main__":
       asyncio.run(create_tables())
   ```

2. **Run the script:**
   ```bash
   python create_tables.py
   ```

   **Expected output:**
   ```
   🔨 Creating database tables...
   ✅ Database initialized
   ✅ Tables created successfully!

   📋 Created tables:
      - users
      - subscriptions
      - conversations
      - messages

   🎉 Database setup complete!
   ```

## Step 5: Verify Tables in Supabase Dashboard

1. **Go back to Supabase dashboard**
2. **Click "Table Editor"** on left sidebar
3. **You should see 4 tables:**
   - `users`
   - `subscriptions`
   - `conversations`
   - `messages`

4. **Click on each table** to see the columns match our schema

## Step 6: Test Basic Operations

Create `backend/test_database_ops.py`:
```python
"""Test basic database operations."""
import asyncio
from database import DatabaseManager
from db_storage import *

async def test_operations():
    print("🧪 Testing database operations...\n")

    DatabaseManager.initialize()
    session = DatabaseManager.get_session()

    try:
        # Test 1: Create user
        print("1️⃣ Creating test user...")
        user = await create_user_profile(
            "test_user_123",
            {
                "email": "test@example.com",
                "gender": "female",
                "age_range": "25-34",
                "mood": "happy"
            },
            session
        )
        print(f"   ✅ User created: {user['user_id']}")

        # Test 2: Get user
        print("\n2️⃣ Retrieving user...")
        retrieved_user = await get_user_profile("test_user_123", session)
        print(f"   ✅ User retrieved: {retrieved_user['email']}")

        # Test 3: Get subscription (auto-created)
        print("\n3️⃣ Checking subscription...")
        subscription = await get_subscription("test_user_123", session)
        print(f"   ✅ Subscription: {subscription['tier']}")

        # Test 4: Create conversation
        print("\n4️⃣ Creating conversation...")
        conv = await create_conversation("test_user_123", session)
        print(f"   ✅ Conversation: {conv['id']}")
        print(f"   📅 Expires at: {conv.get('expires_at', 'Never')}")

        # Test 5: Add message
        print("\n5️⃣ Adding message...")
        msg = await add_message(
            conv["id"],
            {"role": "user", "content": "Hello, wellness council!"},
            session
        )
        print(f"   ✅ Message added")

        # Test 6: List conversations
        print("\n6️⃣ Listing conversations...")
        conversations = await list_conversations("test_user_123", session)
        print(f"   ✅ Found {len(conversations)} conversation(s)")

        await session.commit()
        print("\n✅ All operations successful!")

        # Cleanup
        print("\n🧹 Cleaning up test data...")
        await delete_conversation(conv["id"], session)
        await session.commit()
        print("   ✅ Cleanup complete")

    except Exception as e:
        await session.rollback()
        print(f"\n❌ Test failed: {e}")
        raise
    finally:
        await session.close()
        await DatabaseManager.close()

    print("\n🎉 Database is working perfectly!")

if __name__ == "__main__":
    asyncio.run(test_operations())
```

**Run it:**
```bash
python test_database_ops.py
```

## Troubleshooting

### Issue: "password authentication failed"
**Solution:**
- Double-check your password in DATABASE_URL
- If password has special characters like `@`, `#`, `$`, URL-encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`

### Issue: "could not connect to server"
**Solution:**
- Make sure you're using the **Pooler** connection string (port 6543)
- Check your internet connection
- Verify Supabase project is active (not paused)

### Issue: "relation does not exist"
**Solution:**
- Run `create_tables.py` again
- Check Table Editor in Supabase dashboard

### Issue: "asyncpg not found"
**Solution:**
```bash
cd backend
uv add asyncpg
```

## Next Steps


---
After successful database setup:
1. ✅ Database connected and tables created
2. 🔄 **Next:** Update `main.py` to use PostgreSQL
3. 🧪 **Then:** Test with frontend
4. 🚀 **Finally:** Deploy to production

**Questions? Check:**
- DATABASE_URL format is correct
- Password doesn't have special characters
- Tables exist in Supabase dashboard
- Test scripts all pass
