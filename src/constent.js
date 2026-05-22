const DB_NAME = "myTube";
const LIMITE_DATA = "16kb";
const HASH_ROUND = 12;
export { DB_NAME, LIMITE_DATA, HASH_ROUND };
export const Option = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  domain: "localhost",
  path: "/",
};
