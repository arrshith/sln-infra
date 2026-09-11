import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 3,
  timeout: 180000,
  expect: { timeout: 10000 },
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env.CHROME_EXECUTABLE
          ? { launchOptions: { executablePath: process.env.CHROME_EXECUTABLE } }
          : {}),
      },
    },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    ...(process.env.EDGE_EXECUTABLE
      ? [
          {
            name: "edge",
            use: {
              ...devices["Desktop Edge"],
              launchOptions: { executablePath: process.env.EDGE_EXECUTABLE },
            },
          },
        ]
      : []),
  ],
  webServer: [
    {
      command: "npm run start -- --port 3100",
      url: "http://localhost:3100",
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
    {
      command: "npm run start -- --port 3101",
      url: "http://localhost:3101",
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
      env: {
        ENQUIRY_WEBHOOK_URL: "https://example.invalid/test-only",
        ENQUIRY_WEBHOOK_SECRET: "test-only",
      },
    },
  ],
});
