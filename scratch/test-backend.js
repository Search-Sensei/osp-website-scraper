async function testBackend() {
  const url = "https://sensei-agents.australiaeast.cloudapp.azure.com/agilent/chat/group";
  const payload = {
    message: "hello",
    session_id: "id_test_session_group"
  };
  
  console.log(`Sending test request to: ${url}`);
  console.log(`Payload: ${JSON.stringify(payload, null, 2)}`);
  
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json"
      }
    });
    
    console.log(`Response status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`Response body:\n${text}`);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testBackend();
