import axios from "axios";
import ErrorHandler from "../components/controls/ErrorHandler/ErrorHandler";
export default {
  name: "ServiceHelper",
  getURI() {
    localStorage.getItem("endpoint")
  },
  getMethod(module, params) {
    params.token = localStorage.getItem("token");
    return axios.get(module, { params: params });
  },
  postMethod(module, reqBody) {
    return axios.post(
      module + "?token=" + localStorage.getItem("token"),
      reqBody
    )
  },
  putMethod(module, reqBody) {
    let token = localStorage.getItem("token");
    return axios.put(module + "?token=" + token, reqBody);
  },
  deleteMethod(module) {
    let token = localStorage.getItem("token");
    return axios.delete(module + "?token=" + token);
  },
  uploadMethod(formData) {
    return axios.post(
      "fileupload/upload?token=" + localStorage.getItem("token"),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: progressEvent => {
          if (progressEvent.lengthComputable) {
            console.log(progressEvent.loaded + " " + progressEvent.total);
          }
        }
      }
    );
  },
  downloadMobileMethod(fileId) {
    let url = this.getEndPoint() + "/file/" + fileId;
    let token = localStorage.getItem("token");
    window.open(url + "?token=" + token, '_blank');
  },
  downloadMethod(fileId) {
    let params = {};
    params.token = localStorage.getItem("token");
    return axios({
      url: "file/" + fileId,
      method: "GET",
      responseType: "blob", // important
      params: params
    });
  },
  downloadCompress(arr, compressFormat) {
    let params = {};
    params.files = arr;
    params.compressFormat = compressFormat;
    params.token = localStorage.getItem("token");
    return axios({
      url: "compress/download",
      method: "GET",
      responseType: "blob",
      params: params
    });
  },
  getEndPoint() {
    return axios.defaults.baseURL;
  },
  totpAuth(module, reqBody) {
    return axios.post(
      module + "?totptoken=" + localStorage.getItem("totptoken"),
      reqBody
    )
  },
};
