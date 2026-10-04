/**
 * البيانات المعتمدة لجمعيات النظام
 * مستخرجة بدقة ومطابقة لملفات الإكسيل وسجلات المشتركين الحقيقية
 */

const INITIAL_DATA = {
  "adminPin": "1234",
  "currency": "ر.س",
  "pinsSecuredV2": true,
  "gam3eyat": [
    {
      "id": "gam1",
      "name": "الجمعية الأولى (يناير - ديسمبر 2026)",
      "title": "بيان جمعية رقم 1 بداية من يناير 2026 الى ديسمبر 2026",
      "shareAmount": 2000,
      "totalPayout": 24000,
      "currentMonthKey": "sep",
      "months": [
        {
          "key": "jan",
          "name": "يناير 2026"
        },
        {
          "key": "feb",
          "name": "فبراير 2026"
        },
        {
          "key": "mar",
          "name": "مارس 2026"
        },
        {
          "key": "apr",
          "name": "أبريل 2026"
        },
        {
          "key": "may",
          "name": "مايو 2026"
        },
        {
          "key": "jun",
          "name": "يونيو 2026"
        },
        {
          "key": "jul",
          "name": "يوليو 2026"
        },
        {
          "key": "aug",
          "name": "أغسطس 2026"
        },
        {
          "key": "sep",
          "name": "سبتمبر 2026"
        },
        {
          "key": "oct",
          "name": "أكتوبر 2026"
        },
        {
          "key": "nov",
          "name": "نوفمبر 2026"
        },
        {
          "key": "dec",
          "name": "ديسمبر 2026"
        }
      ],
      "members": [
        {
          "id": "m1",
          "turn": 1,
          "turnMonth": "jan",
          "payoutDate": "يناير 2026",
          "isShared": false,
          "names": [
            "محمد العزب"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "0598699077"
          ],
          "pins": [
            "5678"
          ],
          "codes": [
            "5678"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            "الأهلي"
          ],
          "ibans": [
            "SA9710000000400000612601"
          ],
          "payments": {
            "jan": [
              "payout"
            ],
            "feb": [
              "paid"
            ],
            "mar": [
              "paid"
            ],
            "apr": [
              "paid"
            ],
            "may": [
              "paid"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "paid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "m2",
          "turn": 2,
          "turnMonth": "feb",
          "payoutDate": "فبراير 2026",
          "isShared": false,
          "names": [
            "دو"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01123456789"
          ],
          "pins": [
            "6789"
          ],
          "codes": [
            "6789"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "jan": [
              "unpaid"
            ],
            "feb": [
              "payout"
            ],
            "mar": [
              "paid"
            ],
            "apr": [
              "paid"
            ],
            "may": [
              "paid"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "paid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "m3",
          "turn": 3,
          "turnMonth": "mar",
          "payoutDate": "مارس 2026",
          "isShared": true,
          "names": [
            "عبودي",
            "أحمد"
          ],
          "shares": [
            1000,
            1000
          ],
          "phones": [
            "01234567890",
            "01098765432"
          ],
          "pins": [
            "7890",
            "5432"
          ],
          "codes": [
            "7890",
            "5432"
          ],
          "payoutMethods": [
            "bank",
            "bank"
          ],
          "bankNames": [
            "",
            ""
          ],
          "ibans": [
            "",
            ""
          ],
          "payments": {
            "jan": [
              "paid",
              "paid"
            ],
            "feb": [
              "paid",
              "paid"
            ],
            "mar": [
              "payout",
              "payout"
            ],
            "apr": [
              "paid",
              "paid"
            ],
            "may": [
              "paid",
              "paid"
            ],
            "jun": [
              "paid",
              "paid"
            ],
            "jul": [
              "paid",
              "paid"
            ],
            "aug": [
              "paid",
              "paid"
            ],
            "sep": [
              "paid",
              "paid"
            ],
            "oct": [
              "unpaid",
              "unpaid"
            ],
            "nov": [
              "future",
              "future"
            ],
            "dec": [
              "future",
              "future"
            ]
          }
        },
        {
          "id": "m4",
          "turn": 4,
          "turnMonth": "apr",
          "payoutDate": "أبريل 2026",
          "isShared": false,
          "names": [
            "محمد عبداللطيف"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01187654321"
          ],
          "pins": [
            "4321"
          ],
          "codes": [
            "4321"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "jan": [
              "paid"
            ],
            "feb": [
              "paid"
            ],
            "mar": [
              "paid"
            ],
            "apr": [
              "payout"
            ],
            "may": [
              "paid"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "paid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "m5",
          "turn": 5,
          "turnMonth": "may",
          "payoutDate": "مايو 2026",
          "isShared": false,
          "names": [
            "عبدالله العزب"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01276543210"
          ],
          "pins": [
            "3210"
          ],
          "codes": [
            "3210"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "jan": [
              "paid"
            ],
            "feb": [
              "paid"
            ],
            "mar": [
              "paid"
            ],
            "apr": [
              "paid"
            ],
            "may": [
              "payout"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "paid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "m6",
          "turn": 6,
          "turnMonth": "jun",
          "payoutDate": "يونيو 2026",
          "isShared": false,
          "names": [
            "خالد العزب"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01065432109"
          ],
          "pins": [
            "2109"
          ],
          "codes": [
            "2109"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "jan": [
              "paid"
            ],
            "feb": [
              "paid"
            ],
            "mar": [
              "paid"
            ],
            "apr": [
              "paid"
            ],
            "may": [
              "paid"
            ],
            "jun": [
              "payout"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "paid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "m7",
          "turn": 7,
          "turnMonth": "jul",
          "payoutDate": "يوليو 2026",
          "isShared": false,
          "names": [
            "سيد فضل"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01154321098"
          ],
          "pins": [
            "1098"
          ],
          "codes": [
            "1098"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "jan": [
              "paid"
            ],
            "feb": [
              "paid"
            ],
            "mar": [
              "paid"
            ],
            "apr": [
              "paid"
            ],
            "may": [
              "paid"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "payout"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "paid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "m8",
          "turn": 8,
          "turnMonth": "aug",
          "payoutDate": "أغسطس 2026",
          "isShared": false,
          "names": [
            "مصعب"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01243210987"
          ],
          "pins": [
            "0987"
          ],
          "codes": [
            "0987"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "jan": [
              "paid"
            ],
            "feb": [
              "paid"
            ],
            "mar": [
              "paid"
            ],
            "apr": [
              "paid"
            ],
            "may": [
              "paid"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "payout"
            ],
            "sep": [
              "paid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "m9",
          "turn": 9,
          "turnMonth": "sep",
          "payoutDate": "سبتمبر 2026",
          "isShared": true,
          "names": [
            "محمد العزب",
            "د محمود"
          ],
          "shares": [
            1000,
            1000
          ],
          "phones": [
            "0598699077",
            "01032109876"
          ],
          "pins": [
            "5678",
            "9876"
          ],
          "codes": [
            "5678",
            "9876"
          ],
          "payoutMethods": [
            "bank",
            "bank"
          ],
          "bankNames": [
            "الأهلي",
            ""
          ],
          "ibans": [
            "SA9710000000400000612601",
            ""
          ],
          "payments": {
            "jan": [
              "unpaid",
              "paid"
            ],
            "feb": [
              "paid",
              "paid"
            ],
            "mar": [
              "paid",
              "paid"
            ],
            "apr": [
              "paid",
              "paid"
            ],
            "may": [
              "paid",
              "paid"
            ],
            "jun": [
              "paid",
              "paid"
            ],
            "jul": [
              "paid",
              "paid"
            ],
            "aug": [
              "paid",
              "paid"
            ],
            "sep": [
              "paid",
              "payout"
            ],
            "oct": [
              "unpaid",
              "unpaid"
            ],
            "nov": [
              "future",
              "future"
            ],
            "dec": [
              "future",
              "future"
            ]
          }
        },
        {
          "id": "m10",
          "turn": 10,
          "turnMonth": "oct",
          "payoutDate": "أكتوبر 2026",
          "isShared": false,
          "names": [
            "غازي المنجف"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01121098765"
          ],
          "pins": [
            "8765"
          ],
          "codes": [
            "8765"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            "الراجحي"
          ],
          "ibans": [
            "SA4180000550608010895450"
          ],
          "payments": {
            "jan": [
              "paid"
            ],
            "feb": [
              "paid"
            ],
            "mar": [
              "paid"
            ],
            "apr": [
              "paid"
            ],
            "may": [
              "paid"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "paid"
            ],
            "oct": [
              "payout"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "m11",
          "turn": 11,
          "turnMonth": "nov",
          "payoutDate": "نوفمبر 2026",
          "isShared": false,
          "names": [
            "منير"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01210987654"
          ],
          "pins": [
            "7654"
          ],
          "codes": [
            "7654"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "jan": [
              "paid"
            ],
            "feb": [
              "paid"
            ],
            "mar": [
              "paid"
            ],
            "apr": [
              "paid"
            ],
            "may": [
              "paid"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "paid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "payout"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "m12",
          "turn": 12,
          "turnMonth": "dec",
          "payoutDate": "ديسمبر 2026",
          "isShared": false,
          "names": [
            "عمر عفيفي"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01009876543"
          ],
          "pins": [
            "6543"
          ],
          "codes": [
            "6543"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "jan": [
              "paid"
            ],
            "feb": [
              "paid"
            ],
            "mar": [
              "paid"
            ],
            "apr": [
              "paid"
            ],
            "may": [
              "paid"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "paid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "payout"
            ]
          }
        }
      ]
    },
    {
      "id": "gam2",
      "name": "الجمعية الثانية (مايو - ديسمبر 2026)",
      "title": "بيان جمعية رقم 2 بداية من مايو 2026 الى ديسمبر 2026",
      "shareAmount": 2000,
      "totalPayout": 16000,
      "currentMonthKey": "sep",
      "months": [
        {
          "key": "may",
          "name": "مايو 2026"
        },
        {
          "key": "jun",
          "name": "يونيو 2026"
        },
        {
          "key": "jul",
          "name": "يوليو 2026"
        },
        {
          "key": "aug",
          "name": "أغسطس 2026"
        },
        {
          "key": "sep",
          "name": "سبتمبر 2026"
        },
        {
          "key": "oct",
          "name": "أكتوبر 2026"
        },
        {
          "key": "nov",
          "name": "نوفمبر 2026"
        },
        {
          "key": "dec",
          "name": "ديسمبر 2026"
        }
      ],
      "members": [
        {
          "id": "g2_m1",
          "turn": 1,
          "turnMonth": "may",
          "payoutDate": "مايو 2026",
          "isShared": false,
          "names": [
            "محمد مصباح"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "0565035337"
          ],
          "pins": [
            "5337"
          ],
          "codes": [
            "5337"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "may": [
              "payout"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "unpaid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "g2_m2",
          "turn": 2,
          "turnMonth": "jun",
          "payoutDate": "يونيو 2026",
          "isShared": false,
          "names": [
            "سيد فضل"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01154321098"
          ],
          "pins": [
            "1098"
          ],
          "codes": [
            "1098"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "may": [
              "paid"
            ],
            "jun": [
              "payout"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "unpaid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "g2_m3",
          "turn": 3,
          "turnMonth": "jul",
          "payoutDate": "يوليو 2026",
          "isShared": false,
          "names": [
            "بابكر"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01287654321"
          ],
          "pins": [
            "4321"
          ],
          "codes": [
            "4321"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "may": [
              "paid"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "payout"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "unpaid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "g2_m4",
          "turn": 4,
          "turnMonth": "aug",
          "payoutDate": "أغسطس 2026",
          "isShared": false,
          "names": [
            "محمد العزب"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "0598699077"
          ],
          "pins": [
            "5678"
          ],
          "codes": [
            "5678"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            "الأهلي"
          ],
          "ibans": [
            "SA9710000000400000612601"
          ],
          "payments": {
            "may": [
              "paid"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "payout"
            ],
            "sep": [
              "unpaid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "g2_m5",
          "turn": 5,
          "turnMonth": "sep",
          "payoutDate": "سبتمبر 2026",
          "isShared": false,
          "names": [
            "محمود عبدالشافي"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01076543210"
          ],
          "pins": [
            "3210"
          ],
          "codes": [
            "3210"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "may": [
              "paid"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "payout"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "g2_m6",
          "turn": 6,
          "turnMonth": "oct",
          "payoutDate": "أكتوبر 2026",
          "isShared": false,
          "names": [
            "حافظ"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01165432109"
          ],
          "pins": [
            "2109"
          ],
          "codes": [
            "2109"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "may": [
              "paid"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "unpaid"
            ],
            "oct": [
              "payout"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "future"
            ]
          }
        },
        {
          "id": "g2_m7",
          "turn": 7,
          "turnMonth": "nov",
          "payoutDate": "نوفمبر 2026",
          "isShared": true,
          "names": [
            "مؤيد",
            "عبدالمنعم"
          ],
          "shares": [
            1000,
            1000
          ],
          "phones": [
            "01254321098",
            "01043210987"
          ],
          "pins": [
            "1098",
            "0987"
          ],
          "codes": [
            "1098",
            "0987"
          ],
          "payoutMethods": [
            "bank",
            "bank"
          ],
          "bankNames": [
            "",
            ""
          ],
          "ibans": [
            "",
            ""
          ],
          "payments": {
            "may": [
              "paid",
              "paid"
            ],
            "jun": [
              "paid",
              "paid"
            ],
            "jul": [
              "paid",
              "paid"
            ],
            "aug": [
              "paid",
              "paid"
            ],
            "sep": [
              "unpaid",
              "unpaid"
            ],
            "oct": [
              "unpaid",
              "unpaid"
            ],
            "nov": [
              "payout",
              "payout"
            ],
            "dec": [
              "future",
              "future"
            ]
          }
        },
        {
          "id": "g2_m8",
          "turn": 8,
          "turnMonth": "dec",
          "payoutDate": "ديسمبر 2026",
          "isShared": false,
          "names": [
            "يوسف الحاوي"
          ],
          "shares": [
            2000
          ],
          "phones": [
            "01132109876"
          ],
          "pins": [
            "9876"
          ],
          "codes": [
            "9876"
          ],
          "payoutMethods": [
            "bank"
          ],
          "bankNames": [
            ""
          ],
          "ibans": [
            ""
          ],
          "payments": {
            "may": [
              "paid"
            ],
            "jun": [
              "paid"
            ],
            "jul": [
              "paid"
            ],
            "aug": [
              "paid"
            ],
            "sep": [
              "unpaid"
            ],
            "oct": [
              "unpaid"
            ],
            "nov": [
              "future"
            ],
            "dec": [
              "payout"
            ]
          }
        }
      ]
    }
  ]
};
