const express = require('express')
const router = express.Router()
const textToSpeech = require('@google-cloud/text-to-speech')
const client = new textToSpeech.TextToSpeechClient()

router.get('/', (req, res, next) => {
  const asyncFunc = async () => {
    const ssml = req.query.ssml
    console.log(req.params)
    const request = {
      input: { ssml: ssml },
      voice: { languageCode: 'ja-JP', name: 'ja-JP-Wavenet-D' },
      audioConfig: { audioEncoding: 'MP3' },
    }

    const [response] = await client.synthesizeSpeech(request)
    res
      .set('Content-Type', 'audio/mpeg')
      .set('Content-Length', response.audioContent.length)
      .send(response.audioContent)
  }
  asyncFunc().catch(next)
})

module.exports = router
