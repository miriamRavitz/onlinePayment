// קריאת פרמטרים מה-URL
const params = new URLSearchParams(window.location.search);
const hosp = params.get('hospitalization') || '';
const amount = params.get('amount') || '';
const patientName = params.get('patientName') || '';
const hospDate = params.get('hospDate') || '';

// הצגת נתונים בטופס
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('hospitalizationNumber').textContent = hosp;
  document.getElementById('hospDate').textContent = hospDate;
  document.getElementById('amount').textContent = amount;
  document.getElementById('patientName').textContent = patientName;

  // ניקוי ה-URL
  if (history.replaceState) {
    history.replaceState({}, document.title, window.location.pathname);
  }
});

// אזהרה לפני עזיבת הדף
window.addEventListener('beforeunload', function(e) {
  e.preventDefault();
  e.returnValue = 'האם אתה בטוח שברצונך לעזוב? הקישור יפוג ותצטרך להיכנס מחדש.';
});

const baseUrl = 'https://direct.tranzila.com/szmctest/iframe.php?lang=il&cred type=1&currency=1';

// הגדרת הודעות חובה מותאמות אישית
const requiredFields = [
  { id: 'fname', message: 'נא למלא שם פרטי' },
  { id: 'lname', message: 'נא למלא שם המשפחה' },
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

// ולידציה על טלפון - רק מספרים
const phoneInput = document.getElementById('phone');
const phoneError = document.getElementById('phoneError');

phoneInput.addEventListener('input', function(e) {
  const value = e.target.value;
  const onlyNumbers = value.replace(/[^0-9]/g, '');
  if (value !== onlyNumbers) {
    e.target.value = onlyNumbers;
  }

  if (onlyNumbers.length > 0) {
    e.target.classList.remove('error');
    phoneError.textContent = '';
  }
});

// שליחת הטופס
const preForm = document.getElementById('preForm');
preForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const fname = document.getElementById('fname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  const address = document.getElementById('address').value.trim();
  const phone = phoneInput.value.trim();
  const email = document.getElementById('email').value.trim();

  // בדיקה אם שדות חובה מלאים
  if (!fname || !lname || !address || !phone || !email) {
    alert('נא למלא את כל שדות החובה');
    return;
  }

  // בדיקת טלפון - 9 עד 10 ספרות, מתחיל ב־0
  if (!/^0\d{8,9}$/.test(phone)) {
    phoneError.textContent = 'מספר טלפון חייב להתחיל ב־0 ולהכיל בין 9 עד 10 ספרות';
    phoneInput.classList.add('error');
    return;
  }

  // בדיקת כתובת מייל
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('כתובת המייל אינה תקינה');
    return;
  }

  // הצגת iframe עם פרטי תשלום
  const iframeUrl = `${baseUrl}&sum=${encodeURIComponent(amount)}&hospitalization=${encodeURIComponent(hosp)}&fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(lname)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`;

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
