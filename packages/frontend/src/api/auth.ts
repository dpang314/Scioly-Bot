const login = () => {
  window.location.href =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5001/auth/discord'
      : '/auth/discord';
};

const logout = () => {
  fetch('/auth/logout', {
    method: 'POST',
  });
};

const getUser = async () => {
  return await fetch('/auth/discord/user');
};

export {login, logout, getUser};
