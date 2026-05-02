import { createDenseIndex, upsertRatingVector } from "./pineconeClient";
import huggingFaceEmbed from "./huggingFaceClient";

const indexCreated = true; //hardcoded for now
export default async function upsert(userid: string, taskid: string, task: string) {

    if (!process.env.PINECONE_DEFAULT_API_KEY) throw new Error('Missing env var: PINECONE_DEFAULT_API_KEY');
    if (!process.env.HF_API_TOKEN) throw new Error('Missing env var: HF_API_TOKEN');

    if(!indexCreated) {createDenseIndex();}

    const vector = await huggingFaceEmbed(task) as number[];
    const res = await upsertRatingVector(userid, taskid, vector);

    return res
}

//later add either a zero shot classification or text classification classifier