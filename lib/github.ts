import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
});

export async function commitAndPushFile(
  repoOwner: string,
  repoName: string,
  filePathInRepo: string, // e.g. "public/sites/community_savings_bank/index.html"
  absoluteLocalPath: string, // e.g. "/app/public/sites/community_savings_bank/index.html"
  message: string
) {
  if (!process.env.GITHUB_PAT) {
    console.warn("GITHUB_PAT not set, skipping GitHub commit.");
    return;
  }

  try {
    // 1. Get the current commit object
    const { data: refData } = await octokit.git.getRef({
      owner: repoOwner,
      repo: repoName,
      ref: 'heads/main',
    });
    const commitSha = refData.object.sha;

    // 2. Get the commit to find the base tree
    const { data: commitData } = await octokit.git.getCommit({
      owner: repoOwner,
      repo: repoName,
      commit_sha: commitSha,
    });
    const treeSha = commitData.tree.sha;

    // 3. Create a blob for the new file
    const content = fs.readFileSync(absoluteLocalPath, 'utf8');
    const { data: blobData } = await octokit.git.createBlob({
      owner: repoOwner,
      repo: repoName,
      content,
      encoding: 'utf-8',
    });

    // 4. Create a new tree containing the new file
    const { data: newTreeData } = await octokit.git.createTree({
      owner: repoOwner,
      repo: repoName,
      base_tree: treeSha,
      tree: [
        {
          path: filePathInRepo,
          mode: '100644',
          type: 'blob',
          sha: blobData.sha,
        },
      ],
    });

    // 5. Create a new commit
    const { data: newCommitData } = await octokit.git.createCommit({
      owner: repoOwner,
      repo: repoName,
      message,
      tree: newTreeData.sha,
      parents: [commitSha],
    });

    // 6. Update the reference
    await octokit.git.updateRef({
      owner: repoOwner,
      repo: repoName,
      ref: 'heads/main',
      sha: newCommitData.sha,
    });

    console.log(`Successfully committed and pushed to ${repoOwner}/${repoName}: ${filePathInRepo}`);
  } catch (error: any) {
    console.error('Error committing to GitHub:', error);
    throw error;
  }
}
