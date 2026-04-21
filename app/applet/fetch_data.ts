import fs from 'fs';

async function fetchAndParse() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/1Qui6AL8gnfS9WWFDGr2LFpOvpUwBCsr4e8j0Z-xiETc/export?format=csv&gid=0');
  const text = await res.text();
  
  const lines = text.split('\n').map(l => l.trim());
  // Find header
  let headerIdx = -1;
  for (let i = 0; i < 5; i++) {
    if (lines[i] && (lines[i].toLowerCase().replace(/\s/g, '').includes('phòngban') || lines[i].toLowerCase().replace(/\s/g, '').includes('họvàtên'))) {
      headerIdx = i;
      break;
    }
  }
  
  if (headerIdx === -1) {
    console.error('Header not found');
    console.log(text.slice(0, 500));
    return;
  }
  
  const headers = lines[headerIdx].toLowerCase().replace(/\s/g, '').split(',');
  const msnvIdx = headers.findIndex(h => h.includes('sốhiệu') || h.includes('msnv') || h.includes('mãnhânviên'));
  const nameIdx = headers.findIndex(h => h.includes('họvàtên') || h.includes('họ') && h.includes('tên'));
  const deptIdx = headers.findIndex(h => h.includes('phòngban') || h.includes('đơnvị') || h.includes('tênphòng'));
  
  const actualMsnvIdx = msnvIdx !== -1 ? msnvIdx : 1;
  const actualNameIdx = nameIdx !== -1 ? nameIdx : 2;
  const actualDeptIdx = deptIdx !== -1 ? deptIdx : 5;
  
  const data = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    // Simple CSV split (doesn't handle quotes perfectly, but sufficient for simple data)
    let cols = [];
    let inString = false;
    let current = '';
    for(let char of lines[i]) {
      if(char === '"') inString = !inString;
      else if(char === ',' && !inString) {
        cols.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    cols.push(current);
    
    if (cols[actualMsnvIdx] && cols[actualNameIdx]) {
      data.push({
        id: cols[actualMsnvIdx].trim().replace(/^"|"$/g, ''),
        name: cols[actualNameIdx].trim().replace(/^"|"$/g, ''),
        department: cols[actualDeptIdx] ? cols[actualDeptIdx].trim().replace(/^"|"$/g, '') : 'Khác'
      });
    }
  }
  
  const outputContent = `export const mockStaff = ${JSON.stringify(data, null, 2)};\n\nexport const mockHistory: any[] = [];\n`;
  fs.writeFileSync('src/mockData.ts', outputContent);
  console.log('Successfully updated mockData.ts with ' + data.length + ' records.');
}

fetchAndParse().catch(console.error);
