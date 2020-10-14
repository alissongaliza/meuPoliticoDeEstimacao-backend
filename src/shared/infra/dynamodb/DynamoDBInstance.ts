import { config, DynamoDB } from 'aws-sdk';

config.update({ region: process.env.AWS_REGION });
export const DynamoDBInstance =
	process.env.ENV === 'dev'
		? new DynamoDB.DocumentClient({ endpoint: process.env.DB_ENDPOINT })
		: new DynamoDB.DocumentClient();
