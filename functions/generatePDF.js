import React from "react";
import { Font, renderToStream } from "@react-pdf/renderer";
import AWS from 'aws-sdk';
import AwesomePDF from "../components/AwesomePDF";

// S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.PDF_ACCESS_KEY,
  secretAccessKey: process.env.PDF_SECRET_KEY,
});

// Utils
const base64ToJson = (base64) => {
  let buff = Buffer.from(base64, "base64");
  let eventBodyStr = buff.toString("UTF-8");
  return JSON.parse(eventBodyStr);
}
const streamToBuffer = (stream) => {
  return new Promise(function (res) {
    const chunks = [];

    stream.on("data", (chunk) => chunks.push(chunk));

    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      res(buffer);
    });
  });
}

// Registering fonts
process.env.FONTCONFIG_PATH = __dirname;
Font.register({
  family: "Nunito",
  format: "truetype",
  fonts: [
    { src: "./fonts/Nunito-Regular.ttf", fontStyle: "normal", fontWeight: 400 },
    { src: "./fonts/Nunito-Bold.ttf", fontStyle: "normal", fontWeight: 700 },
    { src: "./fonts/Nunito-Italic.ttf", fontStyle: "italic", fontWeight: 400 },
    { src: "./fonts/Nunito-BoldItalic.ttf", fontStyle: "italic", fontWeight: 700 },
  ]
});
Font.registerHyphenationCallback((word) => [word]);
Font.registerEmojiSource({
  format: "png",
  url: "https://twemoji.maxcdn.com/2/72x72/",
});

// Default header for all responses
const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers" : "Content-Type,Accept,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods" : "OPTIONS,POST",
  "Access-Control-Allow-Credentials" : true,
}

const handler = async (event, context) => {
  const started = new Date();

  // Validator body
  if (!event.body) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        ...defaultHeaders
      },
      body: JSON.stringify('Invalid body'),
    };
  }

  try {
    // Getting the body
    const body = event.isBase64Encoded ? base64ToJson(event.body) : JSON.parse(event.body);
    const { pageTitle, awesomeVariableA, awesomeVariableB } = body;

    // Render PDF to Stream
    const stream = await renderToStream(
      <AwesomePDF
        pageTitle={pageTitle}
        awesomeVariableA={awesomeVariableA}
        awesomeVariableB={awesomeVariableB}
        envVariableA={process.env.ENV_VARIABLE_A}
        envVariableB={process.env.ENV_VARIABLE_B}
      />
    );

    // Getting the file name
    const fileName = stream.info.Title;
    console.log("Filename is:", fileName);
  
    // Convert Stream to Buffer
    const buffer = await streamToBuffer(stream);
    console.log(`Rendered PDF in ${new Date() - started}ms`);

    // Upload the pdf to S3 and send the URL
    const uploadDate = new Date();
    const result = await s3.upload({
      Bucket: "temporary.pdfs",
      ContentType: "application/pdf",
      ACL: "public-read",
      Key: fileName,
      Body: buffer,
    }).promise();
    console.log(`Uploaded PDF in ${new Date() - uploadDate}ms`);
  
    // Redirect the user to the S3 bucket file URL
    return {
      statusCode: 301,
      headers: {
        "Location": result.Location,
        ...defaultHeaders
      },
    };

  } catch (error) {
    // Here handle your error
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        ...defaultHeaders
      },
      body: 'Oops! Something went wrong...',
    };
  }
};

export { handler };
