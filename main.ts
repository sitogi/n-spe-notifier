import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
import { ProgramListResponse } from "./nhkApiTypes.ts";
import { getCurrentDate } from "./utils.ts";

const env = await load();
const apiKey = env["API_KEY"];
const currentDate = getCurrentDate();

const requestUrlWithoutKey = `https://api.nhk.or.jp/v2/pg/list/130/g1/${currentDate}.json`;

console.log({ requestUrlWithoutKey });

const response = await fetch(`${requestUrlWithoutKey}?key=${apiKey}`);
const data: ProgramListResponse = await response.json();
const nhkProgramList = data.list.g1;

const titleList = nhkProgramList.filter((program) => program.title.includes("ＮＨＫスペシャル"));

console.log(titleList.length > 0 ? titleList[0].title : "ＮＨＫスペシャルはありません");
