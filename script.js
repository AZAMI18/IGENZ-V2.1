let balance = parseInt(localStorage.getItem("balance")) || 1250;
let nextClaimTime = parseInt(localStorage.getItem("nextClaimTime")) || Date.now();

const claimBtn = document.getElementById("claimButton");
const balanceDisplay = document.getElementById("balance");
const countdownDisplay = document.getElementById("countdown");

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function updateCountdown() {
  const now = Date.now();
  const distance = nextClaimTime - now;
  
  if (distance <= 0) {
    countdownDisplay.textContent = "00:00:00";
    claimBtn.disabled = false;
    claimBtn.textContent = "Claim +50";
  } else {
    countdownDisplay.textContent = formatTime(distance);
    claimBtn.disabled = true;
    claimBtn.textContent = "Wait for next claim";
  }
}

async function handleReferralReward() {
  const referrer = localStorage.getItem("ref_by");
  const rewardGiven = localStorage.getItem("ref_rewarded");
  
  if (referrer && !rewardGiven) {
    try {
      await fetch("https://your-backend-url.com/api/reward-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref_by: referrer })
      });
      localStorage.setItem("ref_rewarded", "true");
      console.log("Referral reward sent to", referrer);
    } catch (err) {
      console.error("Failed to send referral reward:", err);
    }
  }
}

claimBtn.addEventListener("click", async () => {
  if (Date.now() >= nextClaimTime) {
    balance += 50;
    balanceDisplay.textContent = `${balance} IGENZ Points`;
    localStorage.setItem("balance", balance);
    
    nextClaimTime = Date.now() + 24 * 60 * 60 * 1000; // 24 jam
    localStorage.setItem("nextClaimTime", nextClaimTime);
    
    await handleReferralReward(); // kirim reward kalau ada referrer
    updateCountdown();
  }
});

function copyReferral() {
  const ref = document.getElementById("refLink");
  ref.select();
  ref.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Referral link copied!");
}

// Initial load
balanceDisplay.textContent = `${balance} IGENZ Points`;
updateCountdown();
setInterval(updateCountdown, 1000);