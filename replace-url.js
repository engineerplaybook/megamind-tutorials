import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');

const COMMON_NAV_URL = process.env.COMMON_NAV_URL || 'https://megamind-nav.vercel.app';

try {
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    // Replace URL
    content = content.replace(/http:\/\/localhost:5174/g, COMMON_NAV_URL);
    fs.writeFileSync(indexPath, content);
    console.log(`Successfully replaced Nav URL with ${COMMON_NAV_URL}`);
  } else {
    console.warn('dist/index.html not found, skipping replacement.');
  }
} catch (e) {
  console.error('Error replacing URL:', e);
  process.exit(1);
}
