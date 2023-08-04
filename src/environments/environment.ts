export const environment = {
  production: (window as any).process?.env.production || false,
  // API_URL: (window as any).process?.env.API_URL || 'https://pinkast.biz/api/',
  API_URL: (window as any).process?.env.API_URL || 'https://uat.click.nng.bz/api/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
