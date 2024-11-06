
class Utils {
    success = (code = 200, msg='success',data={}) => {
        return {
            status: true,
            message: msg,
            success_code: code,
            data:data
        }
    }
 
}

module.exports = new Utils();
