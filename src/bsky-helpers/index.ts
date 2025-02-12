import type { AppBskyFeedDefs } from "@atproto/api";

/**
 * Formats a Blue Sky URI for a post
 * @param args
 * @returns
 */
export function formatBskyPostUri(handle: string, postHash: string): string {
    return `https://bsky.app/profile/${handle}/post/${postHash}`;
}

const AT_URI_REGEX = /at:\/\/([A-Za-z0-9\.\-_~:]+)(\/[A-Za-z0-9\.\/]+)?/i;

export function parseAtUri(uri: string) {
    const match = AT_URI_REGEX.exec(uri.trim());
    if (match == null) {
        throw new Error("Invalid URI");
    }

    const authority = match[1];
    const path = match[2];

    return {
        authority,
        path,
    };
}

export function getPostViewText(post: AppBskyFeedDefs.PostView): string {
    const record = post.record as any;
    return record?.text ?? "";
}

export function makeProfileLink(handle: string) {
    return `https://bsky.app/profile/${handle}`;
}

export async function convertAtUriToBskyUri(uri: string, handle: string) {
    const parsed = parseAtUri(uri);

    const postHash = parsed.path.split("/").at(-1);
    if (!postHash) {
        throw new Error(`Invalid URI: ${uri}`);
    }

    return formatBskyPostUri(handle ?? parsed.authority, postHash);
}

export function getFullsizeImageUrl(did: string, ref: string, mimeType: string) {
    const mime = mimeType.split("/").at(-1);

    return `https://cdn.bsky.app/img/feed_thumbnail/plain/${did}/${ref}@${mime}`;
}
