import { Question } from '@/app/utils/examples';

export const QuizQuestion = ({
  context,
  questions,
}: {
  context?: string;
  questions: Question[];
}) => {
  return (
    <div className='chat-box bg-white shadow-lg rounded-lg p-6 my-2'>
      {context ? (
        <div className='context mb-6 p-4 bg-gray-100 rounded-md text-gray-800'>
          {context}
        </div>
      ) : null}
      {questions.map((question, index) => (
        <div key={index} className='question mb-4'>
          <div className='question-text bg-blue-100 text-blue-900 p-3 rounded-md'>
            {question.text}
          </div>
          <div className='choices mt-2'>
            {question.choices.map((choice, cIndex) => (
              <div
                key={cIndex}
                className='choice p-2 text-gray-700 hover:bg-blue-200 rounded-md cursor-pointer'
              >
                {choice}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
