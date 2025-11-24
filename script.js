document.addEventListener('DOMContentLoaded', function () {
    let hosp = '';
    let amount = '';
    let patientName = '';
    let hospDate = '';

    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');

    if (encodedData) {
        try {
            // 1. פענוח Base64 רגיל (מחזיר מחרוזת עם תווי NULL מ-UTF-16)
            const utf16String = atob(encodedData); 
            let decodedString = '';
            
            // 2. טיפול ב-BOM והסרת תווי NULL (פענוח UTF-16)
            let startIndex = 0;
            // בדיקת BOM של UTF-16
            if (utf16String.length >= 2 && utf16String.charCodeAt(0) === 255 && utf16String.charCodeAt(1) === 254) {
                 startIndex = 2;
            } 

            // הסרת תווי NULL (בייט האפס)
            for (let i = startIndex; i < utf16String.length; i += 2) {
                decodedString += utf16String.charAt(i);
            }
            
            // 3. חילוץ פרמטרים
            decodedString.split('&').forEach(pair => {
                const [key, value] = pair.split('=');
                if (key && value) {
                    switch (key.trim()) {
                        case 'hospitalization':
                            hosp = value.trim();
                            break;
                        case 'amount':
                            amount = value.trim();
                            break;
case 'patientName':
                            const rawValue = value.trim();
                            let tempName = rawValue;

                            // 1. נסו תמיד לפענח URI, אך עטפו אותו ב-try/catch כדי למנוע שבירת הלולאה
                            try {
                                tempName = decodeURIComponent(rawValue);
                                // אם הפענוח הצליח והתוצאה היא עברית (לא גיבריש), נשתמש בה
                                if (tempName !== rawValue) {
                                    patientName = tempName;
                                    break;
                                }
                            } catch (e) {
                                // אם ה-URI malformed, נמשיך לטיפול בגיבריש
                            }

                            // 2. אם הפענוח נכשל (או החזיר את אותו ערך), נניח שמדובר בגיבריש (ISO/Windows)
                            try {
                                const bytes = Array.from(rawValue, c => c.charCodeAt(0));
                                // המרה מפורשת מ-windows-1255 ל-UTF-8
                                const isoString = String.fromCharCode.apply(null, bytes);
                                const decoder = new TextDecoder('windows-1255');
                                const encoder = new TextEncoder();
                                
                                patientName = decoder.decode(encoder.encode(isoString));
                            } catch (e) {
                                // אם הכל נכשל, נשתמש בערך הגולמי (הגיבריש יוצג)
                                patientName = rawValue;
                            }
                            break;
                        case 'hospDate':
                            hospDate = value.trim();
                            break;
                        default:
                            break;
                    }
                }
            });

        } catch (e) {
            // אם הפענוח הבסיסי נכשל, נרשום את השגיאה
            console.error("שגיאה קריטית בפענוח Base64:", e);
        }
    }
   
     // בדיקת חובה לאחר ניסיון הפענוח
    if (!hosp || !amount || !patientName || !hospDate) {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 40px; font-size: 1.4em; color: darkred;">
                נראה שהלינק פגום,<br>יש להיכנס מחדש ללינק שקיבלת בהודעה מהמרכז הרפואי.
            </div>
        `;
        return; // מפסיק את המשך ההרצה
    }

  
    // ניקוי ה־URL מהפרמטרים (נשאר זהה)
 //   if (history.replaceState) {
        // מנקה את ה-URL מכל פרמטר (כולל 'data')
//        history.replaceState({}, document.title, window.location.pathname);
//    }

    // כתובת iframe של טרנזילה (נשאר זהה)
    const baseUrl = 'https://direct.tranzila.com/szmctest/iframe.php?lang=il&cred_type=1&currency=1';

    // אזהרת רענון / יציאה מהעמוד (נשאר זהה)
    window.addEventListener('beforeunload', function(e) {
        e.preventDefault();
        e.returnValue = 'האם אתה בטוח שברצונך לעזוב? הקישור יפוג ותצטרך להיכנס מחדש.';
    });

    // הגדרת הודעות מותאמות אישית (נשאר זהה)
    const requiredFields = [
        { id: 'fname', message: 'נא למלא שם פרטי' },
        { id: 'lname', message: 'נא למלא שם משפחה' },
        { id: 'address', message: 'נא למלא כתובת' },
        { id: 'phone', message: 'נא למלא מספר טלפון תקין' },
        { id: 'email', message: 'נא למלא כתובת אימייל תקינה' }
    ];

    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input) return;

        input.addEventListener('invalid', function () {
            this.setCustomValidity(field.message);
        });

        input.addEventListener('input', function () {
            this.setCustomValidity('');
        });
    });

    // ולידציה טלפון – רק ספרות, מתחיל ב־0, באורך 9–10 (נשאר זהה)
    document.getElementById('phone').addEventListener('input', function(e) {
        const phoneError = document.getElementById('phoneError');
        const value = e.target.value;

        // ניקוי תווים לא מספריים
        const onlyNumbers = value.replace(/[^0-9]/g, '');
        if (value !== onlyNumbers) {
            e.target.value = onlyNumbers;
        }

        // הסרת הודעות שגיאה בזמן הקלדה
        if (onlyNumbers.length >= 9) {
            e.target.classList.remove('error');
            phoneError.textContent = '';
        }
    });

    // שליחת הטופס (נשאר זהה)
    document.getElementById('preForm').addEventListener('submit', function(e){
        e.preventDefault();

        const fname = document.getElementById('fname').value.trim();
        const lname = document.getElementById('lname').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const phoneError = document.getElementById('phoneError');

        // בדיקת חובה כללית (שלא יוגש בטעות)
        if (!fname || !lname || !address || !phone || !email) {
            return;
        }

        // בדיקת טלפון – חייב להתחיל ב־0 ולהיות 9 או 10 ספרות
        if (!/^0\d{8,9}$/.test(phone)) {
            phoneError.textContent = 'מספר טלפון חייב להתחיל ב־0 ולהכיל בין 9 ל־10 ספרות';
            document.getElementById('phone').classList.add('error');
            return;
        }

        // בדיקת מייל
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email').setCustomValidity('כתובת המייל אינה תקינה');
            document.getElementById('email').reportValidity();
            return;
        }

        // יצירת URL של טרנזילה (משתמש בפרמטרים החולצו)
        const iframeUrl = `${baseUrl}&sum=${encodeURIComponent(amount)}&hospitalization=${encodeURIComponent(hosp)}&fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(lname)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`;

        // הצגת iframe והסתרת טופס
        document.getElementById('tranzilaFrame').src = iframeUrl;
        document.getElementById('iframeContainer').style.display = 'block';
        document.getElementById('formContainer').style.display = 'none';
    });

    // פונקציה חזרה לטופס (נשאר זהה)
    // הערה: נראה שהמשתנה paymentInProgress אינו מוגדר בקוד שהצגת, ייתכן שתצטרך להוסיף אותו אם הוא רלוונטי
    // function goBackToForm() {
    //     document.getElementById('iframeContainer').style.display = 'none';
    //     document.getElementById('formContainer').style.display = 'block';
    //     document.getElementById('tranzilaFrame').src = '';
    //     paymentInProgress = false;
    // }

});

// הפונקציה החיצונית goBackToForm (נשארת מחוץ ל-DOMContentLoaded)
function goBackToForm() {
    document.getElementById('iframeContainer').style.display = 'none';
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('tranzilaFrame').src = '';
    // אם paymentInProgress חשוב, הגדר אותו בתחילת הסקריפט
    // paymentInProgress = false; 
}

function goBackToForm() {
  document.getElementById('iframeContainer').style.display = 'none';
  document.getElementById('formContainer').style.display = 'block';
  document.getElementById('tranzilaFrame').src = '';
  paymentInProgress = false;
}



