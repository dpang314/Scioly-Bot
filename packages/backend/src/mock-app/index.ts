import createMockApp from './app';

const port = process.env.PORT || 5001;

createMockApp().then(({mockApp}) => {
  mockApp.listen(port, async () => {
    console.log(
      `Mock app (does not require authentication) listening at http://localhost:${port}`,
    );
  });
});
