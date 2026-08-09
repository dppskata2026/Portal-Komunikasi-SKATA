import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

let app;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  app = initializeApp({ credential: cert(sa) });
} else if (fs.existsSync('./firebase-applet-config.json')) {
  const cfg = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
  app = initializeApp({ projectId: cfg.projectId });
}

if (!app) {
  console.log('No app initialized');
  process.exit(1);
}

const db = getFirestore();
async function run() {
  const snapshot = await db.collection('news_articles').get();
  console.log('Found', snapshot.size, 'news articles in Firestore:');
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data().title, '| Date:', doc.data().date);
  });
}
run().catch(console.error);
