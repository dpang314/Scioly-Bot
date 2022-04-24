const login = () => {
    window.location.href = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/auth/discord' : '/auth/discord';
}

const logout = () => {
    
}

export { login };
