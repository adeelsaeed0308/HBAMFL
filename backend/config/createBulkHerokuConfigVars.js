d = `NODE_ENV=development`; //your config
d = d.split("\n").map((e) => e.split("="));
token = JSON.parse(localStorage.getItem("ember_simple_auth-session"))
  .authenticated.access_token;
async function v() {
  if (!app) {
    return console.log("find app id in network tab ");
  }
  if (!token) {
    return console.log("find token id in network tab ");
  }
  for (let e of d) {
    if (e.length != 2) continue;
    await fetch(`https://api.heroku.com/apps/${app}/config-vars`, {
      headers: {
        accept: "application/vnd.heroku+json; version=3",
        "accept-language": "en-US,en;q=0.9,he-IL;q=0.8,he;q=0.7",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-heroku-requester": "dashboard",
      },
      referrer: "https://dashboard.heroku.com/",
      referrerPolicy: "origin",
      body: `{"${e[0]}":"${e[1]}"}`,
      method: "PATCH",
      mode: "cors",
    });
  }
}
v();
