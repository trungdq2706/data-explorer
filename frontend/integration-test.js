/**
 * Quick Frontend-Backend Integration Test
 * Run this in browser console to verify connection
 */

async function testFrontendBackend() {
  const API_BASE = "http://localhost:8000";
  const token = "demo_token_123";

  console.log("🧪 Testing Frontend-Backend Integration...\n");

  try {
    // Test 1: Health Check
    console.log("1️⃣ Testing health check...");
    const health = await fetch(`${API_BASE}/health`).then(r => r.json());
    console.log("✅ Backend is alive:", health);

    // Test 2: Get Datasets
    console.log("\n2️⃣ Testing datasets endpoint...");
    const datasets = await fetch(`${API_BASE}/share/${token}/datasets`).then(r => r.json());
    console.log("✅ Datasets loaded:", datasets);

    // Test 3: Get Fields
    console.log("\n3️⃣ Testing dataset fields endpoint...");
    const fields = await fetch(`${API_BASE}/share/${token}/dataset/orders/fields`).then(r => r.json());
    console.log("✅ Fields loaded:", fields);

    // Test 4: Execute Query
    console.log("\n4️⃣ Testing query execution...");
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const query = {
      dataset_id: "orders",
      dimension: "dt",
      measure: "revenue",
      date_from: weekAgo.toISOString().slice(0, 10),
      date_to: today.toISOString().slice(0, 10),
      limit: 500,
      order: "asc"
    };

    const result = await fetch(`${API_BASE}/share/${token}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    }).then(r => r.json());

    console.log("✅ Query executed, rows:", result.rows.length);
    console.log("Sample data:", result.rows.slice(0, 3));

    console.log("\n🎉 All tests passed! Frontend-Backend integration working perfectly!\n");

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n💡 Troubleshooting:");
    console.log("1. Make sure backend is running on http://localhost:8000");
    console.log("2. Run: python -m uvicorn app:app --reload");
    console.log("3. Check console for CORS errors");
  }
}

// Run the test
testFrontendBackend();
