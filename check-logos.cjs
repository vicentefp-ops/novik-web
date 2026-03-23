const fs = require('fs');
const path = require('path');
const dir = 'public/logos';
const files = fs.readdirSync(dir);
for (const file of files) {
  const filePath = path.join(dir, file);
  const buffer = Buffer.alloc(4);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buffer, 0, 4, 0);
  fs.closeSync(fd);
  const hex = buffer.toString('hex');
  let type = 'unknown';
  if (hex.startsWith('89504e47')) type = 'png';
  else if (hex.startsWith('ffd8ff')) type = 'jpg';
  else if (hex.startsWith('3c3f786d') || hex.startsWith('3c737667') || hex.startsWith('0a3c3f78') || hex.startsWith('0a0a3c73') || hex.startsWith('0a3c7376')) type = 'svg';
  else type = hex;
  
  const ext = path.extname(file).toLowerCase().substring(1);
  if (type !== ext && !(type === 'jpg' && ext === 'jpeg') && !(type === 'svg' && ext === 'svg')) {
    console.log(file, 'is actually', type, 'but has extension', ext);
  }
}
