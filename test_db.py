from sqlalchemy import create_engine
from sqlalchemy.sql import text

# Database URL
DATABASE_URL = "postgresql://travel_planner_user:dev_password_123@localhost:5432/travel_planner_db"

def test_connection():
    try:
        # Create engine
        engine = create_engine(DATABASE_URL)
        
        # Test connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("[OK] Database connection successful!")
            
            # Test each table
            tables = ['users', 'travel_plans', 'activities']
            for table in tables:
                result = connection.execute(text(f"SELECT COUNT(*) FROM {table}"))
                count = result.scalar()
                print(f"[OK] Table '{table}' exists and has {count} rows")
                
    except Exception as e:
        print("[ERROR]:", str(e))

if __name__ == "__main__":
    test_connection()
