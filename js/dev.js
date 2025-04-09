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
  fps_div.style.position = "fixed";
  fps_div.style.top = "138px";
  fps_div.style.left = "10px";
  fps_div.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  fps_div.style.color = "lime";
  fps_div.style.fontFamily = "monospace";
  fps_div.style.padding = "5px 10px";
  fps_div.style.borderRadius = "5px";
  fps_div.style.zIndex = "9999";

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
    mesg_div.style.position = "fixed";
    mesg_div.style.top = "0px";
    mesg_div.style.left = "0px";
    mesg_div.style.height = "128px";
    mesg_div.style.width = "100%";
    mesg_div.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    mesg_div.style.color = "orange";
    mesg_div.style.fontFamily = "monospace";
    mesg_div.style.fontSize = "12px";
    mesg_div.style.padding = "5px 10px";
    mesg_div.style.borderRadius = "5px";
    mesg_div.style.zIndex = "9999";
    mesg_div.style.overflow = "scroll";
    mesg_div.style.whiteSpace = "pre";
    mesg_div.style.overscrollBehavior = "contain";

    document.body.appendChild(mesg_div);
  }

  // ADD AND OVERFLOW
  mesg_div.textContent += mesg_str + "\n";
}
