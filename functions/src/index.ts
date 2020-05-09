import * as functions from 'firebase-functions'
//import * as API from './api' // これはFirestoreのコンソールから引っ張ってくる情報です

const firestore = require('@google-cloud/firestore')
const client = new firestore.v1.FirestoreAdminClient()

/*const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(API),
  databaseURL: 'hogehogemogemogefugafuga',
})*/

// 日本時間 月曜04:00AM にバックアップ。
exports.backupPubSub = functions.pubsub.schedule('every sunday 15:00').onRun((context) => {
  const databaseName = client.databasePath(process.env.GCP_PROJECT, '(default)')
  const bucket = 'gs://ripple-public.appspot.com'
  return client
    .exportDocuments({
      name: databaseName,
      outputUriPrefix: bucket,
      collectionIds: [],
    })
    .then((responses: any[]) => {
      const response = responses[0]
      console.log(`Operation Name: ${response['name']}`)
      return response
    })
    .catch((err: any) => {
      console.error(err)
      throw new Error('Export operation failed')
    })
})
