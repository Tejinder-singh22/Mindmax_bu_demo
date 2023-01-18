//Error is default class in node for error handling
class ErrorHandler extends Error{  //basically we can use this class to pass our custom error messages and statuses also. this automatically add err to req and send res accordingly using middleware
    constructor(statusMessage,statusCode){
        super(statusMessage) // access constructor of Error Class ... Remember this statusMessage will stored in message key of error
        this.statusCode = statusCode
        Error.captureStackTrace(this,this.constructor); //target object and this constructor
    }
}

export default ErrorHandler;