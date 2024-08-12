import axios from "axios";

export async function load({ cookies }) {
  // const sessionid = cookies.get('sessionid');
  const token = cookies.get("token");

  try {
    const applicationresponse = await axios({
      method: "get",
      url: `http://localhost:3000/api/v1/allapps`,
      headers: {
        Cookie: token
      },
      withCredentials: true
    });

    const applicationdata = applicationresponse.data;

    return { applicationdata };
  } catch (error) {
    console.log("error fetching user data", error);
    return {};
  }
  return {};
}
