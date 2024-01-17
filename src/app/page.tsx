'use client';

import styles from '@/app/styles/home.module.css';

import { useRef, useState, useEffect } from 'react';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

import { safeFetch } from '@/app/utils/fetch';
import { getErrorMessage } from '@/app/utils';
import { ChatModal } from '@/app/components/molecules/chatModal';
import { LoadingDots } from '@/app/components/atoms/loadingDots';
import { Container } from '@/app/components/organisms/container';

import { apiChatResponseV2Body } from '@/app/types/zod';
import type { ChatMessage } from '@/app/types';
// import { KaTeXComponent } from './components/atoms/katexDiv';
// import { useKatex } from '@/app/utils/hooks/useKatex';

import { getRandomExample } from './utils/examples';
// import { QuizQuestion } from './components/atoms/quizQuestion';
import { twMerge } from 'tailwind-merge';

// import 'katex/dist/katex.min.css';
export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exampleQuestion, _setExampleQuestion] = useState(getRandomExample());
  const [messageState, setMessageState] = useState<{
    messages: Pick<ChatMessage, 'message' | 'type'>[];
    threadId?: string;
  }>({
    messages: [
      {
        message: '!Hola! Soy tu tutor personal ¿En qué puedo ayudarte?',
        type: 'apiMessage',
      },
    ],
  });
  const [examplesQuestionModalOpen, setExamplesQuestionModalOpen] =
    useState<boolean>(false);

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // const mathRef = useKatex();

  // todo: fix
  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  // todo: accept modal option click event
  const handleSubmit = async (
    e?:
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    setError(null);
    if (!!e && 'key' in e && e.key === 'Enter') {
      if (e.key === 'Enter') {
        e.preventDefault();
      } else {
        return;
      }
    }

    const input = e?.currentTarget.value || textAreaRef.current?.value;

    if (!input || typeof input !== 'string') {
      setError('Please first enter a question.');

      return;
    }

    const question = input.trim();
    const fullContext = `Ejemplo: ${JSON.stringify(
      exampleQuestion
    )}\n\n Pregunta del usuario: ${question}`;

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setLoading(true);
    // set text areaRef value to empty string
    textAreaRef.current && (textAreaRef.current.value = '');
    // we want to send the full context on the first message
    const isFirstMessage = messageState.messages.length === 1;

    try {
      const chatResponse = await safeFetch(apiChatResponseV2Body, '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: isFirstMessage ? fullContext : question,
          threadId: messageState.threadId,
        }),
      });
      const { response, threadId } = chatResponse;

      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'apiMessage',
            message: response,
          },
        ],
        threadId,
      }));
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err);

      setError(
        `An error occurred while fetching the data. Please try again. Error: ${errMsg}`
      );
      setLoading(false);

      return;
    }

    setLoading(false);

    //scroll to bottom - broken - fix later
    messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
  };

  //prevent empty submissions
  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (textAreaRef.current?.value) {
      if (e.key === 'Enter' && textAreaRef.current?.value && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        handleSubmit(e);
      } else if (e.key === 'Enter' && e.shiftKey && textAreaRef.current?.value) {
        textAreaRef.current.value += '\n'
      } 
    }
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleToggleExamplesQuestionModal = () => {
    setExamplesQuestionModalOpen((prev) => !prev);
  };

  const handleSetExampleQuestion = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    question: string
  ) => {
    textAreaRef.current && (textAreaRef.current.value = question);
    setExamplesQuestionModalOpen(false);
    handleSubmit();
  };

  return (
    <Container>
      <div className='mx-auto flex w-full flex-col gap-4'>
        <ChatModal
          isOpen={examplesQuestionModalOpen}
          onClose={() => setExamplesQuestionModalOpen(false)}
          handleOptionClick={handleSetExampleQuestion}
        />
        <div className='align-center justify-center'>
          {/* <div className={styles.messagelist} ref={mathRef}>
            {messageState['messages'][0]['message']}
          </div> */}
          {/* <KaTeXComponent texExpression='c = \\pm\\sqrt{a^2 + b^2}' /> */}
          {/* <QuizQuestion
            context={exampleQuestion.context}
            questions={exampleQuestion.questions}
          /> */}
          <div
            ref={messageListRef}
            className={styles.messagelist}
            id='chat-messages-list'
          >
            {messageState.messages.map((el, index) => {
              let icon;
              let className;

              if (el.type === 'apiMessage') {
                icon = (
                  <Image
                    key={index}
                    src='/bot-image.png'
                    alt='AI'
                    width='40'
                    height='40'
                    className={styles.boticon}
                    priority
                  />
                );
                className = styles.apimessage;
              } else {
                icon = (
                  <Image
                    key={index}
                    src='/usericon.png'
                    alt='Me'
                    width='30'
                    height='30'
                    className={styles.usericon}
                    priority
                  />
                );
                // The latest message sent by the user will be animated while waiting for a response
                className =
                  loading && index === messageState.messages.length - 1
                    ? styles.usermessagewaiting
                    : styles.usermessage;
              }

              return (
                <div
                  key={`chatMessage-${index}`}
                  // todo: won't work
                  className={twMerge(
                    `chatMessage-${index} block`,
                    el.type === 'apiMessage' ? 'text-left' : 'text-right'
                  )}
                >
                  <div className={className}>
                    {icon}
                    <div className='flex flex-col'>
                      <div
                        className={styles.markdownanswer}
                        id={`chat-message-${index}`}
                      >
                        <ReactMarkdown
                          components={{
                            a: ({ node, ...props }) => (
                              <a
                                {...props}
                                target='_blank'
                                rel='noopener noreferrer'
                              />
                            ),
                            // give some margin top to code blocks
                            pre: ({ node, ...props }) => (
                              <pre {...props} className='my-2 bg-black rounded-md px-2' />
                            ),
                            // give some margin top to code blocks
                            code: ({ node, ...props }) => (
                              <code {...props} className='bg-black rounded-md px-2' />
                            ),
                          }}
                        >
                          {el.message}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {!index ? (
                      <div className='relative flex w-full flex-col items-center justify-center text-sm text-gray-500'>
                        Ejemplo: Explícame cómo responder esta pregunta.
                        {/* add toggler more options */}
                        <button
                          onClick={(_e) => setExamplesQuestionModalOpen(true)}
                          className='text-blue-500 hover:text-blue-700'
                        >
                          Más ejemplos
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
          <div className='relative flex w-full flex-col items-center justify-center py-2'>
            <div className='relative w-full'>
              <form>
                <textarea
                  disabled={loading}
                  onKeyDown={handleEnter}
                  ref={textAreaRef}
                  autoFocus={false}
                  rows={1}
                  maxLength={10000}
                  id='chat-user-input'
                  name='chat-user-input'
                  placeholder={
                    loading
                      ? 'Espernado respuesta...'
                      : 'Escribe tu pregunta o elige una de los ejemplos'
                  }
                  className={styles.textarea}
                />
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={styles.generatebutton}
                  id='chat-submit-button'
                >
                  {loading ? (
                    <div className={styles.loadingwheel}>
                      <LoadingDots color='#000' />
                    </div>
                  ) : (
                    // Send icon SVG in input field
                    <svg
                      viewBox='0 0 20 20'
                      className={styles.svgicon}
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      {/* eslint-disable-next-line max-len */}
                      <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        {error ? (
          <div className='rounded-md border border-red-400 p-4'>
            <p className='text-red-500'>{error}</p>
          </div>
        ) : null}
      </div>
    </Container>
  );
}
