const { getData } = require('./parsePropositionsAndAuthors');

const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

// Create DynamoDB service object
const ddb = new AWS.DynamoDB.DocumentClient();

const data = getData();
const dataLength = data.length;
console.log(dataLength, ' items to be inserted');
let lastIndex = 0;
let delay = 0;
for (let i = 24; i < dataLength; i += 25) {
	// because the length might not be perfectly divisible by 25
	i = i > dataLength ? dataLength : i;
	const slicedProposition = data.slice(lastIndex, i);
	lastIndex = i;

	const items = slicedProposition.map((el) => {
		const item = {
			...el,
			entity: '' + el.entity,
			data: '' + el.data,
		};
		// Removes empty string values like: "ementa":"". Allowing 0 as a value
		let nonEmptyValues = Object.entries(item).reduce((a, [k, v]) => (v || v === 0 ? { ...a, [k]: v } : a), {});
		nonEmptyValues = Object.entries(nonEmptyValues).reduce((a, [k, v]) => {
			switch (typeof v) {
				case 'string':
					return { ...a, [k]: v };
				case 'number':
					return { ...a, [k]: v };
				case 'object':
					return { ...a, [k]: v };
				default:
					throw new Error('Unknown type');
			}
		}, {});

		return {
			PutRequest: {
				Item: nonEmptyValues,
			},
		};
	});

	setTimeout(
		([curItems, progress]) => {
			const params = {
				RequestItems: {
					'dev-meuPoliticoDeEstimacao-backend-proposition': curItems,
				},
			};
			ddb.batchWrite(params, function (err, data) {
				if (err) {
					console.log('Error', err);
				} else {
					console.log('Success', data, progress);
				}
			});
		},
		1100 * delay,
		[items, delay * 25]
	);
	delay++;
}

// ddb.batchWrite(params, function (err, data) {
// 	if (err) {
// 		console.log('Error', err);
// 	} else {
// 		console.log('Success', data);
// 	}
// });
