import { StateGraph, START, END } from "@langchain/langgraph";
import { State } from "../state/schema.js";
import { listPriceNode, userIntentNode } from "../intents/classifier.js";
import { toMessageText } from "../utils/message.js";

const conditionalEdge = (state: { messages: Array<{ content?: unknown }> }) => {
  const stateMessages = state.messages;
  const lastMessage = stateMessages[stateMessages.length - 1];
  const intent = toMessageText(lastMessage?.content as string | undefined)
    .trim()
    .toLowerCase();

  if (intent === "list_prices") {
    return "list_prices";
  }

  return "end";
};

export const graph = new StateGraph(State)
  .addNode("user_intent", userIntentNode)
  .addNode("list_prices", listPriceNode)
  .addEdge(START, "user_intent")
  .addConditionalEdges("user_intent", conditionalEdge, {
    list_prices: "list_prices",
    end: END,
  })
  .addEdge("list_prices", END)
  .compile();
