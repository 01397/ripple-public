import * as admin from 'firebase-admin'
import * as express from 'express'
const router = express.Router()

/* GET users listing. */
router.get('/', (req, res, next) =>
  (async () => {
    const db = admin.firestore()
    const snapshot = await db.collection('admin-list').where('granted', '==', false).get()
    for (const doc of snapshot.docs) {
      const uid = doc.id
      await admin.auth().setCustomUserClaims(uid, { admin: true })
      db.doc('admin-list/' + uid).update({ granted: true })
    }
    res.json({ success: true })
  })().catch(next)
)

module.exports = router
