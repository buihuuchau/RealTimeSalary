document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".money-container");
    const resultDisplay = document.getElementById("result");
    const salaryInput = document.getElementById("salaryInput");
    const numberOfDaysInput = document.getElementById("numberOfDaysInput");

    const morningStartInput = document.getElementById("morningStart");
    const morningEndInput = document.getElementById("morningEnd");
    const afternoonStartInput = document.getElementById("afternoonStart");
    const afternoonEndInput = document.getElementById("afternoonEnd");

    // Tạo hiệu ứng tiền rơi
    function createMoney() {
        const money = document.createElement("img");
        money.src =
            "https://2sao.vietnamnetjsc.vn//2016/04/05/16/14/4-dieu-thu-vi-ve-menh-gia-tien-100-dong-xua-va-nay_5.jpg";
        money.classList.add("money");

        money.style.left = Math.random() * window.innerWidth + "px";
        money.style.animationDuration = Math.random() * 3 + 2 + "s";
        money.style.opacity = Math.random();

        container.appendChild(money);
        setTimeout(() => money.remove(), 5000);
    }
    setInterval(createMoney, 200);

    // Chuyển đổi giờ từ input time sang giây
    function timeToSeconds(timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 3600 + minutes * 60;
    }

    // Tạo danh sách các ngày làm việc trong tuần từ thứ 2 (1) trở đi
    function getWorkingDays(numDays) {
        const days = [];
        for (let i = 0; i < numDays; i++) {
            days.push((i + 1) % 7); // 1 là thứ 2 -> 6 là thứ 7, 0 là chủ nhật
        }
        return days;
    }

    // Đếm số ngày làm việc trong tháng
    function getWorkingDaysInCurrentMonth() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const workingDays = getWorkingDays(
            parseInt(numberOfDaysInput.value || "5")
        );
        let count = 0;

        for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(year, month, i).getDay();
            if (workingDays.includes(day)) {
                count++;
            }
        }

        return count;
    }

    // Tính giây đã làm hôm nay
    function getWorkedSecondsToday() {
        const now = new Date();
        const day = now.getDay();
        const currentSeconds =
            now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

        const workingDays = getWorkingDays(
            parseInt(numberOfDaysInput.value || "5")
        );
        if (!workingDays.includes(day)) return 0;

        const mStart = timeToSeconds(morningStartInput.value);
        const mEnd = timeToSeconds(morningEndInput.value);
        const aStart = timeToSeconds(afternoonStartInput.value);
        const aEnd = timeToSeconds(afternoonEndInput.value);

        let worked = 0;

        if (currentSeconds >= mStart && currentSeconds < mEnd) {
            worked += currentSeconds - mStart;
        } else if (currentSeconds >= mEnd) {
            worked += mEnd - mStart;
        }

        if (currentSeconds >= aStart && currentSeconds < aEnd) {
            worked += currentSeconds - aStart;
        } else if (currentSeconds >= aEnd) {
            worked += aEnd - aStart;
        }

        return worked;
    }

    // Tính tổng giây đã làm từ đầu tháng đến nay
    function getAccumulatedWorkedSeconds() {
        const now = new Date();
        let totalSeconds = 0;

        const mStart = timeToSeconds(morningStartInput.value);
        const mEnd = timeToSeconds(morningEndInput.value);
        const aStart = timeToSeconds(afternoonStartInput.value);
        const aEnd = timeToSeconds(afternoonEndInput.value);

        const dailySeconds = mEnd - mStart + (aEnd - aStart);
        const currentDate = now.getDate();
        const workingDays = getWorkingDays(
            parseInt(numberOfDaysInput.value || "5")
        );

        for (let d = 1; d < currentDate; d++) {
            const dow = new Date(now.getFullYear(), now.getMonth(), d).getDay();
            if (workingDays.includes(dow)) {
                totalSeconds += dailySeconds;
            }
        }

        totalSeconds += getWorkedSecondsToday();
        return totalSeconds;
    }

    // Cập nhật tiền đang kiếm
    function updateEarnings() {
        const salary = parseFloat(salaryInput.value || "0");
        const workingDays = getWorkingDaysInCurrentMonth();
        const mStart = timeToSeconds(morningStartInput.value);
        const mEnd = timeToSeconds(morningEndInput.value);
        const aStart = timeToSeconds(afternoonStartInput.value);
        const aEnd = timeToSeconds(afternoonEndInput.value);

        const dailySeconds = mEnd - mStart + (aEnd - aStart);
        const totalWorkingSeconds = workingDays * dailySeconds;

        if (totalWorkingSeconds === 0) return;

        const earningPerSecond = salary / totalWorkingSeconds;
        const accumulatedSeconds = getAccumulatedWorkedSeconds();
        const currentEarning = accumulatedSeconds * earningPerSecond;

        resultDisplay.textContent = `${Math.floor(
            currentEarning
        ).toLocaleString()} VNĐ`;
    }

    // Cập nhật mỗi giây
    setInterval(updateEarnings, 1000);

    // Áp dụng lại ngay khi thay đổi bất kỳ input
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
        input.addEventListener("input", updateEarnings);
    });
});
