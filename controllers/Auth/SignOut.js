module.exports = {
    terminate: function(req, res) {
        // Clear the cookies
        res.clearCookie('jwt');
        res.clearCookie('acc');

        // Send a success response
        res.json({status: "success", message: "Signed out successfully", data: null});
    }

}