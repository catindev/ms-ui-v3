module.exports = (request, response, next) => {
    const { path, method } = request
    if (path === '/login' && method === 'GET') return next()
    
    const { msid } = request.cookies
    if (!msid) return response.sendFile(__dirname + '/static/login/template.html');
    
    next()
}