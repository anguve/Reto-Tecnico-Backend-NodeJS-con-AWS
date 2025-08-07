const init = async () => {
  try {
    console.log('Application initialized successfully');
  } catch (error) {
    console.log('Failed to initialize application:', error);
    process.exit(1);
  }
};

init();
