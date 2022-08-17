import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

interface ICreateLetter {
  id: string;
  name: string;
  email: string;
  days: number;
  message: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id, name, email, days, message } = JSON.parse(
    event.body
  ) as ICreateLetter;

  await document
    .put({
      TableName: "users_letter",
      Item: {
        id,
        name,
        email,
        days,
        message,
        createdAt: new Date(),
      },
    })
    .promise();

  const response = await document
    .query({
      TableName: "users_letter",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0]),
  };
};