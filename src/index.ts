import * as core from "@actions/core";
import * as github from "@actions/github";
import * as exec from "@actions/exec";
import { ethers } from "ethers";

async function run(): Promise<void> {
    try {
        const commitSHA = github.context.sha;
        core.debug(`Commit Messag SHA:${commitSHA}`);

        const message = await getCommitMessage(commitSHA);

        core.debug(`Commit Message Found:\n${message}`);

        const splits = message.split(" ")
        console.log(splits.length)
        let isValid = false

        if ((splits.length == 1) && ethers.utils.isAddress(splits[0])) {
            isValid = true
        } else {
            for (let split of splits) {
                if (ethers.utils.isAddress(split.trim())) {
                    isValid = true
                }
            }
        }
        if (!isValid) {
            core.setFailed(`Wallet address given is either in invalid format or has invalid checksum address`)
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
