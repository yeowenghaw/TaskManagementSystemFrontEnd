import axios from "axios";

export async function load({ cookies, params }) {
  // const sessionid = cookies.get('sessionid');
  const token = cookies.get("token");

  try {
    const groupresponse = await axios({
      method: "get",
      url: `http://localhost:3000/api/v1/groups`,
      headers: {
        Cookie: token
      },
      withCredentials: true
    });

    const appresponse = await axios({
      method: "get",
      url: "http://localhost:3000/api/v1/app",
      headers: {
        Cookie: token
      },
      data: {
        app_acronym: params.app_acronym
      },
      withCredentials: true
    });

    const groupdata = groupresponse.data;
    const appdata = appresponse.data;

    return { groupdata, appdata };
  } catch (error) {
    console.log("error fetching user data", error);
    return {};
  }
  return {};
}
