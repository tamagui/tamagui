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
var faker_1 = require("@faker-js/faker");
var date_fns_1 = require("date-fns");
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseInstance = (0, supabase_js_1.createClient)("http://localhost:54321", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU");
function createClimbs(supabase, users, admin) {
    return __awaiter(this, void 0, void 0, function () {
        var usersClimbs, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Create 10 climbs from faker data with the Shape of Tables['climbs'] and Enums['climb_type']
                    // created at should be now to 1 week ago
                    // created by should be the user id from the auth response
                    // start should be in the future, a time between now and 3 weeks from now
                    // duration should be between 20 minutes and 5 hours after start
                    // type should be one of the climb types enum
                    // id should be an auto incrementing integer starting at 1
                    // name should be a random string of 10-25 characters with the user's first name in it and fake verb
                    // the start time should be between 7am and 10pm, and the duration should be between 20 minutes and 5 hours, but the climb cannot end after 10pm
                    if (!admin) {
                        throw new Error('no admin');
                    }
                    usersClimbs = users.map(function (user) {
                        var _a;
                        var climbs = Array.from({ length: 4 }).map(function (_, i) {
                            var _a, _b, _c;
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
                                created_by: (_a = user === null || user === void 0 ? void 0 : user.data.user) === null || _a === void 0 ? void 0 : _a.id,
                                start: start.toISOString(),
                                duration: (0, date_fns_1.add)(start, {
                                    hours: faker_1.faker.number.int({ min: 0, max: 4 }),
                                    minutes: faker_1.faker.number.int({ min: 0, max: 59 }),
                                }).toISOString(),
                                type: faker_1.faker.helpers.arrayElement(['boulder', 'lead_rope', 'top_rope']),
                                name: "".concat((_c = (_b = user === null || user === void 0 ? void 0 : user.data) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.user_metadata.first_name, " ").concat(faker_1.faker.helpers.arrayElement(['climbs', 'sends', 'projects', 'attempts']), " ").concat(faker_1.faker.helpers.arrayElement(['a', 'the', 'my']), " ").concat(faker_1.faker.helpers.arrayElement(['red', 'blue', 'green', 'yellow', 'purple', 'black']), " ").concat(faker_1.faker.helpers.arrayElement(['route', 'problem', 'boulder'])),
                            };
                        });
                        // make sure admin has a climb from every user
                        climbs.push({
                            created_at: faker_1.faker.date.between({
                                from: (0, date_fns_1.add)(new Date(), { weeks: -1 }),
                                to: new Date(),
                            }).toISOString(),
                            created_by: admin === null || admin === void 0 ? void 0 : admin.id,
                            start: (0, date_fns_1.add)(new Date(), { days: -1 }).toISOString(),
                            duration: (0, date_fns_1.add)(new Date(), { days: -1, hours: 1 }).toISOString(),
                            type: faker_1.faker.helpers.arrayElement(['boulder', 'lead_rope', 'top_rope']),
                            name: "".concat((_a = user === null || user === void 0 ? void 0 : user.data.user) === null || _a === void 0 ? void 0 : _a.user_metadata.first_name, " ").concat(faker_1.faker.helpers.arrayElement(['climbs', 'sends', 'projects', 'attempts']), " ").concat(faker_1.faker.helpers.arrayElement(['a', 'the', 'my']), " ").concat(faker_1.faker.helpers.arrayElement(['red', 'blue', 'green', 'yellow', 'purple', 'black']), " ").concat(faker_1.faker.helpers.arrayElement(['route', 'problem', 'boulder'])),
                        });
                        return climbs;
                    }).flatMap(function (climbs) { return climbs; });
                    return [4 /*yield*/, supabase.from('climbs').insert(usersClimbs)];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        console.log(error);
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
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
                                email_confirm: true,
                                bio: 'I have no friends to climb with so I made this app',
                                avatar_url: 'https://avatars.githubusercontent.com/u/2502947?u=eb345767686e9b8692c6d76955650a41e6e80cf3&v=4'
                            },
                        }
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.log(error);
                        return [2 /*return*/];
                    }
                    console.log(data);
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
                                    bio: faker_1.faker.person.bio()
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
function createProfileClimbs(supabase, climbs, profiles, admin) {
    return __awaiter(this, void 0, void 0, function () {
        var profileClimbs, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Create a single profile climb for every climb for every profile
                    // Every other profile should have 2 profile climbs for every climb
                    // The profile climbs should be created in the last 2 weeks and 2 weeks in the future
                    // The first profile climb should be created by the user who created the climb
                    // The second profile climb should be created by a random user
                    if (!admin) {
                        throw new Error('no admin');
                    }
                    profileClimbs = climbs.map(function (climb) {
                        var result = [];
                        var created_at = faker_1.faker.date.between({
                            from: (0, date_fns_1.add)(new Date(), { weeks: -2 }),
                            to: (0, date_fns_1.add)(new Date(), { weeks: 2 }),
                        }).toISOString();
                        // first profile climb, the user who created the climb
                        result.push({
                            created_at: created_at,
                            profile_id: climb.created_by,
                            climb_id: climb.id,
                        });
                        // second profile climb, a random user
                        // every other climb should have 2 profile climbs
                        if (climb.id % 3 === 0) {
                            result.push({
                                created_at: created_at,
                                profile_id: admin.id,
                                climb_id: climb.id,
                            });
                        }
                        else if (climb.id % 2 === 0) {
                            result.push({
                                created_at: created_at,
                                profile_id: faker_1.faker.helpers.arrayElement(profiles).id,
                                climb_id: climb.id,
                            });
                        }
                        return result;
                    }).flatMap(function (climbs) { return climbs; });
                    return [4 /*yield*/, supabase.from('profile_climbs').insert(profileClimbs)];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        console.log(error);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var benjamin, users, climbs, profiles;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('Running seeds with faker data');
                    return [4 /*yield*/, createBenjamin(supabaseInstance)];
                case 1:
                    benjamin = _c.sent();
                    return [4 /*yield*/, createUsers(supabaseInstance, 10)];
                case 2:
                    users = _c.sent();
                    if (!benjamin) {
                        console.log('no benjamin');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, createClimbs(supabaseInstance, users, benjamin.user)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, supabaseInstance.from('climbs').select('*')];
                case 4:
                    climbs = _c.sent();
                    return [4 /*yield*/, supabaseInstance.from('profiles').select('*')];
                case 5:
                    profiles = _c.sent();
                    return [4 /*yield*/, createProfileClimbs(supabaseInstance, (_a = climbs === null || climbs === void 0 ? void 0 : climbs.data) !== null && _a !== void 0 ? _a : [], (_b = profiles.data) !== null && _b !== void 0 ? _b : [], benjamin.user)];
                case 6:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
console.log('hello');
