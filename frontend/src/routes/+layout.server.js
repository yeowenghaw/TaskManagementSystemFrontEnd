import { fail } from "@sveltejs/kit";
import axios from "axios";

// can access cookies from here
export async function load({ cookies }) {
  // const sessionid = cookies.get('sessionid');
  const token = cookies.get("token");
  // Check if token is null or empty string
  if (!token) {
    return {};
  }

  // Token has a valid value, return it
  return { token };
}
