document.addEventListener('DOMContentLoaded', function () {
// קריאת פרמטרים מה-URL
const params = new URLSearchParams(window.location.search);
const hosp = params.get('hospitalization') || '';
const amount = params.get('amount') || '';
const patientName = params.get('patientName') || '';
const hospDate = params.get('hospDate') || '';

// הצגת פרטים בכותרת
document.getElementById('hospitalizationNumber').textContent = hosp;
document.getElementById('hospDate').textContent = hospDate;
document.getElementById('amount').textContent = amount;
document.getElementById('patientName').textContent = patientName;

// ניקוי ה־URL מהפרמטרים (אבל לא מאבדים אותם בזיכרון)
if (history.replaceState) {
  history.replaceState({}, document.title, window.location.pathname);
}

// כתובת iframe של טרנזילה
const baseUrl = 'https://direct.tranzila.com/szmctest/iframe.php?lang=il&cred_type=1&currency=1';

// אזהרת רענון / יציאה מהעמוד
window.addEventListener('beforeunload', function(e) {
  e.preventDefault();
  e.returnValue = 'האם אתה בטוח שברצונך לעזוב? הקישור יפוג ותצטרך להיכנס מחדש.';
});

// הגדרת הודעות מותאמות אישית
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

// ולידציה טלפון – רק ספרות, מתחיל ב־0, באורך 9–10
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

// שליחת הטופס
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

  // יצירת URL של טרנזילה
  const iframeUrl = `${baseUrl}&sum=${encodeURIComponent(amount)}&hospitalization=${encodeURIComponent(hosp)}&fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(lname)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`;

  // הצגת iframe והסתרת טופס
  document.getElementById('tranzilaFrame').src = iframeUrl;
  document.getElementById('iframeContainer').style.display = 'block';
  document.getElementById('formContainer').style.display = 'none';
});

// חזרה לטופס
function goBackToForm() {
  document.getElementById('iframeContainer').style.display = 'none';
  document.getElementById('formContainer').style.display = 'block';
  document.getElementById('tranzilaFrame').src = '';
}
  });
