import * as core from "@actions/core";
import {retrieve} from '/commitMessage.js'

try {
    const messages = retrieve();
    const messageLength = messages.length
    for (let i = 0; i < messageLength; i++) {
        console.log(messages[i]);
    }
    // core.debug(`Commit Message Found:\n${message}`);

} catch (error) {
    core.setFailed(error.message);
}
