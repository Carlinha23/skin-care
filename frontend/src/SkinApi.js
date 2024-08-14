import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "https://skin-care-backend.onrender.com";


class SkinApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    // Log the token being used
    console.debug("Authorization Token:", SkinApi.token);

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
      // Store the token
      SkinApi.token = res.data.token;
      // Log the token
      console.debug("Logged-in Token:", SkinApi.token);
      return SkinApi.token;
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

  /** Create a new review. */
  static async createReview(data) {
    try {
      let res = await this.request('api/reviews', data, 'post');
      return res.review;
    } catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  }

  /** Get all reviews or filtered by category. */
  static async getReviews(category) {
    try {
      let res = await this.request('api/reviews', { category }, 'get');
      return res.reviews;
    } catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  }

  /** Get a single review by ID. */
  static async getReview(id) {
    try {
      let res = await this.request(`api/reviews/${id}`, {}, 'get');
      return res.review;
    } catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  }

  /** Create a new category. */
  static async createCategory(data) {
    try {
      let res = await this.request('api/categories', data, 'post');
      return res.category;
    } catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  }

  /** Get all categories. */
  static async getCategories() {
    try {
      let res = await this.request('api/categories', {}, 'get');
      return res.categories;
    } catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  }

  /** Get a single category by ID. */
  static async getCategory(id) {
    try {
      let res = await this.request(`api/categories/${id}`, {}, 'get');
      return res.category;
    } catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  }

  /** Update a category by ID. */
  static async updateCategory(id, data) {
    try {
      let res = await this.request(`api/categories/${id}`, data, 'patch');
      return res.category;
    } catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  }

  /** Delete a category by ID. */
  static async deleteCategory(id) {
    try {
      await this.request(`api/categories/${id}`, {}, 'delete');
      return { deleted: id };
    } catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  }
}

export default SkinApi; 



    
