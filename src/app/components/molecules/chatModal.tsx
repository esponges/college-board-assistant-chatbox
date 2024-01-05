import { Modal } from '@/app/components/molecules/modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  handleOptionClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    question: string
  ) => void;
};

const QUESTIONS = [
  'No entiendo la pregunta. ¿Puedes explicarla de otra manera?',
  '¿Qué podría hacer para aprender a responder esta pregunta?',
  'Dame una pista para responder esta pregunta.',
  'Explícame cómo responder esta pregunta.',
];

export const ChatModal = ({ isOpen, onClose, handleOptionClick }: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      innerCloseBtn
      bgColor='bg-blue-800 dark:bg-gray-900'
    >
      <div className='flex flex-col gap-4'>
        {QUESTIONS.map((question) => (
          <div key={question} className='flex flex-col gap-2'>
            <div
              className='font-bold text-white hover:text-gray-200 cursor-pointer'
              onClick={(e) => handleOptionClick?.(e, question)}
            >
              {question}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
