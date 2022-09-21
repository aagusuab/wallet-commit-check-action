"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitMessage = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const exec = __importStar(require("@actions/exec"));
const ethers_1 = require("ethers");
async function run() {
    try {
        const commitSHA = github.context.sha;
        core.debug(`Commit Message SHA:${commitSHA}`);
        const message = await getCommitMessage(commitSHA);
        core.debug(`Commit Message Found:\n${message}`);
        const splits = message.split(" ");
        core.info((splits.length - 1).toString());
        core.info(splits[splits.length - 1]);
        core.info(ethers_1.ethers.utils.getAddress(splits[splits.length - 1].trim()));
        core.info(String(ethers_1.ethers.utils.isAddress(splits[splits.length - 1].trim())));
        if (!ethers_1.ethers.utils.isAddress(splits[splits.length - 1].trim())) {
            core.setFailed(`Address invalid`);
        }
        // No problem occured. Commit message is OK
        core.info("Commit message is OK 😉🎉");
    }
    catch (error) {
        core.setFailed(`Action failed with error
        ${error}`);
    }
}
async function getCommitMessage(sha) {
    let message = "";
    const options = {
        listeners: {
            stdout: (data) => {
                message += data.toString();
            }
        }
    };
    const args = ["rev-list", "--format=%B", "--max-count=1", sha];
    await exec.exec("git", args, options);
    message.trim();
    return message;
}
exports.getCommitMessage = getCommitMessage;
run();
