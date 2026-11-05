// Approved System Data
const INITIAL_DATA = {
    "adminPin":  "1234",
    "pinsSecuredV2":  true,
    "dataVersion":  "2026.10.08_v4.0",
    "registeredMembers":  [
                              {
                                  "name":  "خالد العزب",
                                  "payoutMethod":  "bank",
                                  "code":  "101",
                                  "pin":  "2109",
                                  "phone":  "0564802112",
                                  "bankName":  "",
                                  "iban":  ""
                              },
                              {
                                  "phone":  "0545300272",
                                  "bankName":  "",
                                  "code":  "102",
                                  "name":  "سيد فضل",
                                  "payoutMethod":  "bank",
                                  "iban":  "",
                                  "pin":  "1098"
                              },
                              {
                                  "bankName":  "",
                                  "iban":  "",
                                  "payoutMethod":  "bank",
                                  "phone":  "0539572816",
                                  "code":  "103",
                                  "pin":  "0987",
                                  "name":  "مصعب القادري"
                              },
                              {
                                  "phone":  "0565035337",
                                  "name":  "عبدالله العزب",
                                  "bankName":  "",
                                  "code":  "104",
                                  "pin":  "3210",
                                  "payoutMethod":  "bank",
                                  "iban":  ""
                              },
                              {
                                  "iban":  "",
                                  "pin":  "6789",
                                  "bankName":  "",
                                  "code":  "105",
                                  "payoutMethod":  "bank",
                                  "name":  "داليا الأشرم",
                                  "phone":  "01005957046"
                              },
                              {
                                  "bankName":  "",
                                  "payoutMethod":  "bank",
                                  "phone":  "0533405244",
                                  "code":  "106",
                                  "name":  "أحمد العزب",
                                  "pin":  "5432",
                                  "iban":  ""
                              },
                              {
                                  "pin":  "4321",
                                  "iban":  "",
                                  "payoutMethod":  "bank",
                                  "bankName":  "",
                                  "name":  "بابكر شيخ ادريس",
                                  "code":  "107",
                                  "phone":  "0577951989⁩"
                              },
                              {
                                  "iban":  "SA9205000068205092041000",
                                  "bankName":  "مصرف الإنماء",
                                  "pin":  "2109",
                                  "code":  "108",
                                  "name":  "حافظ اسماعيل",
                                  "payoutMethod":  "bank",
                                  "phone":  "0555634915"
                              },
                              {
                                  "pin":  "9876",
                                  "iban":  "",
                                  "phone":  "0545933077",
                                  "payoutMethod":  "bank",
                                  "bankName":  "",
                                  "name":  "محمود عبد الشافي",
                                  "code":  "109"
                              },
                              {
                                  "code":  "110",
                                  "bankName":  "",
                                  "name":  "عبدالمنعم الغموم",
                                  "pin":  "0987",
                                  "iban":  "",
                                  "phone":  "0533665356",
                                  "payoutMethod":  "bank"
                              },
                              {
                                  "bankName":  "",
                                  "payoutMethod":  "bank",
                                  "iban":  "",
                                  "phone":  "0559807055",
                                  "pin":  "7890",
                                  "name":  "أمير العتيبي",
                                  "code":  "111"
                              },
                              {
                                  "payoutMethod":  "bank",
                                  "bankName":  "الراجحي",
                                  "iban":  "SA8780000201608016132224",
                                  "pin":  "6543",
                                  "name":  "عمر عفيفي",
                                  "phone":  "0530802481",
                                  "code":  "112"
                              },
                              {
                                  "iban":  "SA4180000550608010895450",
                                  "payoutMethod":  "bank",
                                  "code":  "113",
                                  "bankName":  "الراجحي",
                                  "pin":  "8765",
                                  "phone":  "0551556659",
                                  "name":  "غازي المنجف"
                              },
                              {
                                  "iban":  "",
                                  "pin":  "1098",
                                  "code":  "114",
                                  "bankName":  "",
                                  "name":  "مؤيد سمير",
                                  "payoutMethod":  "bank",
                                  "phone":  "0569985489"
                              },
                              {
                                  "iban":  "",
                                  "pin":  "4321",
                                  "code":  "115",
                                  "name":  "محمد عبداللطيف",
                                  "payoutMethod":  "bank",
                                  "phone":  "0551488619",
                                  "bankName":  ""
                              },
                              {
                                  "iban":  "",
                                  "phone":  "0595904643",
                                  "payoutMethod":  "bank",
                                  "pin":  "5337",
                                  "bankName":  "",
                                  "name":  "محمد مصباح",
                                  "code":  "116"
                              },
                              {
                                  "iban":  "",
                                  "pin":  "3210",
                                  "bankName":  "",
                                  "payoutMethod":  "bank",
                                  "name":  "محمود عبدالشافي",
                                  "code":  "117",
                                  "phone":  "0545933077"
                              },
                              {
                                  "iban":  "",
                                  "bankName":  "",
                                  "payoutMethod":  "bank",
                                  "pin":  "7654",
                                  "name":  "منير مبارك",
                                  "phone":  "0550826734",
                                  "code":  "118"
                              },
                              {
                                  "iban":  "",
                                  "phone":  "0599057741",
                                  "bankName":  "",
                                  "pin":  "9876",
                                  "code":  "119",
                                  "name":  "يوسف الحاوي",
                                  "payoutMethod":  "bank"
                              }
                          ],
    "managerInfo":  {
                        "phone":  "",
                        "email":  "medogamal750@gmail.com",
                        "displayName":  "محمد العزب"
                    },
    "gam3eyat":  [
                     {
                         "id":  "gam1",
                         "shareAmount":  2000,
                         "totalPayout":  24000,
                         "months":  [
                                        {
                                            "name":  "يناير 2026",
                                            "key":  "jan"
                                        },
                                        {
                                            "key":  "feb",
                                            "name":  "فبراير 2026"
                                        },
                                        {
                                            "key":  "mar",
                                            "name":  "مارس 2026"
                                        },
                                        {
                                            "key":  "apr",
                                            "name":  "أبريل 2026"
                                        },
                                        {
                                            "key":  "may",
                                            "name":  "مايو 2026"
                                        },
                                        {
                                            "key":  "jun",
                                            "name":  "يونيو 2026"
                                        },
                                        {
                                            "name":  "يوليو 2026",
                                            "key":  "jul"
                                        },
                                        {
                                            "name":  "أغسطس 2026",
                                            "key":  "aug"
                                        },
                                        {
                                            "key":  "sep",
                                            "name":  "سبتمبر 2026"
                                        },
                                        {
                                            "key":  "oct",
                                            "name":  "أكتوبر 2026"
                                        },
                                        {
                                            "name":  "نوفمبر 2026",
                                            "key":  "nov"
                                        },
                                        {
                                            "name":  "ديسمبر 2026",
                                            "key":  "dec"
                                        }
                                    ],
                         "currentMonthKey":  "nov",
                         "title":  "بيان جمعية رقم 1 بداية من يناير 2026 الى ديسمبر 2026",
                         "name":  "الجمعية الأولى (يناير - ديسمبر 2026)",
                         "members":  [
                                         {
                                             "codes":  "5678",
                                             "payments":  {
                                                              "jun":  "paid",
                                                              "jul":  "paid",
                                                              "nov":  "unpaid",
                                                              "may":  "paid",
                                                              "oct":  "paid",
                                                              "feb":  "paid",
                                                              "aug":  "paid",
                                                              "mar":  "paid",
                                                              "dec":  "future",
                                                              "jan":  "payout",
                                                              "sep":  "paid",
                                                              "apr":  "paid"
                                                          },
                                             "bankNames":  "الأهلي",
                                             "pins":  "5678",
                                             "payoutMethods":  "bank",
                                             "turn":  1,
                                             "phones":  "0598699077",
                                             "names":  "محمد العزب",
                                             "payoutDate":  "يناير 2026",
                                             "turnMonth":  "jan",
                                             "ibans":  "SA9710000000400000612601",
                                             "isShared":  false,
                                             "id":  "m1",
                                             "shares":  2000
                                         },
                                         {
                                             "ibans":  "",
                                             "pins":  "6789",
                                             "payoutDate":  "فبراير 2026",
                                             "isShared":  false,
                                             "shares":  2000,
                                             "bankNames":  "",
                                             "turn":  2,
                                             "codes":  "6789",
                                             "payoutMethods":  "bank",
                                             "payments":  {
                                                              "oct":  "paid",
                                                              "feb":  "payout",
                                                              "aug":  "paid",
                                                              "jan":  "unpaid",
                                                              "sep":  "paid",
                                                              "dec":  "future",
                                                              "mar":  "paid",
                                                              "apr":  "paid",
                                                              "jun":  "paid",
                                                              "jul":  "paid",
                                                              "nov":  "unpaid",
                                                              "may":  "paid"
                                                          },
                                             "turnMonth":  "feb",
                                             "id":  "m2",
                                             "phones":  "01005957046",
                                             "names":  "داليا الأشرم"
                                         },
                                         {
                                             "names":  [
                                                           "أمير العتيبي",
                                                           "أحمد العزب"
                                                       ],
                                             "id":  "m3",
                                             "codes":  [
                                                           "7890",
                                                           "5432"
                                                       ],
                                             "turnMonth":  "mar",
                                             "shares":  [
                                                            1000,
                                                            1000
                                                        ],
                                             "payments":  {
                                                              "dec":  [
                                                                          "future",
                                                                          "future"
                                                                      ],
                                                              "mar":  [
                                                                          "payout",
                                                                          "payout"
                                                                      ],
                                                              "jan":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "sep":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "apr":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "oct":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "feb":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "aug":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "nov":  [
                                                                          "unpaid",
                                                                          "unpaid"
                                                                      ],
                                                              "may":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "jun":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "jul":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ]
                                                          },
                                             "payoutDate":  "مارس 2026",
                                             "pins":  [
                                                          "7890",
                                                          "5432"
                                                      ],
                                             "bankNames":  [
                                                               "",
                                                               ""
                                                           ],
                                             "phones":  [
                                                            "0559807055",
                                                            "0533405244"
                                                        ],
                                             "payoutMethods":  [
                                                                   "bank",
                                                                   "bank"
                                                               ],
                                             "ibans":  [
                                                           "",
                                                           ""
                                                       ],
                                             "turn":  3,
                                             "isShared":  true
                                         },
                                         {
                                             "pins":  "4321",
                                             "shares":  2000,
                                             "codes":  "4321",
                                             "isShared":  false,
                                             "payoutDate":  "أبريل 2026",
                                             "names":  "محمد عبداللطيف",
                                             "turn":  4,
                                             "turnMonth":  "apr",
                                             "ibans":  "",
                                             "phones":  "0551488619",
                                             "payments":  {
                                                              "jan":  "paid",
                                                              "sep":  "paid",
                                                              "dec":  "future",
                                                              "mar":  "paid",
                                                              "apr":  "payout",
                                                              "oct":  "paid",
                                                              "feb":  "paid",
                                                              "aug":  "paid",
                                                              "nov":  "unpaid",
                                                              "may":  "paid",
                                                              "jun":  "paid",
                                                              "jul":  "paid"
                                                          },
                                             "payoutMethods":  "bank",
                                             "id":  "m4",
                                             "bankNames":  ""
                                         },
                                         {
                                             "payoutDate":  "مايو 2026",
                                             "payoutMethods":  "bank",
                                             "phones":  "0565035337",
                                             "payments":  {
                                                              "oct":  "paid",
                                                              "aug":  "paid",
                                                              "feb":  "paid",
                                                              "dec":  "future",
                                                              "mar":  "paid",
                                                              "sep":  "paid",
                                                              "jan":  "paid",
                                                              "apr":  "paid",
                                                              "jun":  "paid",
                                                              "jul":  "paid",
                                                              "nov":  "unpaid",
                                                              "may":  "payout"
                                                          },
                                             "pins":  "3210",
                                             "names":  "عبدالله العزب",
                                             "turn":  5,
                                             "codes":  "3210",
                                             "turnMonth":  "may",
                                             "id":  "m5",
                                             "isShared":  false,
                                             "shares":  2000,
                                             "ibans":  "",
                                             "bankNames":  ""
                                         },
                                         {
                                             "id":  "m6",
                                             "shares":  2000,
                                             "payments":  {
                                                              "sep":  "paid",
                                                              "jan":  "paid",
                                                              "dec":  "future",
                                                              "mar":  "paid",
                                                              "apr":  "paid",
                                                              "oct":  "paid",
                                                              "aug":  "paid",
                                                              "feb":  "paid",
                                                              "nov":  "unpaid",
                                                              "may":  "paid",
                                                              "jun":  "payout",
                                                              "jul":  "paid"
                                                          },
                                             "ibans":  "",
                                             "bankNames":  "",
                                             "phones":  "0564802112",
                                             "pins":  "2109",
                                             "payoutMethods":  "bank",
                                             "names":  "خالد العزب",
                                             "isShared":  false,
                                             "codes":  "2109",
                                             "turnMonth":  "jun",
                                             "payoutDate":  "يونيو 2026",
                                             "turn":  6
                                         },
                                         {
                                             "codes":  "1098",
                                             "phones":  "0545300272",
                                             "payoutMethods":  "bank",
                                             "isShared":  false,
                                             "id":  "m7",
                                             "names":  "سيد فضل",
                                             "bankNames":  "",
                                             "ibans":  "",
                                             "shares":  2000,
                                             "pins":  "1098",
                                             "turn":  7,
                                             "payments":  {
                                                              "may":  "paid",
                                                              "nov":  "unpaid",
                                                              "jul":  "payout",
                                                              "jun":  "paid",
                                                              "apr":  "paid",
                                                              "dec":  "future",
                                                              "mar":  "paid",
                                                              "sep":  "paid",
                                                              "jan":  "paid",
                                                              "aug":  "paid",
                                                              "feb":  "paid",
                                                              "oct":  "paid"
                                                          },
                                             "payoutDate":  "يوليو 2026",
                                             "turnMonth":  "jul"
                                         },
                                         {
                                             "names":  "مصعب القادري",
                                             "shares":  2000,
                                             "isShared":  false,
                                             "codes":  "0987",
                                             "id":  "m8",
                                             "turnMonth":  "aug",
                                             "turn":  8,
                                             "payoutDate":  "أغسطس 2026",
                                             "phones":  "0539572816",
                                             "payoutMethods":  "bank",
                                             "bankNames":  "",
                                             "pins":  "0987",
                                             "ibans":  "",
                                             "payments":  {
                                                              "jul":  "paid",
                                                              "jun":  "paid",
                                                              "may":  "paid",
                                                              "nov":  "unpaid",
                                                              "feb":  "paid",
                                                              "aug":  "payout",
                                                              "oct":  "paid",
                                                              "apr":  "paid",
                                                              "jan":  "paid",
                                                              "sep":  "paid",
                                                              "mar":  "paid",
                                                              "dec":  "future"
                                                          }
                                         },
                                         {
                                             "bankNames":  [
                                                               "الأهلي",
                                                               ""
                                                           ],
                                             "shares":  [
                                                            1000,
                                                            1000
                                                        ],
                                             "turn":  9,
                                             "payments":  {
                                                              "mar":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "dec":  [
                                                                          "future",
                                                                          "future"
                                                                      ],
                                                              "jan":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "sep":  [
                                                                          "payout",
                                                                          "payout"
                                                                      ],
                                                              "apr":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "oct":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "aug":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "feb":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "nov":  [
                                                                          "unpaid",
                                                                          "unpaid"
                                                                      ],
                                                              "may":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "jun":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "jul":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ]
                                                          },
                                             "ibans":  [
                                                           "SA9710000000400000612601",
                                                           ""
                                                       ],
                                             "id":  "m9",
                                             "payoutDate":  "سبتمبر 2026",
                                             "pins":  [
                                                          "5678",
                                                          "9876"
                                                      ],
                                             "turnMonth":  "sep",
                                             "codes":  [
                                                           "5678",
                                                           "9876"
                                                       ],
                                             "isShared":  true,
                                             "phones":  [
                                                            "0598699077",
                                                            "0545933077"
                                                        ],
                                             "names":  [
                                                           "محمد العزب",
                                                           "محمود عبد الشافي"
                                                       ],
                                             "payoutMethods":  [
                                                                   "bank",
                                                                   "bank"
                                                               ]
                                         },
                                         {
                                             "phones":  "0551556659",
                                             "names":  "غازي المنجف",
                                             "codes":  "8765",
                                             "payments":  {
                                                              "jan":  "paid",
                                                              "sep":  "paid",
                                                              "dec":  "future",
                                                              "mar":  "paid",
                                                              "apr":  "paid",
                                                              "oct":  "payout",
                                                              "feb":  "paid",
                                                              "aug":  "paid",
                                                              "nov":  "unpaid",
                                                              "may":  "paid",
                                                              "jun":  "paid",
                                                              "jul":  "paid"
                                                          },
                                             "bankNames":  "الراجحي",
                                             "id":  "m10",
                                             "pins":  "8765",
                                             "shares":  2000,
                                             "ibans":  "SA4180000550608010895450",
                                             "payoutDate":  "أكتوبر 2026",
                                             "payoutMethods":  "bank",
                                             "isShared":  false,
                                             "turn":  10,
                                             "turnMonth":  "oct"
                                         },
                                         {
                                             "bankNames":  "الراجحي",
                                             "payoutDate":  "نوفمبر 2026",
                                             "codes":  "6543",
                                             "payments":  {
                                                              "jun":  "paid",
                                                              "jul":  "paid",
                                                              "nov":  "payout",
                                                              "may":  "paid",
                                                              "oct":  "paid",
                                                              "feb":  "paid",
                                                              "aug":  "paid",
                                                              "jan":  "paid",
                                                              "sep":  "paid",
                                                              "dec":  "future",
                                                              "mar":  "paid",
                                                              "apr":  "paid"
                                                          },
                                             "payoutMethods":  "bank",
                                             "names":  "عمر عفيفي",
                                             "phones":  "0530802481",
                                             "id":  "m12",
                                             "turnMonth":  "nov",
                                             "ibans":  "SA8780000201608016132224",
                                             "pins":  "6543",
                                             "isShared":  false,
                                             "shares":  2000,
                                             "turn":  11
                                         },
                                         {
                                             "payments":  {
                                                              "oct":  "paid",
                                                              "feb":  "paid",
                                                              "aug":  "paid",
                                                              "mar":  "paid",
                                                              "dec":  "payout",
                                                              "jan":  "paid",
                                                              "sep":  "paid",
                                                              "apr":  "paid",
                                                              "jun":  "paid",
                                                              "jul":  "paid",
                                                              "nov":  "unpaid",
                                                              "may":  "paid"
                                                          },
                                             "bankNames":  "",
                                             "shares":  2000,
                                             "turn":  12,
                                             "codes":  "7654",
                                             "payoutDate":  "ديسمبر 2026",
                                             "pins":  "7654",
                                             "names":  "منير مبارك",
                                             "id":  "m11",
                                             "payoutMethods":  "bank",
                                             "turnMonth":  "dec",
                                             "isShared":  false,
                                             "ibans":  "",
                                             "phones":  "0550826734"
                                         }
                                     ]
                     },
                     {
                         "name":  "الجمعية الثانية (يونيو 2026 - يناير 2027)",
                         "title":  "بيان جمعية رقم 2 بداية من يونيو 2026 الى يناير 2027",
                         "months":  [
                                        {
                                            "key":  "jun",
                                            "name":  "يونيو 2026"
                                        },
                                        {
                                            "key":  "jul",
                                            "name":  "يوليو 2026"
                                        },
                                        {
                                            "name":  "أغسطس 2026",
                                            "key":  "aug"
                                        },
                                        {
                                            "key":  "sep",
                                            "name":  "سبتمبر 2026"
                                        },
                                        {
                                            "name":  "أكتوبر 2026",
                                            "key":  "oct"
                                        },
                                        {
                                            "name":  "نوفمبر 2026",
                                            "key":  "nov"
                                        },
                                        {
                                            "key":  "dec",
                                            "name":  "ديسمبر 2026"
                                        },
                                        {
                                            "name":  "يناير 2027",
                                            "key":  "jan_2027"
                                        }
                                    ],
                         "totalPayout":  16000,
                         "shareAmount":  2000,
                         "id":  "gam2",
                         "currentMonthKey":  "nov",
                         "members":  [
                                         {
                                             "isShared":  false,
                                             "turnMonth":  "jun",
                                             "ibans":  "",
                                             "phones":  "0595904643",
                                             "payoutDate":  "يونيو 2026",
                                             "payoutMethods":  "bank",
                                             "payments":  {
                                                              "jan_2027":  "future",
                                                              "sep":  "paid",
                                                              "nov":  "unpaid",
                                                              "dec":  "future",
                                                              "jun":  "payout",
                                                              "oct":  "paid",
                                                              "aug":  "paid",
                                                              "jul":  "paid"
                                                          },
                                             "pins":  "5337",
                                             "bankNames":  "",
                                             "names":  "محمد مصباح",
                                             "codes":  "5337",
                                             "turn":  1,
                                             "id":  "g2_m1",
                                             "shares":  2000
                                         },
                                         {
                                             "shares":  2000,
                                             "isShared":  false,
                                             "id":  "g2_m2",
                                             "turnMonth":  "jul",
                                             "ibans":  "",
                                             "payoutDate":  "يوليو 2026",
                                             "phones":  "0545300272",
                                             "payments":  {
                                                              "jan_2027":  "future",
                                                              "sep":  "paid",
                                                              "nov":  "unpaid",
                                                              "dec":  "future",
                                                              "jun":  "paid",
                                                              "oct":  "paid",
                                                              "jul":  "payout",
                                                              "aug":  "paid"
                                                          },
                                             "names":  "سيد فضل",
                                             "pins":  "1098",
                                             "codes":  "1098",
                                             "bankNames":  "",
                                             "turn":  2,
                                             "payoutMethods":  "bank"
                                         },
                                         {
                                             "phones":  "0577951989⁩",
                                             "pins":  "4321",
                                             "names":  "بابكر شيخ ادريس",
                                             "id":  "g2_m3",
                                             "codes":  "4321",
                                             "turn":  3,
                                             "payments":  {
                                                              "sep":  "paid",
                                                              "jan_2027":  "future",
                                                              "nov":  "unpaid",
                                                              "dec":  "future",
                                                              "jun":  "paid",
                                                              "oct":  "paid",
                                                              "jul":  "paid",
                                                              "aug":  "payout"
                                                          },
                                             "turnMonth":  "aug",
                                             "payoutDate":  "أغسطس 2026",
                                             "shares":  2000,
                                             "ibans":  "",
                                             "isShared":  false,
                                             "bankNames":  "",
                                             "payoutMethods":  "bank"
                                         },
                                         {
                                             "payments":  {
                                                              "aug":  "paid",
                                                              "jul":  "paid",
                                                              "oct":  "paid",
                                                              "jun":  "paid",
                                                              "sep":  "payout",
                                                              "dec":  "future",
                                                              "nov":  "unpaid",
                                                              "jan_2027":  "future"
                                                          },
                                             "payoutMethods":  "bank",
                                             "bankNames":  "الأهلي",
                                             "phones":  "0598699077",
                                             "ibans":  "SA9710000000400000612601",
                                             "turn":  4,
                                             "isShared":  false,
                                             "names":  "محمد العزب",
                                             "payoutDate":  "سبتمبر 2026",
                                             "turnMonth":  "sep",
                                             "id":  "g2_m4",
                                             "pins":  "5678",
                                             "codes":  "5678",
                                             "shares":  2000
                                         },
                                         {
                                             "id":  "g2_m5",
                                             "pins":  "9876",
                                             "shares":  2000,
                                             "payments":  {
                                                              "sep":  "paid",
                                                              "jan_2027":  "future",
                                                              "nov":  "unpaid",
                                                              "dec":  "future",
                                                              "jun":  "paid",
                                                              "oct":  "payout",
                                                              "aug":  "paid",
                                                              "jul":  "paid"
                                                          },
                                             "isVacant":  false,
                                             "ibans":  "",
                                             "turn":  5,
                                             "bankNames":  "",
                                             "phones":  "0545933077",
                                             "names":  "محمود عبد الشافي",
                                             "payoutMethods":  "bank",
                                             "isShared":  false,
                                             "codes":  "3210",
                                             "payoutDate":  "أكتوبر 2026",
                                             "turnMonth":  "oct"
                                         },
                                         {
                                             "names":  "حافظ اسماعيل",
                                             "payoutMethods":  "bank",
                                             "payments":  {
                                                              "jan_2027":  "future",
                                                              "dec":  "future",
                                                              "nov":  "payout",
                                                              "sep":  "paid",
                                                              "aug":  "paid",
                                                              "jul":  "paid",
                                                              "oct":  "paid",
                                                              "jun":  "unpaid"
                                                          },
                                             "phones":  "0555634915",
                                             "codes":  "2109",
                                             "turnMonth":  "nov",
                                             "payoutDate":  "نوفمبر 2026",
                                             "pins":  "2109",
                                             "id":  "g2_m6",
                                             "isShared":  false,
                                             "bankNames":  "مصرف الإنماء",
                                             "ibans":  "SA9205000068205092041000",
                                             "shares":  2000,
                                             "turn":  6
                                         },
                                         {
                                             "pins":  [
                                                          "1098",
                                                          "0987"
                                                      ],
                                             "codes":  [
                                                           "1098",
                                                           "0987"
                                                       ],
                                             "phones":  [
                                                            "0569985489",
                                                            "0533665356"
                                                        ],
                                             "bankNames":  [
                                                               "",
                                                               ""
                                                           ],
                                             "payoutMethods":  [
                                                                   "bank",
                                                                   "bank"
                                                               ],
                                             "payoutDate":  "ديسمبر 2026",
                                             "id":  "g2_m7",
                                             "payments":  {
                                                              "jan_2027":  [
                                                                               "future",
                                                                               "future"
                                                                           ],
                                                              "oct":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "jun":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "jul":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "aug":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "sep":  [
                                                                          "paid",
                                                                          "paid"
                                                                      ],
                                                              "dec":  [
                                                                          "payout",
                                                                          "payout"
                                                                      ],
                                                              "nov":  [
                                                                          "unpaid",
                                                                          "unpaid"
                                                                      ]
                                                          },
                                             "names":  [
                                                           "مؤيد سمير",
                                                           "عبدالمنعم الغموم"
                                                       ],
                                             "turn":  7,
                                             "shares":  [
                                                            1000,
                                                            1000
                                                        ],
                                             "ibans":  [
                                                           "",
                                                           ""
                                                       ],
                                             "turnMonth":  "dec",
                                             "isShared":  true
                                         },
                                         {
                                             "turn":  8,
                                             "codes":  "9876",
                                             "phones":  "0599057741",
                                             "turnMonth":  "jan_2027",
                                             "isShared":  false,
                                             "names":  "يوسف الحاوي",
                                             "pins":  "9876",
                                             "id":  "g2_m8",
                                             "shares":  2000,
                                             "ibans":  "",
                                             "payoutMethods":  "bank",
                                             "payments":  {
                                                              "sep":  "paid",
                                                              "dec":  "future",
                                                              "nov":  "unpaid",
                                                              "jun":  "paid",
                                                              "oct":  "paid",
                                                              "jul":  "paid",
                                                              "aug":  "paid",
                                                              "jan_2027":  "payout"
                                                          },
                                             "bankNames":  "",
                                             "payoutDate":  "يناير 2027"
                                         }
                                     ]
                     }
                 ],
    "publishedUrl":  "https://gam3eyaty.netlify.app",
    "lastUpdated":  "2026-11-01T07:12:17.599Z",
    "currency":  "ر.س"
};
