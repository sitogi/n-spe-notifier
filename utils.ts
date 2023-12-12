export function getCurrentJSTDate() {
  const utcDate = new Date();
  const offset = 9;
  const jstDate = new Date(utcDate.getTime() + offset * 60 * 60 * 1000);

  const year = jstDate.getFullYear();
  const month = ("0" + (jstDate.getMonth() + 1)).slice(-2);
  const day = ("0" + jstDate.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
}

export async function sendSlackNotification(url: string, text: string) {
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
}
