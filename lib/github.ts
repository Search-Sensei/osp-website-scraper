import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

const octokit = new Octokit({
  auth: process.env.PAT,
});

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

function isBinary(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  const textExtensions = ['.html', '.css', '.js', '.json', '.xml', '.svg', '.txt', '.md'];
  return !textExtensions.includes(ext);
}

export async function commitAndPushDirectory(
  repoOwner: string,
  repoName: string,
  basePathInRepo: string, // e.g. "public/sites/community_savings_bank"
  absoluteLocalDir: string, // e.g. "/app/public/sites/community_savings_bank"
  message: string
) {
  if (!process.env.PAT) {
    console.warn('PAT environment variable is not set. Cannot push to GitHub.');
    return;
  }

  try {
    const { data: refData } = await octokit.git.getRef({
      owner: repoOwner,
      repo: repoName,
      ref: 'heads/main',
    });
    const commitSha = refData.object.sha;

    const { data: commitData } = await octokit.git.getCommit({
      owner: repoOwner,
      repo: repoName,
      commit_sha: commitSha,
    });
    const treeSha = commitData.tree.sha;

    const allFiles = getAllFiles(absoluteLocalDir);
    const treeItems: any[] = [];

    // Create blobs for all files
    for (const filePath of allFiles) {
      const relativePath = path.relative(absoluteLocalDir, filePath);
      const repoPath = `${basePathInRepo}/${relativePath}`.replace(/\\/g, '/');
      const binary = isBinary(filePath);
      
      const content = binary 
        ? fs.readFileSync(filePath).toString('base64')
        : fs.readFileSync(filePath, 'utf8');

      const { data: blobData } = await octokit.git.createBlob({
        owner: repoOwner,
        repo: repoName,
        content,
        encoding: binary ? 'base64' : 'utf-8',
      });

      treeItems.push({
        path: repoPath,
        mode: '100644',
        type: 'blob',
        sha: blobData.sha,
      });
    }

    const { data: newTreeData } = await octokit.git.createTree({
      owner: repoOwner,
      repo: repoName,
      base_tree: treeSha,
      tree: treeItems,
    });

    const { data: newCommitData } = await octokit.git.createCommit({
      owner: repoOwner,
      repo: repoName,
      message,
      tree: newTreeData.sha,
      parents: [commitSha],
    });

    await octokit.git.updateRef({
      owner: repoOwner,
      repo: repoName,
      ref: 'heads/main',
      sha: newCommitData.sha,
    });

    console.log(`Successfully committed directory to ${repoOwner}/${repoName}: ${basePathInRepo} (${treeItems.length} files)`);
  } catch (error: any) {
    console.error('Error committing to GitHub:', error);
    throw error;
  }
}
