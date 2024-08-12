import axios from "axios";

export async function load({ cookies }) {
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

    const groupdata = groupresponse.data;

    return { groupdata };
  } catch (error) {
    console.log("error fetching user data", error);
    return {};
  }
  return {};
}
