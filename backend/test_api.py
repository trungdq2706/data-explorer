"""
Test script to verify backend API is working
Run this to test all endpoints
"""
import sys
import asyncio
import httpx
from datetime import date, timedelta

# Configuration
BASE_URL = "http://localhost:8000"
TEST_TOKEN = "demo_token_123"


async def test_health():
    """Test health check endpoint"""
    print("\n✓ Testing Health Check...")
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE_URL}/health")
        print(f"  Status: {resp.status_code}")
        print(f"  Response: {resp.json()}")
        return resp.status_code == 200


async def test_list_datasets():
    """Test list datasets endpoint"""
    print("\n✓ Testing List Datasets...")
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{BASE_URL}/share/{TEST_TOKEN}/datasets")
        print(f"  Status: {resp.status_code}")
        if resp.status_code == 200:
            datasets = resp.json()
            print(f"  Datasets: {len(datasets)} found")
            for ds in datasets:
                print(f"    - {ds['id']}: {ds['label']}")
            return True
        else:
            print(f"  Error: {resp.text}")
            return False


async def test_get_fields():
    """Test get dataset fields endpoint"""
    print("\n✓ Testing Get Dataset Fields...")
    dataset_id = "orders"
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{BASE_URL}/share/{TEST_TOKEN}/dataset/{dataset_id}/fields"
        )
        print(f"  Status: {resp.status_code}")
        if resp.status_code == 200:
            fields = resp.json()
            print(f"  Dimensions: {fields['dimensions']}")
            print(f"  Measures: {fields['measures']}")
            return True
        else:
            print(f"  Error: {resp.text}")
            return False


async def test_execute_query():
    """Test execute query endpoint"""
    print("\n✓ Testing Execute Query...")
    
    today = date.today()
    week_ago = today - timedelta(days=6)
    
    query_payload = {
        "dataset_id": "orders",
        "dimension": "dt",
        "measure": "revenue",
        "date_from": week_ago.isoformat(),
        "date_to": today.isoformat(),
        "platform": "tiktok",
        "limit": 500,
        "order": "asc"
    }
    
    print(f"  Query: {query_payload}")
    
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{BASE_URL}/share/{TEST_TOKEN}/query",
            json=query_payload
        )
        print(f"  Status: {resp.status_code}")
        if resp.status_code == 200:
            result = resp.json()
            rows = result.get("rows", [])
            print(f"  Rows returned: {len(rows)}")
            if rows:
                print(f"  First 3 rows:")
                for row in rows[:3]:
                    print(f"    {row}")
            return True
        else:
            print(f"  Error: {resp.text}")
            return False


async def test_query_all_combinations():
    """Test query with different dimensions and measures"""
    print("\n✓ Testing Query Combinations...")
    
    today = date.today()
    week_ago = today - timedelta(days=6)
    
    tests = [
        ("orders", "dt", "revenue"),
        ("orders", "dt", "orders"),
        ("orders", "platform", "revenue"),
        ("livestream", "dt", "revenue"),
        ("livestream", "platform", "sessions"),
    ]
    
    async with httpx.AsyncClient() as client:
        for dataset_id, dimension, measure in tests:
            query_payload = {
                "dataset_id": dataset_id,
                "dimension": dimension,
                "measure": measure,
                "date_from": week_ago.isoformat(),
                "date_to": today.isoformat(),
                "limit": 500,
                "order": "asc"
            }
            
            resp = await client.post(
                f"{BASE_URL}/share/{TEST_TOKEN}/query",
                json=query_payload
            )
            
            status = "✓" if resp.status_code == 200 else "✗"
            rows = len(resp.json().get("rows", [])) if resp.status_code == 200 else 0
            print(f"  {status} {dataset_id} / {dimension} × {measure}: {rows} rows")


async def main():
    """Run all tests"""
    print("=" * 60)
    print("🚀 Backend API Test Suite")
    print("=" * 60)
    
    try:
        # Test health first
        if not await test_health():
            print("\n❌ Backend is not running. Start it with:")
            print("   cd backend && python -m uvicorn app:app --reload")
            return
        
        # Run all tests
        await test_list_datasets()
        await test_get_fields()
        await test_execute_query()
        await test_query_all_combinations()
        
        print("\n" + "=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
