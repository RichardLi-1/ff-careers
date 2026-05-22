import { Pinecone } from '@pinecone-database/pinecone';
import huggingFaceEmbed from './huggingFaceClient';

const pc = new Pinecone({ apiKey: process.env.PINECONE_DEFAULT_API_KEY });

const index = pc.index("INDEX_NAME", "INDEX_HOST")

export default async function query(user_id: string, query_content: string, topK: number) {
    const vector = await huggingFaceEmbed(query_content);

    const queryResponse = await index.namespace(user_id).query({
        vector: vector,
        topK: 3,
        includeMetadata: true,
    });

    return queryResponse.matches;
}