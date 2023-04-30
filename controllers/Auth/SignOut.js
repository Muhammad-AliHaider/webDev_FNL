module.exports = {
    terminate: function(req, res) {
        // Clear the cookies

        // Send a success response
        res.json({status: "success", message: "Signed out successfully", data: null});
    }

}