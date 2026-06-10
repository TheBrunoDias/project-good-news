/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "daily-good-news",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: input?.stage === "production",
      home: "aws",
      providers: {
        aws: {
          profile: input.stage === "production" ? "dev.brunosd+prod" : "dev.brunosd-dev"
        }
      },
    };
  },
  async run() {
    const newsApiKey = new sst.Secret("NewsApiKey");
    const geminiApiKey = new sst.Secret("GeminiApiKey");
    const databaseUrl = new sst.Secret("DatabaseUrl");

    const collector = new sst.aws.Function("NewsCollector", {
      handler: "apps/api/src/handler.handler",
      runtime: "nodejs24.x",
      timeout: "5 minutes",
      memory: "512 MB",
      link: [newsApiKey, geminiApiKey, databaseUrl],
    });

    new sst.aws.CronV2("NewsCron", {
      function: collector,
      schedule: "cron(0 0,12 * * ? *)",
    });
  },
});
