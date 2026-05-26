async function withDbErrorHandling(ErrorHendler) {
  try {
    return await ErrorHendler();
  } catch (error) {
    console.error("DB ERROR:", error.message);
    throw error; // upar bhejo
  }
}

export default withDbErrorHandling;
