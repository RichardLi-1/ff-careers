import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_API_TOKEN);


export default async function huggingFaceEmbed(input: string) {
    const output = await client.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: input
    });

    return output;
}