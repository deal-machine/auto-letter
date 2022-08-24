import { APIGatewayProxyHandler } from "aws-lambda";
import { SES } from "aws-sdk";
import { document } from "../utils/dynamodbClient";

import moment from "moment";

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

  // lambda para criar cartas
  // lambda para verificar diariamente se há cartas na data e enviar email

  const createdAt = moment().format("DD/MM/YYYY");
  const sendAt = moment().add(days, "days").format("DD/MM/YYYY");

  await document
    .put({
      TableName: "users_letter",
      Item: {
        id,
        name,
        email,
        days,
        message,
        createdAt,
        sendAt,
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

  // const ses = new SES({ apiVersion: "2010-12-01" });
  // await ses.sendEmail().promise();

  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0]),
  };
};
