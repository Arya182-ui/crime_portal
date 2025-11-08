// Quick script to set admin role
const admin = require('firebase-admin');

// Initialize Firebase Admin (use your service account)
const serviceAccount = require('./Backend/serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminRole(email) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    console.log(`Found user: ${user.email} (UID: ${user.uid})`);
    
    // Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, { role: 'ADMIN' });
    console.log(`✅ Successfully set ADMIN role for ${email}`);
    console.log('🔄 User needs to logout and login again to get new token');
    
    // Also update Firestore status to APPROVED
    const db = admin.firestore();
    await db.collection('users').doc(user.uid).set({
      status: 'APPROVED',
      role: 'ADMIN',
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      approvedBy: 'SYSTEM',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Firestore profile updated with APPROVED status');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Set admin role for arya119000@gmail.com
setAdminRole('arya119000@gmail.com');
