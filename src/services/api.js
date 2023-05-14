import axios from "../utils/axios-customize";

export const callRegister = (fullName, email, password, phone) => {
  return axios.post("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};

export const callLogin = (username, password) => {
  return axios.post("/api/v1/auth/login", { username, password });
};

export const callFetchAccount = () => {
  return axios.get("/api/v1/auth/account");
};


export const callLogout = () => {
  return axios.post('/api/v1/auth/logout')
}

export const callFetchListUser = (query) =>{
  return axios.get(`/api/v1/user?${query}`)
}

export const callCreateUser = (fullName, password, email, phone) =>{
  return axios.post('/api/v1/user',{ fullName, password, email, phone });
}
export const callBulkCreateUsers = (data) =>{
  return axios.post('/api/v1/user/bulk-create', data);
}
export const callUpdateUser = (_id, fullName, phone,avatar ) =>{
  return axios.put('/api/v1/user', {_id, fullName, phone, avatar })
    .then(response => {
      // Xử lý response nếu cần
      return response.data;
    })
    .catch(error => {
      // Xử lý error nếu cần
      throw error;
    });
}

export const callDeleteUser =(_id) =>{
  return axios.delete(`/api/v1/user/${_id}`)
}