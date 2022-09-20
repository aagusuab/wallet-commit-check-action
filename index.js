import * as core from "@actions/core";
import * as github from "@actions/github";

try {
    const message = github.context.payload.commits.message

    // `who-to-greet` input defined in action metadata file
    console.log(`The commit message is ${message}`);

} catch (error) {
    core.setFailed(error.message);
}



