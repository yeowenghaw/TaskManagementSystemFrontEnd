import { redirect } from "@sveltejs/kit";
import axios from "axios";

export async function load({ cookies }) {
  const token = cookies.get("token");

  try {
    const response = await axios({
      method: "get",
      url: `http://localhost:3000/api/v1/users/user`,
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
