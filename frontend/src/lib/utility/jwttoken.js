import jwt from "jsonwebtoken";

// Function to decode JWT
const decodeToken = async token => {
  try {
    return await jwt.decode(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const extractToken = async cookiestring => {
  // Find the position of the token part, which ends before the first semicolon
  const tokenEndIndex = cookiestring.indexOf(";");

  const tokenStartIndex = cookiestring.indexOf('"');
  const token = tokenEndIndex !== -1 ? cookiestring.slice(tokenStartIndex + 1, tokenEndIndex) : cookiestring;
  // second slicing, removing the additional options attatched
  const secondpass = token.split("=")[0];
  return secondpass;
};

export { decodeToken, extractToken };
