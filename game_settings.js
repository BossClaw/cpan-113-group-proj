export function get_languages() {
  var local_languages_str = localStorage.getItem("settings_languages");
  if (!local_languages_str) {
    local_languages = "[\"Javascript\"]";
  }

  // PARSE
  return JSON.parse(local_languages_str);
}

export function get_level(_level = 1) {
  var local_level = localStorage.getItem("settings_level");
  if (local_level) {
    return local_level;
  }
  return _level;
}

export function get_difficulty() {
  var local_difficulty = localStorage.getItem("settings_difficulty");
  if (local_difficulty) {
    return local_difficulty;
  }
  return "1";
}

export function get_intials() {
  var local_initials = localStorage.getItem("settings_initials");
  if (local_initials) {
    return local_initials;
  }
  return "AAA";
}
