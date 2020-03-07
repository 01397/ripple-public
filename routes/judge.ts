const https = require('https')
const admin = require('firebase-admin')
const serviceAccount = require('../secrets/Ripple-Public-1c25c707ebf8.json')
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})
const db = admin.firestore()

const judge = async (msg, io) => {
  const json = JSON.parse(msg)
  console.log(body)
  const { course, lesson, exercise, sourceCode } = json
  const doc = await db
    .collection('course')
    .doc(course)
    .collection('lesson')
    .doc(lesson)
    .collection('exercise')
    .doc(exercise)
    .get()
  if (!doc.exists) {
    io.emit('judge result', JSON.stringify({ status: 'error', body: 'テストケースが存在しません' }))
    return
  }
  try {
    const postResult = await postJudge(doc)
  } catch (err) {
    io.emit('judge result', JSON.stringify({ status: 'error', body: err }))
    return
  }
  if (postResult.statusCode !== 201) {
    io.emit('judge result', JSON.stringify({ status: 'error', body: '判定システムでエラーが発生しました' }))
    return
  }
  io.emit('judge result', JSON.stringify({ status: 'post', body: '判定中' }))
}

function postJudge(doc) {
  return new Promise(resolve => {
    const { language_id, stdin, expected_output } = doc.data()
    const postData = {
      source_code: base64Encode(sourceCode),
      language_id,
      number_of_runs: '1',
      stdin: base64Encode(stdin[0]),
      expected_output: base64Encode(expected_output[0]),
      cpu_time_limit: '2',
      cpu_extra_time: '0.5',
      wall_time_limit: '5',
      memory_limit: '128000',
      stack_limit: '64000',
      max_processes_and_or_threads: '30',
      enable_per_process_and_thread_time_limit: false,
      enable_per_process_and_thread_memory_limit: true,
      max_file_size: '1024',
    }
    const postDataStr = JSON.stringify(postData)
    const options = {
      host: 'api.judge0.com',
      path: '/submissions/?base64_encoded=true&wait=false',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postDataStr),
      },
    }
    const request = https.request(options, response => {
      const statusCode = response.statusCode
      response.setEncoding('utf8')
      response.on('data', chunk => {
        resolve({ statusCode, chunk })
      })
    })
    request.on('error', e => {
      console.log('problem with request: ' + e.message)
    })
    request.write(postDataStr)
    request.end()
  })
}

function getJudge(token) {
  return new Promise(resolve => {
    const options = {
      host: 'api.judge0.com',
      path: `/submissions/${token}?base64_encoded=true&wait=false`,
      method: 'GET',
    }
    let req = https.request(options, res => {
      console.log('STATUS: ' + res.statusCode)
      console.log('HEADERS: ' + JSON.stringify(res.headers))
      const statusCode = res.statusCode
      res.setEncoding('utf8')
      res.on('data', chunk => {
        resolve({ statusCode, chunk })
      })
    })
    req.on('error', e => {
      console.log('problem with request: ' + e.message)
    })
    req.write(postDataStr)
    req.end()
  })
}
function base64Encode(str) {
  return Buffer.from(str).toString('base64')
}

module.exports = router
