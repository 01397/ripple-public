var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var https = require('https');
var admin = require('firebase-admin');
var serviceAccount = require('../secrets/Ripple-Public-1c25c707ebf8.json');
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});
var db = admin.firestore();
var judge = function (msg, io) { return __awaiter(_this, void 0, void 0, function () {
    var json, course, lesson, exercise, sourceCode, doc, postResult, err_1, token, count, getResult, result, status_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                json = JSON.parse(msg);
                console.log(msg);
                course = json.course, lesson = json.lesson, exercise = json.exercise, sourceCode = json.sourceCode;
                return [4 /*yield*/, db
                        .collection('course')
                        .doc(course)
                        .collection('lesson')
                        .doc(lesson)
                        .collection('exercise')
                        .doc(exercise)
                        .get()];
            case 1:
                doc = _a.sent();
                if (!doc.exists) {
                    io.emit('judge result', { status: 'error', body: 'テストケースが存在しません' });
                    return [2 /*return*/];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, postJudge(doc, sourceCode)];
            case 3:
                postResult = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                io.emit('judge result', { status: 'error', body: err_1 });
                return [2 /*return*/];
            case 5:
                if (postResult.statusCode !== 201) {
                    io.emit('judge result', { status: 'error', body: '判定システムでエラーが発生しました' });
                    return [2 /*return*/];
                }
                io.emit('judge result', { status: 'post', body: { length: 1, result: [0] } });
                console.log(postResult.chunk);
                token = JSON.parse(postResult.chunk).token;
                count = 0;
                _a.label = 6;
            case 6:
                if (!(count < 10)) return [3 /*break*/, 10];
                return [4 /*yield*/, sleep(1000)];
            case 7:
                _a.sent();
                return [4 /*yield*/, getJudge(token)];
            case 8:
                getResult = _a.sent();
                result = JSON.parse(getResult.chunk);
                status_1 = Number(result.status.id);
                io.emit('judge result', { status: 'get', body: { length: 1, result: [status_1] } });
                if (status_1 > 2) {
                    return [3 /*break*/, 10];
                }
                _a.label = 9;
            case 9:
                count++;
                return [3 /*break*/, 6];
            case 10:
                io.emit('judge result', { status: 'finish' });
                return [2 /*return*/];
        }
    });
}); };
function postJudge(doc, sourceCode) {
    return new Promise(function (resolve) {
        var _a = doc.data(), language_id = _a.language_id, stdin = _a.stdin, expected_output = _a.expected_output;
        var postData = {
            source_code: base64Encode(sourceCode),
            language_id: language_id,
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
        };
        var postDataStr = JSON.stringify(postData);
        var options = {
            host: 'api.judge0.com',
            path: '/submissions/?base64_encoded=true&wait=false',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postDataStr),
            },
        };
        var request = https.request(options, function (response) {
            var statusCode = response.statusCode;
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                resolve({ statusCode: statusCode, chunk: chunk });
            });
        });
        request.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });
        request.write(postDataStr);
        request.end();
    });
}
function getJudge(token) {
    return new Promise(function (resolve) {
        var options = {
            host: 'api.judge0.com',
            path: "/submissions/" + token + "?base64_encoded=true&wait=false",
            method: 'GET',
        };
        var req = https.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            var statusCode = res.statusCode;
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                resolve({ statusCode: statusCode, chunk: chunk });
            });
        });
        req.on('error', function (err) {
            console.log('problem with request: ' + err.message);
        });
        req.end();
    });
}
function base64Encode(str) {
    return Buffer.from(str).toString('base64');
}
function sleep(time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    });
}
module.exports = judge;
