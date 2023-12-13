import { notifyNhkSpecial } from "./nhkProgramNotifier.ts";

Deno.cron("N spe check", "* 23 0 0 0", async () => {
  await notifyNhkSpecial();
});
