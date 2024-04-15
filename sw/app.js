const canWakeLock = () => 'wakeLock' in navigator;
let wakelock;
let wl_status = false;

$("#label-isSupported").text(canWakeLock);


async function lockWakeState() {
  if(!canWakeLock()) return;
  try {
    wakelock = await navigator.wakeLock.request();
    wakelock.addEventListener('release', () => {
      console.log('Screen Wake State Locked:', !wakelock.released);
    });
    console.log('Screen Wake State Locked:', !wakelock.released);
  } catch(e) {
    console.error('Failed to lock wake state with reason:', e.message);
  }
}

$("#lockButton").on("click", function() {
  if(!wl_status) {
    lockWakeState();
    $("#label-isEnabled").text("Enabled");
    $("#lockButton").text("Disable screenlock");
    wl_status = true;
    console.log("Screen is locked.");
  }else {
    releaseWakeState();
    $("#label-isEnabled").text("Disabled");
    wl_status = false;
    $("#lockButton").text("Enable screenlock");
    console.log("Screen is unlocked.");
  }
  
});

function releaseWakeState() {
  if(wakelock) wakelock.release();
  wakelock = null;
}


// setTimeout(releaseWakeState, 5000); // release wake state after 5 seconds