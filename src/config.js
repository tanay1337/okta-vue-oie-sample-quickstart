const CLIENT_ID = "0oajbeeiqlFaGT1c05d7";
const ISSUER = "https://dev-26142759.okta.com/oauth2/default";
const REDIRECT_URI = `${window.location.origin}/login/callback`;

export default {
  clientId: CLIENT_ID,
  issuer: ISSUER,
  redirectUri: REDIRECT_URI,
  scopes: ["openid", "profile", "email", "offline_access"],
  pkce: true,
};
