import * as https from 'https'
import * as admin from 'firebase-admin'
// const serviceAccount = require('../secrets/Ripple-Public-1c25c707ebf8.json')
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})
const db = admin.firestore()
const execConfig = {
  number_of_runs: '1',
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

export interface Testcase {
  language_id: number
  stdin: string
  expected_output: string
  index: number
  lesson: string
  exercise: string
}

const judge = async (msg: string, io) => {
  const { exercise, source_code, language_id } = JSON.parse(msg)
  const snapshot = await db
    .collection('testcase')
    .where('exercise', '==', exercise)
    .get()
  if (snapshot.empty) {
    io.emit('judge', { error: true, done: true, result: [] })
    return
  }
  const result: number[] = new Array(snapshot.docs.length)
  io.emit('judge', { error: false, done: false, result })
  const docs = snapshot.docs
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i]
    const data = doc.data()
    const stdin = base64Encode(data.stdin)
    const expected_output = base64Encode(data.expected_output)
    const postData: JudgeConfig = { expected_output, stdin, source_code, language_id }
    const jResult: JudgeResult = await callApi(postData)
    result[i] = jResult.status.id
    console.log(jResult)
    io.emit('judge', { error: false, done: false, result })
  }
  io.emit('judge', { error: false, done: true, result })
}

const execute = async (msg: string, io) => {
  const postData: JudgeConfig = JSON.parse(msg)
  callApi(postData)
    .then(result => {
      io.emit('execute', result)
    })
    .catch(err => {
      io.emit('execute', err)
    })
}

interface JudgeConfig {
  language_id: number
  source_code: string
  stdin?: string
  expected_output?: string
}
export interface JudgeResult {
  stdout?: string
  stderr?: string
  compile_output?: string
  message?: string
  exit_code?: number
  exit_signal?: number
  status?: {
    id: number
    description: string
  }
  created_at?: string
  finished_at?: string
  token?: string
  time?: string
  wall_time?: string
  memory?: number
}

// Judge0 呼び出し
// return value: https://api.judge0.com/statuses
async function callApi(postData: JudgeConfig) {
  const submission = await postSubmission(postData)
  const token = JSON.parse(submission).token
  const max = 20
  for (let count = 0; count < max; count++) {
    const result: any = await getSubmission(token)
    const data: JudgeResult = JSON.parse(result.chunk)
    const status = data.status.id
    if (status >= 3) {
      return data
    }
    await sleep(500)
  }
  throw Error('too long time')
}

function postSubmission(postData: JudgeConfig) {
  return new Promise<string>((resolve, reject) => {
    const postDataStr = JSON.stringify({ ...execConfig, ...postData })
    const options = {
      host: 'api.judge0.com',
      path: '/submissions/?base64_encoded=true&wait=false',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postDataStr),
      },
    }
    const req = https.request(options, response => {
      const statusCode = response.statusCode
      response.setEncoding('utf8')
      response.on('data', (chunk: string) => {
        if (statusCode !== 201) {
          console.log(chunk)
          reject('status code ' + statusCode)
          return
        }
        resolve(chunk)
      })
    })
    req.on('error', e => {
      console.log('problem with request: ' + e.message)
      reject('request error')
    })
    req.write(postDataStr)
    req.end()
  })
}
function getSubmission(token: string) {
  return new Promise((resolve, reject) => {
    const options = {
      host: 'api.judge0.com',
      path: `/submissions/${token}?base64_encoded=true&wait=false`,
      method: 'GET',
    }
    const req = https.request(options, res => {
      const statusCode = res.statusCode
      res.setEncoding('utf8')
      res.on('data', chunk => {
        if (statusCode !== 200) {
          console.log(chunk)
          reject('status code ' + statusCode)
          return
        }
        resolve({ statusCode, chunk })
      })
    })
    req.on('error', err => {
      console.log('problem with request: ' + err.message)
      reject('request error')
    })
    req.end()
  })
}

function base64Encode(str: string) {
  return Buffer.from(str).toString('base64')
}

function sleep(time: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

module.exports = { judge, execute }
