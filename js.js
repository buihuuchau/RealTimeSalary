const container = document.querySelector('.money-container');
const resultDisplay = document.getElementById('result');
const salaryInput = document.getElementById('salaryInput');

// Tạo hiệu ứng tiền rơi
function createMoney() {
  const money = document.createElement('img');
  money.src = 'https://2sao.vietnamnetjsc.vn//2016/04/05/16/14/4-dieu-thu-vi-ve-menh-gia-tien-100-dong-xua-va-nay_5.jpg';
  money.classList.add('money');

  money.style.left = Math.random() * window.innerWidth + 'px';
  money.style.animationDuration = (Math.random() * 3 + 2) + 's';
  money.style.opacity = Math.random();

  container.appendChild(money);
  setTimeout(() => money.remove(), 5000);
}
setInterval(createMoney, 200);

// Tính số ngày làm trong tháng (T2-T6)
function getWorkingDaysInCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let count = 0;
  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(year, month, i).getDay();
    if (day >= 1 && day <= 5) count++;
  }
  return count;
}

// Tính giây đã làm hôm nay
function getWorkedSecondsToday() {
  const now = new Date();
  const day = now.getDay();

  if (day === 0 || day === 6) return 0;

  const timeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const morningStart = 8 * 3600 + 30 * 60;
  const morningEnd = 12 * 3600;
  const afternoonStart = 13 * 3600;
  const afternoonEnd = 17 * 3600 + 30 * 60;

  let worked = 0;

  if (timeInSeconds >= morningStart && timeInSeconds < morningEnd) {
    worked += timeInSeconds - morningStart;
  } else if (timeInSeconds >= morningEnd) {
    worked += morningEnd - morningStart;
  }

  if (timeInSeconds >= afternoonStart && timeInSeconds < afternoonEnd) {
    worked += timeInSeconds - afternoonStart;
  } else if (timeInSeconds >= afternoonEnd) {
    worked += afternoonEnd - afternoonStart;
  }

  return worked;
}

// Tổng giây đã làm từ đầu tháng tới giờ
function getAccumulatedWorkedSeconds() {
  const now = new Date();
  let totalSeconds = 0;

  const morningDuration = (12 * 3600) - (8 * 3600 + 30 * 60);
  const afternoonDuration = (17 * 3600 + 30 * 60) - (13 * 3600);
  const dailySeconds = morningDuration + afternoonDuration;

  const currentDate = now.getDate();

  for (let d = 1; d < currentDate; d++) {
    const date = new Date(now.getFullYear(), now.getMonth(), d);
    const dow = date.getDay();
    if (dow >= 1 && dow <= 5) {
      totalSeconds += dailySeconds;
    }
  }

  totalSeconds += getWorkedSecondsToday();
  return totalSeconds;
}

function updateEarnings() {
  const salary = parseFloat(salaryInput.value || "0");
  const workingDays = getWorkingDaysInCurrentMonth();
  const totalWorkingHours = workingDays * 8;
  const totalWorkingSeconds = totalWorkingHours * 3600;
  const earningPerSecond = salary / totalWorkingSeconds;

  const accumulatedSeconds = getAccumulatedWorkedSeconds();
  const currentEarning = accumulatedSeconds * earningPerSecond;

  resultDisplay.textContent = `${Math.floor(currentEarning).toLocaleString()} VNĐ`;
}

setInterval(updateEarnings, 1000);
