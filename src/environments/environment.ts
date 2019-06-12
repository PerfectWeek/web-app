// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    // url: "http://localhost:9090/",
    // apiEndpoint: 'http://localhost:9090/',
    url: 'https://perfect-week-test.herokuapp.com/',
    apiEndpoint: 'https://perfect-week-test.herokuapp.com/',
    appName: 'PerfectWeek',
    google_client_id: '801780005342-ot6i9l8t9t2lo3fcg0o9co4q8m80ns3d.apps.googleusercontent.com',
    facebook_client_id: '826928231016562'
};
