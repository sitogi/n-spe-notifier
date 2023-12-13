import { notifyNhkSpecial } from "./nhkProgramNotifier.ts";

Deno.cron("N spe check", "* 23 * * *", async () => {
  await notifyNhkSpecial();
});
