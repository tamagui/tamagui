"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
// require('ts-node').register()
var faker_1 = require("@faker-js/faker");
var date_fns_1 = require("date-fns");
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseInstance = (0, supabase_js_1.createClient)("http://localhost:54321", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0");
function createClimbs(supabase, user) {
    return __awaiter(this, void 0, void 0, function () {
        var climbs, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    climbs = Array.from({ length: 10 }).map(function (_, i) {
                        // past date between now and 1 week ago
                        var start = (0, date_fns_1.add)(faker_1.faker.date.between({
                            from: new Date(),
                            to: (0, date_fns_1.add)(new Date(), { weeks: 3 }),
                        }), {
                            hours: faker_1.faker.number.int({ min: 0, max: 4 }),
                            minutes: faker_1.faker.number.int({ min: 0, max: 59 }),
                        });
                        return {
                            created_at: faker_1.faker.date.between({
                                from: (0, date_fns_1.add)(new Date(), { weeks: -1 }),
                                to: new Date(),
                            }).toISOString(),
                            created_by: user === null || user === void 0 ? void 0 : user.id,
                            start: start.toISOString(),
                            duration: (0, date_fns_1.add)(start, {
                                hours: faker_1.faker.number.int({ min: 0, max: 4 }),
                                minutes: faker_1.faker.number.int({ min: 0, max: 59 }),
                            }).toISOString(),
                            type: faker_1.faker.helpers.arrayElement(['boulder', 'lead_rope', 'top_rope']),
                            id: i + 1,
                            name: "".concat(user === null || user === void 0 ? void 0 : user.user_metadata.first_name, " ").concat(faker_1.faker.helpers.arrayElement(['climbs', 'sends', 'projects', 'attempts']), " ").concat(faker_1.faker.helpers.arrayElement(['a', 'the', 'my']), " ").concat(faker_1.faker.helpers.arrayElement(['red', 'blue', 'green', 'yellow', 'purple', 'black']), " ").concat(faker_1.faker.helpers.arrayElement(['route', 'problem', 'boulder'])),
                        };
                    });
                    return [4 /*yield*/, supabase.from('climbs').insert(climbs)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.log(error);
                        return [2 /*return*/];
                    }
                    return [2 /*return*/, data];
            }
        });
    });
}
// const { data, error } = await supabase.from('climbs').insert()
function createBenjamin(supabase) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase.auth.signUp({
                        email: 'benschac@gmail.com',
                        password: 'qwerty',
                        options: {
                            data: {
                                first_name: 'Benjamin',
                                last_name: 'Schachter',
                                username: 'benschac',
                            }
                        }
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.log(error);
                        return [2 /*return*/];
                    }
                    return [2 /*return*/, data];
            }
        });
    });
}
// Notes: This doesn't work, look into it tomorrow
function createUsers(supabase, count) {
    return __awaiter(this, void 0, void 0, function () {
        var users, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users = Array.from({ length: count }).map(function () {
                        return supabase.auth.signUp({
                            email: faker_1.faker.internet.email(),
                            password: faker_1.faker.internet.password(),
                            options: {
                                data: {
                                    first_name: faker_1.faker.person.firstName(),
                                    last_name: faker_1.faker.person.lastName(),
                                    username: faker_1.faker.internet.userName(),
                                    avatar_url: faker_1.faker.image.avatar(),
                                }
                            }
                        });
                    });
                    return [4 /*yield*/, Promise.all(users)];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var benjamin, users, benjaminsClimbs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Running seeds with faker data');
                    return [4 /*yield*/, createBenjamin(supabaseInstance)];
                case 1:
                    benjamin = _a.sent();
                    return [4 /*yield*/, createUsers(supabaseInstance, 10)];
                case 2:
                    users = _a.sent();
                    if (!benjamin) {
                        console.log('no benjamin');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, createClimbs(supabaseInstance, benjamin.user)];
                case 3:
                    benjaminsClimbs = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
console.log('hello');
