export const withBackendUrl = path => {
  if (process.env.NODE_ENV === "production") {
    return `https://35.240.202.97${path}`
  } else {
    return `http://localhost:3003${path}`
  }
}
