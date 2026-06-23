async function getOpenApi() {
  const url = "https://sensei-agents.australiaeast.cloudapp.azure.com/agilent/openapi.json";
  try {
    const res = await fetch(url);
    const schema = await res.json();
    
    console.log("\nDetails for /chat/group:");
    console.log(JSON.stringify(schema.paths["/chat/group"], null, 2));
    
    console.log("\nDetails for /chat/private:");
    console.log(JSON.stringify(schema.paths["/chat/private"], null, 2));
  } catch (err) {
    console.error("Failed:", err);
  }
}

getOpenApi();
