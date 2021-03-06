const login = () => {
  window.location.href =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5001/api/auth/discord'
      : '/api/auth/discord';
};

const logout = async () => {
  await fetch('/api/auth/logout', {
    method: 'POST',
  });
  window.location.href =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : '/';
};

const getUser = async () => {
  return await fetch('/api/auth/discord/user');
};

export {login, logout, getUser};
