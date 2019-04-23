export const withBackendUrl = path => {
  if (process.env.NODE_ENV === "production") {
    return `https://mycoursevillecal.firebaseapp.com/api${path}`
  } else {
    return `http://localhost:3003${path}`
  }
}
