// =================================================================
// DUCK - DEV DEBUG HELPER TOOLS

let dev_enabled = false;
let dev_viz = false;

export function dev_init() {
  dev_enabled = true;
  dev_add_fps();
  dev_viz_set(true);

  document.addEventListener("keyup", (e) => {
    if (e.key === "`") {
      dev_viz_set(!dev_viz);
    }
  });
}

export function dev_viz_set(new_viz) {
  dev_viz = new_viz;

  dev_log_mesg(`[DEV] VIZ SET TO(${dev_viz})`);

  if (fps_div) {
    fps_div.style.visibility = dev_viz ? "visible" : "hidden";
  }
  if (mesg_div) {
    mesg_div.style.visibility = dev_viz ? "visible" : "hidden";
  }
}

// =================================================================
// FPS COUNTER

let lastTime = performance.now();
let frames = 0;
let fps = 0;
let fps_div;

export function dev_add_fps() {
  fps_div = document.createElement("div");
  fps_div.classList.add('dev_div'); 
  fps_div.classList.add('dev_div_fps'); 
  
  document.body.appendChild(fps_div);

  function updateFPS(currentTime) {
    frames++;
    const delta = currentTime - lastTime;

    if (delta >= 1000) {
      fps = frames;
      frames = 0;
      lastTime = currentTime;
      fps_div.textContent = `FPS: ${fps}`;
    }

    requestAnimationFrame(updateFPS);
  }

  requestAnimationFrame(updateFPS);
}

// =============================================================================
// ON-SCREEN DEBUG MESG

let mesg_div;

// ADD DOM IF NOT ALREADY
export function dev_log_mesg(mesg_str) {
  if (!mesg_div) {
    mesg_div = document.createElement("div");    
    mesg_div.classList.add("dev_div");
    mesg_div.classList.add("dev_div_mesg");

    
    document.body.appendChild(mesg_div);
  }

  // ADD AND OVERFLOW
  mesg_div.textContent += mesg_str + "\n";
}
