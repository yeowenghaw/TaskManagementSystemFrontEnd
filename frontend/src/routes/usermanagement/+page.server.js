import { redirect } from "@sveltejs/kit";
import axios from "axios";
import { decodeToken, extractToken } from "../../lib/utility/jwttoken.js";

export async function load({ cookies }) {
  // const sessionid = cookies.get('sessionid');
  const token = cookies.get("token");

  try {
    const response = await axios({
      method: "get",
      url: `http://localhost:3000/api/v1/users`,
      headers: {
        Cookie: token
      },
      withCredentials: true
    });

    const usergroupresponse = await axios({
      method: "get",
      url: `http://localhost:3000/api/v1/groups/usergroups`,
      headers: {
        Cookie: token
      },
      withCredentials: true
    });

    const groupresponse = await axios({
      method: "get",
      url: `http://localhost:3000/api/v1/groups`,
      headers: {
        Cookie: token
      },
      withCredentials: true
    });

    const userdata = response.data;
    const groupdata = groupresponse.data;
    const usergroupdata = usergroupresponse.data;

    // return {
    //   response,
    //   groupresponse
    // };
    //return response.data;
    // return groupresponse.data;
    return { userdata, groupdata, usergroupdata };
  } catch (error) {
    //console.log("error fetching user data", error);
    return {};
    // return {
    //   props: {
    //     user: null,
    //     error: "error fetching user data"
    //   }
    // };
  }
  return {};
}
