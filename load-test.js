const autocannon = require('autocannon');

async function runLoadTest() {
  console.log("Starting load test on http://localhost:3000/api/client/check...");
  console.log("Simulating 500 concurrent requests...");

  const instance = autocannon({
    url: 'http://localhost:3000/api/client/check',
    connections: 500,
    duration: 10,
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      clientKey: "load-test-client"
    })
  });

  autocannon.track(instance, { renderProgressBar: true });

  instance.on('done', (result) => {
    console.log("\n--- TEST COMPLETE ---");
    console.log(`Total Requests Sent: ${result.requests.total}`);
    console.log(`2xx Responses (ALLOW): ${result.statusCodeStats['200'] || 0}`);
    console.log(`4xx Responses (DENY): ${result.statusCodeStats['429'] || 0}`);
    console.log(`5xx Responses (ERRORS): ${result.statusCodeStats['500'] || result.statusCodeStats['503'] || 0}`);
    
    if (result.statusCodeStats['500'] || result.statusCodeStats['503']) {
      console.log("\nServer experienced errors under load");
    } else {
      console.log("\nServer successfully handled concurrent requests");
    }
  });
}

runLoadTest();
