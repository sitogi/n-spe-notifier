import "https://deno.land/std@0.208.0/dotenv/load.ts";
import { ProgramListResponse } from "./nhkApiTypes.ts";
import { getCurrentJSTDate, sendSlackNotification } from "./utils.ts";

Deno.cron("N spe check", "* * * * *", async () => {
  const apiKey = Deno.env.get("API_KEY");
  const slackWebhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");
  if (!apiKey || !slackWebhookUrl) {
    throw new Error("No API_KEY or SLACK_WEBHOOK_URL in .env file");
  }

  const currentDate = getCurrentJSTDate();
  const requestUrlWithoutKey = `https://api.nhk.or.jp/v2/pg/list/130/g1/${currentDate}.json`;

  console.log({ requestUrlWithoutKey });

  const response = await fetch(`${requestUrlWithoutKey}?key=${apiKey}`);
  const data: ProgramListResponse = await response.json();
  console.log(data);

  if (data.error) {
    await sendSlackNotification(
      slackWebhookUrl,
      `NHK API がエラーを返しました。エラーコード: ${data.error.code} エラーメッセージ: ${data.error.message}`
    );
    return;
  }

  const nhkProgramList = data.list.g1;
  const titleList = nhkProgramList.filter((program) => program.title.includes("ＮＨＫスペシャル"));

  await sendSlackNotification(
    slackWebhookUrl,
    titleList.length > 0 ? titleList[0].title : "今日は NHK スペシャルは放送しません。"
  );
});
