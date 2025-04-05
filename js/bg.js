// =======================================================================
// DUCK - BG.JS VIZ COMMON BACKGROUND FOR PAGES

export function viz_init_bg() {
  // HANDLE THE BG PARALLAX
  const bottom_offset = 0;

  function update_bg_scroll(scroll_y) {
    const scroll_bg = bottom_offset + scroll_y * 0.7;
    const scroll_mg = bottom_offset + scroll_y * 0.8;
    const scroll_fg = bottom_offset + scroll_y * 0.9;

    console.log(
      `SCROLL_Y[${scroll_y}] BG[${scroll_bg}] MG[${scroll_mg}] FG[${scroll_fg}]`
    );

    document.documentElement.style.setProperty("--scroll-bg", `${scroll_bg}px`);
    document.documentElement.style.setProperty("--scroll-mg", `${scroll_mg}px`);
    document.documentElement.style.setProperty("--scroll-fg", `${scroll_fg}px`);
  }

  // document.addEventListener("DOMContentLoaded", () => {
  //   update_bg_scroll(0);
  // });

  // document.addEventListener("scroll", () => {
  //   update_bg_scroll(window.scrollY);
  // });

  // MOVE WITH MOUSE
  // document.addEventListener("mousemove", (e) => {
  //   const x = e.clientX;
  //   const y = e.clientY;

  //   // Scale factors
  //   const bg = 0.0075;
  //   const mg = 0.01;
  //   const fg = 0.0125;

  //   const root = document.documentElement;

  //   root.style.setProperty("--pos-bg", `${x * bg}px ${y * bg}px`);
  //   root.style.setProperty("--pos-mg", `${x * mg}px ${y * mg}px`);
  //   root.style.setProperty("--pos-fg", `${x * fg}px ${y * fg}px`);
  // });

  const root = document.documentElement;

  // Maximum drift offset in pixels
  const maxDrift = 350;

  // Each layer's speed multiplier
  const speed = {
    bg: 0.1,
    mg: 0.2,
    fg: 0.3,
  };

  // Current target positions (randomized)
  let target = { x: 0, y: 0 };
  let smooth = { x: 0, y: 0 };

  function randomTarget() {
    target.x = (Math.random() - 0.5) * 2 * maxDrift;
    target.y = (Math.random() - 0.5) * 2 * maxDrift;
  }

  // Update the smooth drift every frame
  function update() {
    // Smoothly interpolate toward target (lerp)
    // smooth.x += (target.x - smooth.x) * 0.05;
    // smooth.y += (target.y - smooth.y) * 0.05;
    smooth.x += target.x * 0.0005;
    smooth.y += target.y * 0.0005;
    
    root.style.setProperty(
      "--pos-bg",
      `${smooth.x * speed.bg}px ${smooth.y * speed.bg}px`
    );


    root.style.setProperty(
      "--pos-mg",
      `${smooth.x * speed.mg}px ${smooth.y * speed.mg}px`
    );


    root.style.setProperty(
      "--pos-fg",
      `${smooth.x * speed.fg}px ${smooth.y * speed.fg}px`
    );

    requestAnimationFrame(update);
  }

  // Pick a new target every few seconds
  setInterval(randomTarget, 7700);

  // Start the loop
  randomTarget();
  update();
}
