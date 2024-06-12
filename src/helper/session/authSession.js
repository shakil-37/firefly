export const setAuth = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};
export const getAuth = () => {
  return localStorage.getItem("user");
};
