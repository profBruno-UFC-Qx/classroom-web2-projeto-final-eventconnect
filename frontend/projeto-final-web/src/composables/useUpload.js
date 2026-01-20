import { BASE_URL } from "@/api";

function getUploadPath(path) {
  return `${BASE_URL}${path}`
}

export const useUpload = () => getUploadPath
