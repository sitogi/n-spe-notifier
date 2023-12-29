import { getProgramList } from "~/nhk/api.ts";
import { sendSlackNotification } from "~/slack/api.ts";
import { getCurrentJSTDate } from "~/utils/utils.ts";

Deno.cron("N spe check", { hour: { every: 20 } }, async () => {
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
    const titlesToNotify = [];

    // N spe
    const nhkProgramList = list.g1;
    const titles = nhkProgramList.filter((program) => program.title.includes("ＮＨＫスペシャル"));
    titles[0]?.title && titlesToNotify.push(titles[0].title);

    // cosmic front
    const bs1ProgramList = list.s1;
    const bs1Titles = bs1ProgramList.filter((program) => program.title.includes("コズミックフロント"));
    bs1Titles[0]?.title && titlesToNotify.push(bs1Titles[0].title);

    const tasks = titlesToNotify.map((title) => sendSlackNotification(slackWebhookUrl, title));
    await Promise.all(tasks);
  } catch (e) {
    await sendSlackNotification(slackWebhookUrl, e instanceof Error ? e.message : "unexpected error");
  }
}
