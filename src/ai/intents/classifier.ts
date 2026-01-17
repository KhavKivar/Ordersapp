import { GraphNode } from "@langchain/langgraph";
import { State } from "../state/schema.js";
import { ai } from "../providers/gemini.js";
import { UserIntentType } from "./types.js";
import { toMessageText } from "../utils/message.js";
import { readFileSync } from "node:fs";
import { listProducts, ProductListItem as Item } from "../../services/products.js";

const systemInstruction = readFileSync(
  new URL("./prompts/user-intent.xml", import.meta.url),
  "utf8"
);

export const userIntentNode: GraphNode<typeof State> = async (state) => {
  const messages = state.messages;
  if (messages.length === 0) {
    throw new Error("No messages found in state");
  }
  const userMessage = messages[messages.length - 1].content;
  const userMessageText = toMessageText(userMessage);
  
  const parseMessage = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    config: { systemInstruction },
    contents: userMessageText,
  });


  const intent = parseMessage.text as string;
  let intentType: UserIntentType;

  switch (intent) {
    case "list_prices":
      intentType = UserIntentType.LIST_PRICES;
      break;
    case "place_order":
      intentType = UserIntentType.PLACE_ORDER;  
      break;
    default:
      intentType = UserIntentType.NOT_RELATED;
  }

  return { messages: [{ role: "ai", content: intentType }] };
};


const toCapitalized = (value: string) =>
  value ? value[0].toUpperCase() + value.slice(1) : "";


export const listPriceNode : GraphNode<typeof State> = async (state) => {
  const getAllPrices:Item[] = await listProducts();
  let responseMessage = "Lista de productos:\n";

  const typeOfProduct = [...new Set(getAllPrices.map(item => item.type))];

  for (const type of typeOfProduct) {
    responseMessage += `\n-- ${toCapitalized(type)} --\n`;
    const productsOfType = getAllPrices.filter(item => item.type === type);
    for (const product of productsOfType) {
      responseMessage += `${product.name}, precio: $ ${product.sellPriceClient}\n`;
    }
  }
  return { messages: [{ role: "ai", content: responseMessage }] };
};  