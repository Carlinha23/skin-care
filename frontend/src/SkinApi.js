import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class SkinApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${SkinApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // // Individual API routes

  // /** Get all companies. */
  // static async getCompanies() {
  //   let res = await this.request(`companies`);
  //   return res.companies;
  // }

  // /** Get details on a company by handle. */

  // static async getCompany(handle) {
  //   let res = await this.request(`companies/${handle}`);
  //   return res.company;
  // }

  // /** Get all jobs. */
  // static async getJobs() {
  //   let res = await this.request(`jobs`);
  //   return res.jobs;
  // }

  // /** Get details on a job by ID. */
  // static async getJob(id) {
  //   let res = await this.request(`jobs/${id}`);
  //   return res.job;
  // }

   /** Register a new user and return the token. */
   static async register(data) {
    try {
      let res = await axios.post(`${BASE_URL}/auth/register`, data);
      return res.data.token;
    } catch (err) {
      console.error("API Error:", err.response.data);
      throw err.response.data.error.message;
    }
  }

  /** Login an existing user and return the token. */
  static async login(data) {
    try {
      let res = await axios.post(`${BASE_URL}/auth/token`, data);
      return res.data.token;
    } catch (err) {
      console.error("API Error:", err.response.data);
      throw err.response.data.error.message;
    }
  }

  /** Update user profile. */
  static async updateUser(username, data) {
    try {
      let res = await axios.patch(`${BASE_URL}/users/${username}`, data, {
        headers: { Authorization: `Bearer ${SkinApi.token}` }
      });
      return res.data.user;
    } catch (err) {
      console.error("API Error:", err.response.data);
      throw err.response.data.error.message;
    }

    
    }

    // static async getUserProfile(username) {
    //     try {
    //       let res = await this.request(`users/${username}`); // Adjust the endpoint as per your API
    //       return res.user; // Assuming the response structure includes `user` field
    //     } catch (err) {
    //       console.error("API Error:", err.response.data);
    //       throw err.response.data.error.message;
    //     }
    //   }

    // // Add this method to the JoblyApi class
    // static async applyToJob(username, jobId) {
    //  try {
    //     let res = await axios.post(
    //         `${BASE_URL}/users/${username}/jobs/${jobId}`,
    //         {},
    //         {
    //         headers: { Authorization: `Bearer ${SkinApi.token}` }
    //         }
    //     );
    //     return res;
    //     } catch (err) {
    //     console.error("API Error:", err.response.data);
    //     throw err.response.data.error.message;
    //     }
    // }
  
  // obviously, you'll add a lot here ...
}

export default SkinApi; 
// for now, put token ("testuser" / "password" on class)
//JoblyApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
    //"SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
    //"FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";


    
