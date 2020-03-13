"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var https = require("https");
var admin = require("firebase-admin");
// const serviceAccount = require('../secrets/Ripple-Public-1c25c707ebf8.json')
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});
var db = admin.firestore();
var execConfig = {
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
};
var judge = function (msg, io) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, exercise, source_code, language_id, snapshot, result, docs, i, doc, data, stdin, expected_output, postData, jResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = JSON.parse(msg), exercise = _a.exercise, source_code = _a.source_code, language_id = _a.language_id;
                return [4 /*yield*/, db
                        .collection('testcase')
                        .where('exercise', '==', exercise)
                        .get()];
            case 1:
                snapshot = _b.sent();
                if (snapshot.empty) {
                    io.emit('judge', { error: true, done: true, result: [] });
                    return [2 /*return*/];
                }
                result = new Array(snapshot.docs.length);
                io.emit('judge', { error: false, done: false, result: result });
                docs = snapshot.docs;
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < docs.length)) return [3 /*break*/, 5];
                doc = docs[i];
                data = doc.data();
                stdin = base64Encode(data.stdin);
                expected_output = base64Encode(data.expected_output);
                postData = { expected_output: expected_output, stdin: stdin, source_code: source_code, language_id: language_id };
                return [4 /*yield*/, callApi(postData)];
            case 3:
                jResult = _b.sent();
                result[i] = jResult.status.id;
                console.log(jResult);
                io.emit('judge', { error: false, done: false, result: result });
                _b.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                io.emit('judge', { error: false, done: true, result: result });
                return [2 /*return*/];
        }
    });
}); };
var execute = function (msg, io) { return __awaiter(void 0, void 0, void 0, function () {
    var postData;
    return __generator(this, function (_a) {
        postData = JSON.parse(msg);
        callApi(postData)
            .then(function (result) {
            io.emit('execute', result);
        })
            .catch(function (err) {
            io.emit('execute', err);
        });
        return [2 /*return*/];
    });
}); };
// Judge0 呼び出し
// return value: https://api.judge0.com/statuses
function callApi(postData) {
    return __awaiter(this, void 0, void 0, function () {
        var submission, token, max, count, result, data, status_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, postSubmission(postData)];
                case 1:
                    submission = _a.sent();
                    token = JSON.parse(submission).token;
                    max = 20;
                    count = 0;
                    _a.label = 2;
                case 2:
                    if (!(count < max)) return [3 /*break*/, 6];
                    return [4 /*yield*/, getSubmission(token)];
                case 3:
                    result = _a.sent();
                    data = JSON.parse(result.chunk);
                    status_1 = data.status.id;
                    if (status_1 >= 3) {
                        return [2 /*return*/, data];
                    }
                    return [4 /*yield*/, sleep(500)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    count++;
                    return [3 /*break*/, 2];
                case 6: throw Error('too long time');
            }
        });
    });
}
function postSubmission(postData) {
    return new Promise(function (resolve, reject) {
        var postDataStr = JSON.stringify(__assign(__assign({}, execConfig), postData));
        var options = {
            host: 'api.judge0.com',
            path: '/submissions/?base64_encoded=true&wait=false',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postDataStr),
            },
        };
        var req = https.request(options, function (response) {
            var statusCode = response.statusCode;
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                if (statusCode !== 201) {
                    console.log(chunk);
                    reject('status code ' + statusCode);
                    return;
                }
                resolve(chunk);
            });
        });
        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            reject('request error');
        });
        req.write(postDataStr);
        req.end();
    });
}
function getSubmission(token) {
    return new Promise(function (resolve, reject) {
        var options = {
            host: 'api.judge0.com',
            path: "/submissions/" + token + "?base64_encoded=true&wait=false",
            method: 'GET',
        };
        var req = https.request(options, function (res) {
            var statusCode = res.statusCode;
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                if (statusCode !== 200) {
                    console.log(chunk);
                    reject('status code ' + statusCode);
                    return;
                }
                resolve({ statusCode: statusCode, chunk: chunk });
            });
        });
        req.on('error', function (err) {
            console.log('problem with request: ' + err.message);
            reject('request error');
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
module.exports = { judge: judge, execute: execute };
