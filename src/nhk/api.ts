import "https://deno.land/std@0.208.0/dotenv/load.ts";
import { deepMerge } from "https://deno.land/std@0.209.0/collections/mod.ts";
import { ProgramListResponse, Service } from "~/nhk/types.ts";

export async function getProgramList(services: Service[], jstDateStr: string, apiKey: string) {
  const tasks = services.map(async (service) => {
    const requestUrlWithoutKey = `https://api.nhk.or.jp/v2/pg/list/130/${service}/${jstDateStr}.json`;
    console.log({ requestUrlWithoutKey });

    const response = await fetch(`${requestUrlWithoutKey}?key=${apiKey}`);
    const data: ProgramListResponse = await response.json();
    console.log(data);

    if (data.error) {
      throw new Error(
        `NHK API がエラーを返しました。エラーコード: ${data.error.code} エラーメッセージ: ${data.error.message}`
      );
    }

    return data.list;
  });

  const lists = await Promise.all(tasks).catch((e) => {
    throw e;
  });

  return lists.reduce((acc, list) => deepMerge(acc, list), { g1: [], s1: [] });
}
