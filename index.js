import * as core from "@actions/core";


try {
    const messages = require('./commitMessage.js').retrieve();
    const messageLength = messages.length
    for (let i = 0; i < messageLength; i++) {
        console.log(messages[i]);
    }
    // core.debug(`Commit Message Found:\n${message}`);

} catch (error) {
    core.setFailed(error.message);
}
