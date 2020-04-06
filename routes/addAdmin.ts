import * as admin from 'firebase-admin'
import * as express from 'express'
const router = express.Router()

router.get('/:uid', (req, res, next) =>
  (async () => {
    const uid = req.params.uid
    const db = admin.firestore()
    const snapshot = await db.doc('system/admin_users').get()
    if (!snapshot.data().hasOwnProperty(uid)) {
      res.json({ success: false })
    } else {
      await admin.auth().setCustomUserClaims(uid, { admin: true })
      db.doc('system/admin_users').update({ [`${uid}.granted`]: true })
      res.json({ success: true })
    }
  })().catch(next)
)

module.exports = router
