import joi from 'joi';

/**
 * User validation schema.
 */
export const userSchema = joi.object().keys({
	name: joi.string().min(3).max(45).required(),
	email: joi.string().email().min(5).max(200).required(),
	favoriteThemes: joi.array().items(joi.string()).min(3).max(3).unique().required(),
});
/**
 * Rank Themes validation schema.
 */
export const rankThemesSchema = joi.object().keys({
	newFavoriteThemes: joi.array().items(joi.string()).min(3).max(3).unique().required(),
	oldFavoriteThemes: joi.array().items(joi.string()).min(0).max(3).unique().required(),
});

export const followPoliticiansSchema = joi.object().keys({
	followees: joi
		.array()
		.items(
			joi.object().keys({
				id: joi.string().max(500).required(),
				name: joi.string().max(500).required(),
				photoUrl: joi.string().required(),
				partyCode: joi.string().max(500).required(),
			})
		)
		.min(1)
		.required(),
});
