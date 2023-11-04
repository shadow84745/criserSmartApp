export const  uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      const xhr = new XMLHttpRequest();
  
      xhr.onload = function () {
        resolve(xhr.response);
      };
  
      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"));
      };
  
      xhr.responseType = "blob";
  
      xhr.open("GET", uri, true);
  
      xhr.send(null);
    });
  };
  
  export const getImageExtension = (uri) => {
    const imgCopy = uri.slice();
    const extension = imgCopy.split("/").pop().split(".").pop();
    return extension;
  };