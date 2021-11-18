import React from "react";
import { Font, renderToStream } from "@react-pdf/renderer";
import AwesomePDF from "../components/AwesomePDF";

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
      />
    );

    // Getting the file name
    const fileName = stream.info.Title;
    console.log("Filename is:", fileName);
  
    // Convert Stream to Buffer
    const buffer = await streamToBuffer(stream);
    console.log(`Rendered PDF in ${new Date() - started}ms`);
  
    // Return your buffer PDF
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/pdf",
        ...defaultHeaders
      },
      isBase64Encoded : true,
      body: buffer.toString('base64'),
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
