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
        id, //089dea43-7758-4271-9b3b-8aeb19e9aea9
        name,
        email,
        days,
        message,
        createdAt: new Date().toLocaleDateString(),
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
