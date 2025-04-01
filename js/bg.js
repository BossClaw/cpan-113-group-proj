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

  document.addEventListener("DOMContentLoaded", () => {
    update_bg_scroll(0);
  });

  document.addEventListener("scroll", () => {
    update_bg_scroll(window.scrollY);
  });
}
