// קריאת פרמטרים מה-URL
const params = new URLSearchParams(window.location.search);
const hosp = params.get("hospitalization") || "";
const amount = params.get("amount") || "";
const patientName = params.get("patientName") || "";
const hospDate = params.get("hospDate") || "";

document.getElementById("hospitalizationNumber").textContent = hosp;
document.getElementById("hospDate").textContent = hospDate;
document.getElementById("amount").textContent = amount;
document.getElementById("patientName").textContent = patientName;

if (history.replaceState) {
  history.replaceState({}, document.title, window.location.pathname);
}

const baseUrl =
  "https://direct.tranzila.com/szmctest/iframe.php?lang=il&cred_type=1&currency=1";

window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue =
    "האם אתה בטוח שברצונך לעזוב? הקישור יפוג ותצטרך להיכנס מחדש.";
});

document.getElementById("phone").addEventListener("input", function (e) {
  const phoneError = document.getElementById("phoneError");
  const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
  if (e.target.value !== onlyNumbers) {
    e.target.value = onlyNumbers;
  }
  if (onlyNumbers.length > 0) {
    phoneError.textContent = "";
    e.target.classList.remove("error");
  }
});

document.getElementById("preForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fname = document.getElementById("fname").value.trim();
  const lname = document.getElementById("lname").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const phoneError = document.getElementById("phoneError");

  phoneError.textContent = "";
  document.querySelectorAll("input").forEach((i) => i.classList.remove("error"));

  if (!fname) {
    alert("נא למלא שם פרטי");
    document.getElementById("fname").focus();
    return;
  }
  if (!lname) {
    alert("נא למלא שם משפחה");
    document.getElementById("lname").focus();
    return;
  }
  if (!address) {
    alert("נא למלא כתובת");
    document.getElementById("address").focus();
    return;
  }
  if (!phone) {
    alert("נא למלא מספר טלפון");
    document.getElementById("phone").focus();
    return;
  }
  if (!/^0\d{8,9}$/.test(phone)) {
    phoneError.textContent =
      "מספר טלפון חייב להתחיל ב־0 ולהכיל בין 9 ל־10 ספרות";
    document.getElementById("phone").classList.add("error");
    document.getElementById("phone").focus();
    return;
  }
  if (!email) {
    alert("נא למלא כתובת אימייל");
    document.getElementById("email").focus();
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("כתובת האימייל אינה תקינה");
    document.getElementById("email").focus();
    return;
  }

  const iframeUrl = `${baseUrl}&sum=${encodeURIComponent(
    amount
  )}&hospitalization=${encodeURIComponent(
    hosp
  )}&fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(
    lname
  )}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(
    phone
  )}&email=${encodeURIComponent(email)}`;

  document.getElementById("tranzilaFrame").src = iframeUrl;
  document.getElementById("iframeContainer").style.display = "block";
  document.getElementById("formContainer").style.display = "none";
});

function goBackToForm() {
  document.getElementById("iframeContainer").style.display = "none";
  document.getElementById("formContainer").style.display = "block";
  document.getElementById("tranzilaFrame").src = "";
}
