class Utils {
    success = (code = 200, msg = 'success', data = {}) => {
        return {
            status: true,
            message: msg,
            success_code: code,
            data: data
        }
    }

    failed = (code = 400, msg = 'failed', data = {}) => {
        return {
            status: false,
            message: msg,
            success_code: code,
            data: data
        }
    }

}

module.exports = new Utils();