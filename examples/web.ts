import { VectorStoreIndex, WebReader } from "llamaindex";

async function main() {
  // Load page
  const reader = new WebReader();
  const documents = await reader.loadData(
    "https://github.com/radames/Real-Time-Latent-Consistency-Model/issues/27",
  );

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments(documents);

  // Query the index
  const queryEngine = index.asQueryEngine();
  const response = await queryEngine.query("which node version should I use");

  // Output response
  console.log(response.toString());
}

main().catch(console.error);
