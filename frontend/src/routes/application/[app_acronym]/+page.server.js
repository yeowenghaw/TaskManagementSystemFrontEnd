import axios from "axios";

export async function load({ cookies, params }) {
  // const sessionid = cookies.get('sessionid');
  const token = cookies.get("token");
  const app_acronym = params.app_acronym;

  // try {
  //   const appresponse = await axios({
  //     method: "get",
  //     url: "http://localhost:3000/api/v1/app/",
  //     headers: {
  //       Cookie: token
  //     },
  //     data: {},
  //     withCredentials: true
  //   });

  //   const appdata = appresponse.data;

  //   return { app_acronym };
  // } catch (error) {
  //   console.log("error fetching user data", error);
  //   return {};
  // }
  return { app_acronym };
}
