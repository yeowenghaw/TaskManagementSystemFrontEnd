import { redirect } from "@sveltejs/kit";
import axios from "axios";
import { decodeToken, extractToken } from "../../lib/utility/jwttoken.js";

export async function load({ cookies }) {
  const token = cookies.get("token");
  //console.log(token);
  // Check if token is null or empty string
  const token_string = await extractToken(token);
  //console.log(token_string);
  const decoded_token = await decodeToken(token_string);
  //console.log(decoded_token);

  try {
    const response = await axios({
      method: "get",
      url: `http://localhost:3000/api/v1/users/user/${decoded_token.username}`,
      headers: {
        Cookie: token
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return {};
  }
  return {};
}
