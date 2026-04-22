import fetch from 'node-fetch';

async function run() {
  const fileId = "1bZIAOeFhC7CjKmCQIigQ7EpGv2d7IE4F"; 
  const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(driveUrl)}`;
  console.log("Fetching from", proxyUrl);
  
  const res = await fetch(proxyUrl);
  console.log(res.status, res.headers.get('content-type'));
  if (res.ok) {
     const buffer = await res.buffer();
     console.log("Bytes downloaded:", buffer.length);
  } else {
     console.log("Failed")
  }
}
run();
