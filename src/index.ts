import * as core from "@actions/core";
import * as github from "@actions/github";
import * as exec from "@actions/exec";
import { ethers } from "ethers";

async function run(): Promise<void> {
    try {
        const owner = core.getInput('owner')
        const repo = core.getInput('repo')
        const separator = core.getInput('separator', {trimWhitespace: false})
        const commitSHA = github.context.sha;

        const message = await getCommitMessage(commitSHA);

        //TODO Might have to include the eventType as well.

        const splits = message.split(separator)
        let isValid = false

        let retrievedWalletAddress = ""
        if ((splits.length === 1) && ethers.utils.isAddress(splits[0])) {
            retrievedWalletAddress = splits[0]
            isValid = true
        } else {
            for (let split of splits) {
                if (ethers.utils.isAddress(split.trim())) {
                    retrievedWalletAddress = split.trim()
                    isValid = true
                }
            }
        }

        let walletAddressInCurrentPr = []
        // Retrieve all the current wallet address that is found in the PR
        if (github.context.eventName == "pull_request") {
            let currentPRNumber = github.context.issue.number
            const token = core.getInput('github-token', {required: false} || process.env.GITHUB_TOKEN);
            let octokit = github.getOctokit(token)

            let commitsInPr = await octokit.request(`GET /repos/{owner}/{repo}/pulls/{pull_number}/commits`, {
                owner: owner,
                repo: repo,
                pull_number: currentPRNumber
            })
            for (let commit of commitsInPr.data) {
                let walletAddress = await retrieveWalletAddress(commit.commit.message, separator)
                if (walletAddress != "") {
                    walletAddressInCurrentPr.push(walletAddress)
                }
            }
            if ( retrievedWalletAddress == "" || !walletAddressInCurrentPr.includes(retrievedWalletAddress)) {
                isValid = false
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
    //First 48 characters are "commit {commitId}\n"
    return message.substring(48).trim()
}

export async function retrieveWalletAddress(message: string, separator: string): Promise<string> {
    const splits = message.split(separator)

    for (let i of splits) {
        core.info(i)
    }

    if ((splits.length === 1) && ethers.utils.isAddress(splits[0])) {
        return splits[0]
    } else {
        for (let split of splits) {
            if (ethers.utils.isAddress(split.trim())) {
                return split.trim()
            }
        }
    }
    return ""
}

run();
