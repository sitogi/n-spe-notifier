import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
import { ProgramListResponse } from "./nhkApiTypes.ts";
import { getCurrentDate, sendSlackNotification } from "./utils.ts";

const env = await load();
const apiKey = env["API_KEY"];
const slackWebhookUrl = env["SLACK_WEBHOOK_URL"];
if (!apiKey || !slackWebhookUrl) {
  throw new Error("No API_KEY or SLACK_WEBHOOK_URL in .env file");
}

const currentDate = getCurrentDate();
const requestUrlWithoutKey = `https://api.nhk.or.jp/v2/pg/list/130/g1/${currentDate}.json`;

console.log({ requestUrlWithoutKey });

const response = await fetch(`${requestUrlWithoutKey}?key=${apiKey}`);
const data: ProgramListResponse = await response.json();
const nhkProgramList = data.list.g1;

const titleList = nhkProgramList.filter((program) => program.title.includes("ＮＨＫスペシャル"));

await sendSlackNotification(
  slackWebhookUrl,
  titleList.length > 0 ? titleList[0].title : "今日は NHK スペシャルは放送しません。"
);
