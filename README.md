# Tea Taster

An application for storing tea tasting notes. This application is the output of the three day Ionic Framework Enterprise training. It is also used as the starting point for some of our other product demos such as the demos for Identity Vault and Auth Connect.

## Building

If you would like to build this application yourself, do the following:

- Clone this repo
- `cd tea-taster-vue`
- `npm i`
- `npm run build`
- `ionic cap sync`

At this point, you should be able to either run the application in a dev server via `ionic start` or on a device using `ionic cap open ios` (or `android`).

## Commits

Each step of the training has its own commit within the `main` branch. You should be able to use this information to gather a general idea of the various changes that were needed at each step of the development of this application. However, if code needs to be modified to support later changes (such as a significant change to a dependency), that coding change will only be reflected in later commits, so the commits themselves should only be used as a guide as needed.

## Credentials

This application uses a live backend API that requires a login. Unless you have your own credentials, please use the following:

- **email:** `test@ionic.io`
- **password:** `Ion54321`

## Branches

- `main` - shows the completed `@ionic/vue` three-day Enterprise training project. This project is used as the basis for other trainings
- `feature/identity-vault` - adds `@ionic-enterprise/identity-vault` to the project.
- `feature/auth-connect` - adds `@ionic-enterprise/auth-connect` and `@ionic-enterprise/identity-vault` to the project.

## Ch-ch-ch-changes...

This branch replaces our basic HTML authentication with an OIDC connection using Auth Connect. This shows how easy it is to drop Auth Connect into a project. The major changes are:

- Modify the composable API functions for AC and IV.
  - Update the `useAuth()` composable API.
  - Redefine the "session" stored by the session vault to be the AC `AuthResult`.
- Change the login page.
- Perform some minor tweaks to the logic for obtaining tokens and determining if we are authenticated.

### The Composable Functions

The original `useAuth()` makes HTTP calls, and the `login()` requires an email and password combination. The new `useAuth()` interfaces with Auth Connect to perform those same operations. With OIDC, the user enters their credentials at the OIDC providers site and _not_ in your application. As a result, the `login()` API changes slightly. The `logout()` remains largely the same from a caller's perspective.

The original `useSessionVault()` defined a "session" as a user and a token. With Auth Connect we redefine the session to be an `AuthResult`. This requires a handful of minor typing changes, but otherwise our API abstraction is unchanged.

### The Login Page

The largest change is probably in this page, and it is in a good way. It becomes much more simple. No more collection of data. No more validation. Just a button to push and handle the results of.

### The Guard and Interceptor

The `useAuth()` composable API function exposes two new APIs: `isAuthenticated()` and `getAccessToken()`. These are used in place of directly checking getting this information from the session like we did before. If you take a look in the code, you will also see that these methods also handle the refresh of expired tokens, which ensures the app is accurately accounting for the validity of the authentication session.

Happy Coding!
