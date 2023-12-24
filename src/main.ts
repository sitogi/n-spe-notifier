import { getProgramList } from "~/nhk/api.ts";
import { sendSlackNotification } from "~/slack/api.ts";
import { getCurrentJSTDate } from "~/utils/utils.ts";

Deno.cron("N spe check", "0 23 * * *", async () => {
  await notifyNhkSpecial();
});

// for Local Debug
// notifyNhkSpecial();

async function notifyNhkSpecial() {
  const apiKey = Deno.env.get("API_KEY");
  const slackWebhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");
  if (!apiKey || !slackWebhookUrl) {
    throw new Error("No API_KEY or SLACK_WEBHOOK_URL in .env file");
  }

  try {
    const list = await getProgramList(["g1", "s1"], getCurrentJSTDate(), apiKey);

    // N spe
    const nhkProgramList = list.g1;
    const titles = nhkProgramList.filter((program) => program.title.includes("ＮＨＫスペシャル"));
    await sendSlackNotification(
      slackWebhookUrl,
      titles.length > 0 ? titles[0].title : "今日は「NHKスペシャル」は放送しません。"
    );

    // cosmic front
    const bs1ProgramList = list.s1;
    const bs1Titles = bs1ProgramList.filter((program) => program.title.includes("コズミックフロント"));
    await sendSlackNotification(
      slackWebhookUrl,
      bs1Titles.length > 0 ? bs1Titles[0].title : "今日は「コズミックフロント」は放送しません。"
    );
  } catch (e) {
    await sendSlackNotification(slackWebhookUrl, e instanceof Error ? e.message : "unexpected error");
  }
}
