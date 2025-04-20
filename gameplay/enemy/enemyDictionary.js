// enemy sprite image should be: "gameplay/enemy/${this.name}.gif"
// NOTE - ALL SPRITES ARE 32x32, SO CONSIDER THAT WHEN PLACING 'CENTER' SPRITE

// WIP
//  MIN -   0 + 16 + HALF_V = 32
//  MAX = 160 - FULL_V = 128

export const enemyDictionary = {
	// RED CRAB
	lv0: {
		name: 'error',
		level: 0,
		hp: 1,
		damage: 1,
		speed: 0.6,

		yMin: 32,
		yMax: 80,
		classes_arr: ['enemy_pulsate_fast'],
	},

	// YELLOW BUG
	lv1: {
		name: 'bug',
		level: 1,
		hp: 1,
		damage: 1,
		speed: 1,

		yMin: 32,
		yMax: 80,
	},

	// BROWN WORM
	lv2: {
		name: 'underrun',
		level: 2,
		hp: 2,
		damage: 2,
		speed: 0.7,

		yMin: 32,
		yMax: 80,
	},

	// PURPLE SQUID
	lv3: {
		name: 'stack_overflow',
		level: 3,
		hp: 3,
		damage: 3,
		speed: 0.5,

		yMin: 64,
		yMax: 128,
		// ARRAY OF EXTRA CLASSES
		classes_arr: ['enemy_hover_slow'],
	},

	// PINK EYE
	lv4: {
		name: 'infinite_loop',
		level: 4,
		hp: 4,
		damage: 4,
		speed: 0.2,

		yMin: 64,
		yMax: 128,
		// ARRAY OF EXTRA CLASSES
		// TBD - ANIMATE.CSS SUPPORT classes_arr: ['animate_infinite', 'animate__shakeY'],
		classes_arr: ['enemy_hover_slow', 'enemy_pulsate_slow'],
	},

	// GHOST
	lv5: {
		name: 'null_pointer',
		level: 5,
		hp: 5,
		damage: 2,
		speed: 0.1,

		yMin: 64,
		yMax: 128,
		// ARRAY OF EXTRA CLASSES
		classes_arr: ['enemy_hover_slow'],
	},

	// BLUE LAND OCTOPUS
	lv6: {
		name: 'deadlock',
		level: 6,
		hp: 6,
		damage: 1,
		speed: 0.1,

		yMin: 32,
		yMax: 80,
	},

	// BROWN MOUTH jUMPER
	lv7: {
		name: 'segfault',
		level: 7,
		hp: 2,
		damage: 7,
		speed: 0.07,

		yMin: 32,
		yMax: 80,	
	},
};
