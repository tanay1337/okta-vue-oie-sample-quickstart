# Okta Vue Application

A sample Vue application that uses [Okta Auth JavaScript SDK](https://github.com/okta/okta-auth-js) for implementing login, password recovery, and registration functionalities. This app supports (tested):

* Login with username/password
* Login with username/password + Email code or Magic Link
* Recover password
* Registration with Google authenticator, security question, email factor
* Okta Verify

Not supported

* Social login

## Getting started

To install this example application, run the following commands:

```
git clone https://github.com/okta-samples/okta-vue-oie-sample-quickstart.git
cd okta-vue-oie-sample-quickstart
```

Before running this sample, you will need an Okta Developer Account. Create one using `okta register`, or configure an existing one with `okta login`.

### Create the Application in Okta

1. Login to your Okta Admin dashboard, e.g. (https://my-account-admin.okta.com/admin/dashboard)
2. Enable widget sign-in for your account
   * Navigate to `Settings > Account > Embedded widget sign-in support`.
   * Click `Edit`.
   * Select `Interaction Code`.
   * Click `Save`.
3. Navigate to `Applications > Applications` in the left-hand menu.
4. Click `Create App Integration`.
5. For `Sign-in method` select `OIDC - OpenID Connect` and for `Application Type` select `Single-Page Application`. Click `Next`.
6. Use the following values for application info:
    * For `App integration name` use `okta-vue-oie-sample-quickstart`.
    * Under `Grant type > Core grants` select `Authorization Code` and `Refresh Token`. Then click `Advanced` and select `Integration Code`.
    * Under `Assignments > Controlled access` select `Allow everyone in your organization to access`.
      * Leave `Enable immediate access with Federation Broker Mode` selected.
    * Leave all other values as default.
7. Verify the custom authorization server uses the `Integration Code` grant type:
   * Navigate to `Security > API`.
   * Under `Authorization Servers` locate the `default` server and click the `Edit` icon.
   * Open the `Access Policies` tab, locate the `Default Policy Rule` rule, and click the `Edit` icon.
   * Under `IF Grant type is` click `Advanced` and ensure `Interaction Code` is selected.
     * If the `Interaction Code` checkbox does not appear, ensure you have enabled the `Interaciton Code` grant type in Step 2.
   * Click `Update rule` to save.
8. Add the ability for users to register new accounts through your app.
   * Navigate to `Security > Profile Enrollment`.
   * Click `Add Profile Enrollment Policy`.
   * For `Name` use `Okta Vue Self Service` and click `Save`.
   * Click the `Edit` icon for the newly added policy.
   * Ensure the following values:
     * `Self-service registration: Allowed`.
     * `Progressive Profiling: Enabled`.
     * `Email verification: Required before access is granted`.
   * Click `Manage apps`
   * Click `Add an App to This Policy`
   * Find this app (`okta-vue-oie-sample-quickstart`) and click `Apply`.

### Set the application config

In your project open the file `src/config.js` and apply the following values:
* Set `CLIENT_ID` to the value in your Okta admin application config at `General > Client Credentials > Client ID`.
* Set `ISSUER` to `https://{yourOktaDomain}/oauth2/default`
  * E.g. `https://my-account.okta.com/oauth2/default`

### Install dependencies and run the app

To install the dependencies and start the app, run the following commands:

```
npm install
npm run serve
```

## Run unit tests

```
npm run test:unit
```

## Help

Please post any questions as comments on our [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).
