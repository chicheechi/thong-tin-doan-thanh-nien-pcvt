import fetch from 'node-fetch';

async function run() {
  const res = await fetch('https://script.google.com/macros/s/AKfycbx8C0oZc4ZL1Xx-ed6l5XL0PaU20iXHGmO_C0ZMrvKx8Wkav2yFPp1IfwcWDI16YepR/exec?action=getHistory');
  const data = await res.json();
  console.log(JSON.stringify(data.slice(-10), null, 2));
}
run();
