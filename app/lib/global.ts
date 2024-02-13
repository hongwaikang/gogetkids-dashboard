let authToken: string | null = null;
let schoolName: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setSchoolName(name: string | null) {
  schoolName = name;
}

export function getAuthToken() {
  return authToken;
}

export function getSchoolName() {
  return schoolName;
}
