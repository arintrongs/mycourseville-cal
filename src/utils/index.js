export const withBackendUrl = path => {
  if (process.env.NODE_ENV === "production") {
    return `https://mycoursevillecal.tk:8443${path}`
  } else {
    return `http://localhost:3003${path}`
  }
}
export const withCalendarUrl = path => {
  if (process.env.NODE_ENV === "production") {
    return `http://mycoursevillecal.tk${path}`
  } else {
    return `http://localhost:3003${path}`
  }
}
