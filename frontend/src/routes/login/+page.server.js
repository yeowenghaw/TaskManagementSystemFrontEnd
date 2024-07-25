import { fail, redirect } from "@sveltejs/kit";
import axios from "axios";

const formDataToObject = formData => {
  const object = {};
  formData.forEach((value, key) => {
    object[key] = value;
  });
  return object;
};

export const actions = {
  login: async ({ cookies, request }) => {
    var success = false;
    try {
      const data = await request.formData();

      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/users/login",
        data: formDataToObject(data)
      });
      const receivingcookies = response.headers["set-cookie"];
      // extracting only token information from cookie

      const cookieString = JSON.stringify(receivingcookies);

      // Split by '; ' to separate cookie attributes
      const cookieParts = cookieString.split("; ");

      // Find the part that starts with '["token='
      let tokenValue = "";
      for (let part of cookieParts) {
        if (part.startsWith('["token=')) {
          tokenValue = part.substring(8); // Remove 'token=' prefix
          break;
        }
      }
      cookies.set("token", tokenValue, { path: "/" });
      success = true;
    } catch (error) {
      return error.response.data;
    }
    // redirection is done over here because redirecting will trigger the catch error block, 
    throw redirect(303, "/");
  }
};
