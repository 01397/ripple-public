const https = require('https')
const admin = require('firebase-admin')
const serviceAccount = require('../secrets/Ripple-Public-1c25c707ebf8.json')
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})
const db = admin.firestore()

const judge = async (msg, io) => {
  const json = JSON.parse(msg)
  console.log(msg)
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
    io.emit('judge result', { status: 'error', body: 'テストケースが存在しません' })
    return
  }
  let postResult
  try {
    postResult = await postJudge(doc, sourceCode)
  } catch (err) {
    io.emit('judge result', { status: 'error', body: err })
    return
  }
  if (postResult.statusCode !== 201) {
    io.emit('judge result', { status: 'error', body: '判定システムでエラーが発生しました' })
    return
  }
  io.emit('judge result', { status: 'post', body: { length: 1, result: [0] } })
  console.log(postResult.chunk)
  const token = JSON.parse(postResult.chunk).token
  for (let count = 0; count < 10; count++) {
    await sleep(1000)
    const getResult: any = await getJudge(token)
    const result = JSON.parse(getResult.chunk)
    const status = Number(result.status.id)
    io.emit('judge result', { status: 'get', body: { length: 1, result: [status] } })
    if (status > 2) {
      break
    }
  }
  io.emit('judge result', { status: 'finish' })
}

function postJudge(doc, sourceCode) {
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
    const req = https.request(options, res => {
      console.log('STATUS: ' + res.statusCode)
      console.log('HEADERS: ' + JSON.stringify(res.headers))
      const statusCode = res.statusCode
      res.setEncoding('utf8')
      res.on('data', chunk => {
        resolve({ statusCode, chunk })
      })
    })
    req.on('error', err => {
      console.log('problem with request: ' + err.message)
    })
    req.end()
  })
}
function base64Encode(str) {
  return Buffer.from(str).toString('base64')
}
function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

module.exports = judge
