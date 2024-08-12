import axios from "axios";

export async function load({ cookies, params }) {
  // const sessionid = cookies.get('sessionid');
  const token = cookies.get("token");
  const app_acronym = params.app_acronym;
  return { app_acronym };
}
