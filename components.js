import { createComponentClass, TagComponent, createType } from 'ecsy/build/ecsy.module.js';
import Vector2 from './vector2.js';

let CustomVector2 = createType({
	baseType: Vector2,
	create: defaultValue => {
		var v = new Vector2(0, 0);
		if (typeof defaultValue !== 'undefined') {
			v = defaultValue.clone();
		}
		return v;
	},
	reset: (src, key, defaultValue) => {
		if (typeof defaultValue !== 'undefined') {
			src[key] = defaultValue.clone();
		} else {
			src[key].set(0, 0);
		}
	},
	clear: (src, key) => {
		src[key].set(0, 0);
	},
	copy: (src, dst, key) => {
		src[key] = dst[key];
	},
});

export let Position = createComponentClass(
	{
		value: { default: new Vector2(), type: CustomVector2 },
	},
	'Position',
);

export let Velocity = createComponentClass(
	{
		value: { default: new Vector2(), type: CustomVector2 },
	},
	'Velocity',
);

export let Link = createComponentClass(
	{
		from: { default: -1 },
		to: { default: -1 },
	},
	'Link',
);

export class Anchor extends TagComponent {}
