
const fs = require('fs');
const path = require('path');

// .env 파일 로드
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const templatePath = path.resolve(process.cwd(), 'public', 'firebase-messaging-sw.template.js');
const outputPath = path.resolve(process.cwd(), 'public', 'firebase-messaging-sw.js');

fs.readFile(templatePath, 'utf8', (err, data) => {
  if (err) {
    return console.error('Error reading template file:', err);
  }

  const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
  if (!apiKey) {
    return console.error('REACT_APP_FIREBASE_API_KEY not found in .env file');
  }

  const result = data.replace(/__FIREBASE_API_KEY__/g, apiKey);

  fs.writeFile(outputPath, result, 'utf8', (err) => {
    if (err) {
      return console.error('Error writing output file:', err);
    }
    console.log('Successfully generated firebase-messaging-sw.js');
  });
});
