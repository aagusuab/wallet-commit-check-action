import * as core from "@actions/core";
import * as github from "@actions/github";
import * as exec from "@actions/exec";
import { ethers } from "ethers";

async function run(): Promise<void> {
    try {
        const commitSHA = github.context.sha;
        core.debug(`Commit Message SHA:${commitSHA}`);

        const message = await getCommitMessage(commitSHA);
        console.log("testing if this prints")

        core.debug(`Commit Message Found:\n${message}`);
        core.info(`message is ${message}`)
        const splits = message.split(" ")
        core.info("================")
        for (let split of splits) {
            core.info(split)
            console.log(split)
        }
        core.info((splits.length - 1).toString())
        if (!ethers.utils.isAddress(splits[splits.length - 1])) {
            core.setFailed(`Address invalid`)
        }

        // No problem occured. Commit message is OK
        core.info("Commit message is OK 😉🎉");
    } catch (error) {
        core.setFailed(`Action failed with error
        ${error}`);
    }
}
export async function getCommitMessage(sha: string): Promise<string> {
    let message = "";

    const options = {
        listeners: {
            stdout: (data: Buffer) => {
                message += data.toString();
            }
        }
    };

    const args: string[] = ["rev-list", "--format=%B", "--max-count=1", sha];

    await exec.exec("git", args, options);
    message.trim();

    return message;
}

run();
