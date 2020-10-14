import joi from 'joi';

/**
 * User validation schema.
 */
export const userSchema = joi.object().keys({
	name: joi.string().min(3).max(45).required(),
	email: joi.string().email().min(5).max(200).required(),
	favoriteThemes: joi.array().items(joi.string()).min(1).unique().required(),
});
