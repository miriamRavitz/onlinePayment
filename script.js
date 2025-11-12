document.getElementById('preForm').addEventListener('submit', function(e){
  e.preventDefault();

  const fname = document.getElementById('fname');
  const lname = document.getElementById('lname');
  const address = document.getElementById('address');
  const phone = document.getElementById('phone');
  const email = document.getElementById('email');

  let valid = true;

  ['fname', 'lname', 'address', 'phone', 'email'].forEach(id => {
    document.getElementById(id).classList.remove('error');
    document.getElementById(id + 'Error').textContent = '';
  });

  if (!fname.value.trim()) {
    fname.classList.add('error');
    document.getElementById('fnameError').textContent = 'נא למלא שם פרטי';
    valid = false;
  }
  if (!lname.value.trim()) {
    lname.classList.add('error');
    document.getElementById('lnameError').textContent = 'נא למלא שם משפחה';
    valid = false;
  }
  if (!address.value.trim()) {
    address.classList.add('error');
    document.getElementById('addressError').textContent = 'נא למלא כתובת';
    valid = false;
  }

  const phoneVal = phone.value.trim();
  if (!phoneVal) {
    phone.classList.add('error');
    document.getElementById('phoneError').textContent = 'נא למלא מספר טלפון תקין';
    valid = false;
  } else if (!/^0\\d{8,9}$/.test(phoneVal)) {
    phone.classList.add('error');
    document.getElementById('phoneError').textContent = 'מספר טלפון חייב להתחיל ב־0 ולהכיל בין 9 ל־10 ספרות';
    valid = false;
  }

  const emailVal = email.value.trim();
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailVal) {
    email.classList.add('error');
    document.getElementById('emailError').textContent = 'נא למלא כתובת אימייל תקינה';
    valid = false;
  } else if (!emailRegex.test(emailVal)) {
    email.classList.add('error');
    document.getElementById('emailError').textContent = 'כתובת המייל אינה תקינה';
    valid = false;
  }

  if (!valid) return;

  alert('הטופס תקין!');
});
