import { redirect } from "@sveltejs/kit";
import axios from "axios";

export async function load({ cookies }) {
  // const sessionid = cookies.get('sessionid');
  const token = cookies.get("token");
  // Check if token is null or empty string
  if (!token) {
    console.log("token doesnt exist");
    return {};
  }

  // Token has a valid value, return it
  return { token };
}
