class ServerError extends Error {
    constructor(code, devMsg, clientMsg) {
        super(devMsg);
        this.code = code;
        this.clientMsg = clientMsg;
    }
}

export default ServerError;
