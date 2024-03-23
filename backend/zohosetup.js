require("dotenv").config({ path: "./config/config.env" });

// clientid
// secret

// get code
if (process.argv[2] == "1") {
  console.log(
    `
        https://accounts.zoho.com/oauth/v2/auth?client_id=${process.env.ZOHO_CLIENT_ID}&response_type=code&redirect_uri=http://localhost&scope=ZohoMail.organization.accounts.UPDATE,ZohoMail.organization.accounts.READ&access_type=offline
        `
  );
}

// get refresh toekn

// POST
if (process.argv[2] == "2")
  console.log(`

https://accounts.zoho.com/oauth/v2/token?client_id=${process.env.ZOHO_CLIENT_ID}&redirect_uri=http://localhost&client_secret=${process.env.ZOHO_CLIENT_SECRET}&scope=ZohoMail.organization.accounts.UPDATE,ZohoMail.organization.accounts.READ&grant_type=authorization_code&code=${process.argv[3]}
`);

// get access toekn
// POST https://accounts.zoho.com/oauth/v2/token?
// refresh_token=process.env.ZOHO_REFRESH_TOKEN
// &grant_type=refresh_token
// &client_id=ZOHO_CLIENT_ID
// &client_secret=ZOHO_CLIENT_SECRET
// &redirect_uri=http://localhost
// &scope=ZohoMail.organization.accounts.UPDATE,ZohoMail.organization.accounts.READ
