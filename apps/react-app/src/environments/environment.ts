// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment = {
  apikey:'f91c3ea0',
  contact_candidate:'mailto:a.lee.intl@gmail.com',
  production: false,

  // dev only : enabling it will always cause a fetching error.
  force_error: false, // only the search results
  force_error_detail: false, // only the detail window

  // dev only : enabling it will cause an infinite loading time.
  force_loading: false, // only the search results
  force_loading_detail: false, // only the detail window
};
