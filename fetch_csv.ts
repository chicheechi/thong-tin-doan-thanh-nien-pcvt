import fs from 'fs';

async function fetchCSV() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/1Qui6AL8gnfS9WWFDGr2LFpOvpUwBCsr4e8j0Z-xiETc/export?format=csv&gid=1727689083');
  const text = await res.text();
  console.log(text.slice(0, 500));
}

fetchCSV().catch(console.error);
