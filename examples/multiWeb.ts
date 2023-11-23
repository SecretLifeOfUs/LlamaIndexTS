import { Document, VectorStoreIndex, WebReader } from "llamaindex";

class URLsProcessor {
  private documents: Document[] = [];
  private index: VectorStoreIndex | null = null;
  private isIndexed: boolean = false;

  constructor(private urls: string[]) {}

  // Method to fetch and index documents from URLs
  async indexDocuments(): Promise<void> {
    const reader = new WebReader();

    for (const url of this.urls) {
      try {
        const urlDocuments = await reader.loadData(url);
        this.documents.push(...urlDocuments);
      } catch (error) {
        console.error(`Error processing URL ${url}:`, error);
      }
    }

    this.index = await VectorStoreIndex.fromDocuments(this.documents);
    this.isIndexed = true;
  }

  // Method to query the indexed documents
  async queryIndex(query: string): Promise<string> {
    if (!this.index) {
      throw new Error("Index not created. Please run indexDocuments first.");
    }

    const queryEngine = this.index.asQueryEngine();
    const response = await queryEngine.query(query);
    return response.toString();
  }
}

async function main() {
  const urls = [
    "https://github.com/radames/Real-Time-Latent-Consistency-Model/issues/27",
    "https://github.com/radames/Real-Time-Latent-Consistency-Model/issues/26",
    // ... other URLs
  ];

  const urlsProcessor = new URLsProcessor(urls);
  await urlsProcessor.indexDocuments();
  console.log("Indexing complete.");

  const query = "which node version should I use";
  const response = await urlsProcessor.queryIndex(query);
  console.log("Query response:", response);
}

main().catch(console.error);
