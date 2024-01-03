'use client';

import styles from '@/app/styles/home.module.css';

import { useRef, useState, useEffect } from 'react';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

import { safeFetch } from '@/app/utils/fetch';
import { getErrorMessage } from '@/app/utils';
import { AboutModal } from '@/app/components/molecules/aboutModal';
import { LoadingDots } from '@/app/components/atoms/loadingDots';
import { Container } from '@/app/components/organisms/container';

import { apiChatResponseV2Body } from '@/app/types/zod';
import type { ChatMessage } from '@/app/types';

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageState, setMessageState] = useState<{
    messages: Pick<ChatMessage, 'message' | 'type'>[];
    threadId?: string;
  }>({
    messages: [
      {
        message: 'Hi, what would you like to learn about Fer?',
        type: 'apiMessage',
      },
    ],
  });
  const [examplesQuestionModalOpen, setExamplesQuestionModalOpen] =
    useState<boolean>(false);

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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

    try {
      const chatResponse = await safeFetch(
        apiChatResponseV2Body,
        '/api/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question,
            threadId: messageState.threadId,
          }),
        }
      );
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
    if (e.key === 'Enter' && textAreaRef.current?.value) {
      handleSubmit(e);
    } else if (e.key === 'Enter') {
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
    handleToggleExamplesQuestionModal();
    handleSubmit();
  };

  return (
    <Container>
      <div className='mx-auto flex w-full flex-col gap-4'>
        <AboutModal
          isOpen={examplesQuestionModalOpen}
          onClose={handleToggleExamplesQuestionModal}
          handleOptionClick={handleSetExampleQuestion}
        />
        <div className='align-center justify-center'>
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
                <div key={`chatMessage-${index}`}>
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
                          }}
                        >
                          {el.message}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {!index ? (
                      <div className='relative flex w-full flex-col items-center justify-center text-sm text-gray-500'>
                        E.g: What&apos;s Fer&apos;s Tech Stack?
                        {/* add toggler more options */}
                        <button
                          onClick={handleToggleExamplesQuestionModal}
                          className='text-blue-500 hover:text-blue-700'
                        >
                          More Examples
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
                  maxLength={512}
                  id='chat-user-input'
                  name='chat-user-input'
                  placeholder={
                    loading
                      ? 'Waiting for response...'
                      : 'Ask a question about Fer'
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
