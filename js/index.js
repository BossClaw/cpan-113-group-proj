// Wait helper
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Reveal text function
export async function revealTextAsync(text_arr, delay = 50) {
  // GET THE TARG DIV
  const targ_div = document.querySelector("#mission_text_div");
 let prev_mesgs = "";

  // ANIMATE EACH PARAGRAPH SEQUENTIALLY, BUT ADD TO SAME
  for (const text of text_arr) {
    const text_len = text.length;

    for (let chi = 0; chi <= text_len; chi++) {
      const viz_html = text.slice(0, chi);
      const hid_html = `<span class='hidden'>${text.slice(chi)}</span>`;
      targ_div.innerHTML = prev_mesgs + '<p>' + viz_html + hid_html + '</p>';
      await sleep(delay);
    }

    prev_mesgs = targ_div.innerHTML; 
  }
}

// DO IT OVER TIME
(async () => {
  const text_arr = [
    "CORRUPTING BUGS have infiltrated the CORE!",
    "Brave CYBO DUCK must protect the CORE!",    
    "Don't let BUGS EXTINGUISH the FIREWALL!",
    "Don't let BUGS TOUCH MAINFRAMES!",
    "         ",    
    "SQUASH THE BUGS!",
    "SAVE THE CORE!",
  ];

  await revealTextAsync(text_arr);
})();
