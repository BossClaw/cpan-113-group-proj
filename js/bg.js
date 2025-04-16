// =======================================================================
// DUCK - BG.JS COMMON BACKGROUND FOR PAGES

export function viz_init_bg() {
  // HANDLE THE BG PARALLAX

  // GET REF TO ROOT
  const root = document.documentElement;

  function update_bg_scroll(pos_y) {
    const pos_bg = pos_y * 0.9;
    const pos_mg = pos_y * 0.8;
    const pos_fg = pos_y * 0.7;

    // console.log(`pos_Y[${pos_y}] BG[${pos_bg}] MG[${pos_mg}] FG[${pos_fg}]`);
    
    document.documentElement.style.setProperty("--pos-bg", `0px ${pos_bg}px`);
    document.documentElement.style.setProperty("--pos-mg", `0px ${pos_mg}px`);
    document.documentElement.style.setProperty("--pos-fg", `0px ${pos_fg}px`);
  }

  document.addEventListener("DOMContentLoaded", () => {
    update_bg_scroll(0);
  });
  document.addEventListener("scroll", () => {
    update_bg_scroll(window.scrollY);
  });
}
