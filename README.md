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

This branch introduces the use of Identity Vault in an existing application. We will not go into details here. It is best to look at the code for that. We _will_ cover the changes at a high level, though.

### The Composable Functions

The `useSession()` composable API, which provided a means to manage the session, storing it via the Capacitor Preferences plugin, is replaced by `useSessionVault()`.

The basic API (`setSession`, `getSession`, `clearSession`) remains the same. With `useSessionVault()`, the API expands to include methods specific to operating with a vault (set the unlock mode, determine which modes are available for use, etc).

### The Unlock Page

An Unlock Page is added for use when the vault is locked. It gives the user the option of unlocking the application or just logging in again.

### The Startup Flow

Without Identity Vault, the startup logic looked like this:

- Attempt to go to the Tea List page.
- If no session exists, the auth guard redirects the user to the login page.
- If a session exists but is expired, getting data on the Tea List page results in a 401 error and the user is redirected to the login page.

With Identity Vault, the vault may be locked, in which case the user should be redirected to the Unlock Page.

- Open the Start page.
- If the vault is locked, the Start Page redirects the user to the Unlock page.
- If the vault is not locked, the Start Page redirects the user to the Tea List page, at which the flow is the same as before:
  - Attempt to go to the Tea List page.
  - If no session exists, the auth guard redirects the user to the login page.
  - If a session exists but is expired, getting data on the Tea List page results in a 401 error and the user is redirected to the login page.

### The PIN Dialog

Identity Vault supports a Custom Passcode vault that does not use any of the device's security features to encrypt the data. Instead, we must supply our own mechanism for supplying a passcode to lock and unlock the vault. This mode should _only_ be used if a device locking mechanism is not available (that is, the user has not set a system PIN and by extension has also not set up biometrics).

### Configuring the Vault

When the user logs in, the vault is in `Secure Storage` mode, which will securely store the session, but will never lock. This is the default baseline mode used by this app for _every_ login.

If a user wants to use some method of locking, they _must_ go to the About Page, open the Preferences dialog, and select an appropriate combination of locking methods:

- Biometrics
- System Passcode
- Biometrics AND System Passcode
- Custom Passcode
- None (which is just Secure Storage again)

The vault will remember the setting until the user logs out or otherwise clears the vault. That is, any new login results in a `Secure Storage` vault. You can easily modify that behaviour. For example, you _could_ automatically choose the "best" setting on login, or save the prior settings in Preferences. That is 100% up to you.

Happy Coding!
