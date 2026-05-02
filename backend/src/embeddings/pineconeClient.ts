import { Pinecone } from '@pinecone-database/pinecone';


const apiKey = process.env.PINECONE_DEFAULT_API_KEY;
if (!apiKey) throw new Error('Missing env var: PINECONE_DEFAULT_API_KEY');

const pc = new Pinecone({ apiKey });


export async function createDenseIndex() {
    await pc.createIndex({
        name: 'standard-dense-js',
        vectorType: 'dense',
        dimension: 384,
        metric: 'cosine',
        spec: {
            serverless: {
            cloud: 'aws',
            region: 'us-east-1'
            }
        },
        deletionProtection: 'disabled',
        tags: { environment: 'development' }, 
    });
}


export async function upsertRatingVector(userid: string, taskid: string, vector: number[]) {
    const namespace = pc.index({"name": "standard-dense-js"}).namespace(userid);
    await namespace.upsert(
        {records: [
            {   
                "id": taskid,
                "values": vector,
                "metadata": {}
            },
        ]
    });
}