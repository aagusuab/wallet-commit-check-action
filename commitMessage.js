

import * as github from '@actions/github';

// This code has been taken from https://github.com/GsActions/commit-message-checker/blob/master/src/input-helper.ts
// and slightly modified.

/**
 * Gets all commit messages of a push or title and body of a pull request
 * concatenated to one message.
 *
 * @returns   string[]
 */
export function retrieve(): string[] {
    const result: string[] = [];

    switch (github.context.eventName) {
        case 'push': {
            const commits = github.context.payload?.commits;
            if (commits) {
                for (const commit of commits) {
                    if (commit.message) {
                        result.push(commit.message);
                    }
                }
            }
            if (result.length === 0) {
                throw new Error(`No commits found in the payload.`);
            }
            break;
        }
        default: {
            throw new Error(`Unhandled event: ${github.context.eventName}`);
        }
    }

    return result;
}