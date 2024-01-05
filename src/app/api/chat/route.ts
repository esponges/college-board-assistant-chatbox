import OpenAI from "openai";
import { getErrorMessage } from "@/app/utils";

import type { Thread } from "openai/resources/beta/threads/threads";
import { type NextRequest, NextResponse } from "next/server";

interface RequestBody {
  question: string;
  // the actual conversation thread
  threadId?: string;
}

// Create a OpenAI connection
const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
});

export async function POST(request: NextRequest) {
  const { question, threadId } = (await request.json()) as RequestBody;

  try {
    // pick existing assistant previously created
    const assistantId = process.env.OPENAI_ABOUT_ASSISTANT_ID;
    
    if (!assistantId) {
      throw new Error("OPENAI_ABOUT_ASSISTANT_ID not found");
    }
    const assistant = await openai.beta.assistants.retrieve(assistantId);
    
    // create a thread for the first question
    let thread: Thread;

    if (!threadId) {
      thread = await openai.beta.threads.create();
    } else {
      thread = await openai.beta.threads.retrieve(threadId);
    }

    // pass in the user question into the existing thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: question,
    });

    // use runs to start processing the assistant response after the thread has
    // been created and the message has been appended to the thread
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    // retrieve the run to see if it is completed
    let actualRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    // Polling mechanism to see if actualRun is completed
    // This should be made more robust.
    while (
      actualRun.status === "queued" ||
      actualRun.status === "in_progress" ||
      actualRun.status === "requires_action"
    ) {
      // uncomment when you have added the functions
      if (actualRun.status === "requires_action") {
        // throw new Error("required_action: Por favor intenta con otra pregunta");
        const toolCall =
        actualRun.required_action?.submit_tool_outputs?.tool_calls[0];
        
        // here we should actually run the expected function
        // for the moment just return a success response
        const response = { success: true, error: null, result: null };

        // we must submit the tool outputs to the run to continue
        await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
          tool_outputs: [
            {
              tool_call_id: toolCall?.id,
              output: JSON.stringify(response),
            },
          ],
        });
      }
      // keep polling until the run is completed
      await new Promise((resolve) => setTimeout(resolve, 1000));
      actualRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Get the last assistant message from the messages array
    const messages = await openai.beta.threads.messages.list(thread.id);

    // Find the last message for the current run
    const lastMessageForRun = messages.data
      .filter(
        (message) => message.run_id === run.id && message.role === "assistant",
      )
      .pop();

    let assistantResponse = "";

    if (lastMessageForRun) {
      // aparently this is not correctly typed
      // content returns an of objects do contain a text object
      const res = lastMessageForRun.content[0] as {
        text: { value: string };
      };

      assistantResponse = res.text.value;
    } else {
      throw new Error("No assistant message found");
    }

    return NextResponse.json({
      response: assistantResponse,
      threadId: thread.id,
    });
  } catch (error) {
    const errorMsg = getErrorMessage(error);

    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
