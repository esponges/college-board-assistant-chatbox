/* La lectura trata sobre el uso de la palabra “conversatorio” en Puerto Rico.
El VII Congreso de la Lengua, celebrado en Puerto Rico, se llenó de “conversatorios”, anunciados con tal palabra en los programas oficiales. Conversatorios entre escritores, entre filólogos... Un conversatorio aquí y otro allá, continuamente.
El vocablo se forma a partir de “conversar”, con la adición del sufijo -torio. Sin embargo, la (5) nueva palabra rompe con lo que cualquier hablante intuye al escuchar un sustantivo creado del
mismo modo: que nos estamos refiriendo a un lugar. Y más exactamente, a un lugar donde se ejecuta la acción mencionada por la raíz; porque en español, el valor locativo de –torio forma palabras como “consultorio”, “dormitorio”, “sanatorio”... es decir, los lugares donde se consulta, se duerme o se sana. Quizás por eso suene extraño “conversatorio”: al oírlo, nuestra mente
(10) lingüística puede entender que se menciona el lugar donde se produce una conversación, igual que “auditorio” es el lugar donde se oye, y no la acción de oír. Sin embargo, aquí se refiere a la acción de conversar ante un público, actividad para la que ya tenía nuestra lengua sustantivos como “coloquio” o “mesa redonda”.
El español de América, que tantos vocablos hermosos ha creado, se sale aquí del carril (15) para formar una palabra atípica. El tiempo dirá si estamos ante una simple ruptura de la
norma o ante una nueva vía para formar palabras que representen una acción. Habría que organizar un buen conversatorio para debatirlo. 

¿Cuál opción puede sustituir APROPIADAMENTE a la palabra “coloquio” (línea 13) en la lectura?
A) Diálogo
B) Conferencia 
C) Monólogo 
D) Soliloquio

16. Según la lectura, la palabra “conversatorio” en Puerto Rico es
A) el lugar donde se produce una conversación entre especialistas, ante un público.
B) la conversación que sostienen entre sí los especialistas, en presencia de un público.
C) la conversación que sostienen los especialistas con el público interesado en el tema.
D) un congreso de especialistas que discuten asuntos de lengua ante un público.

17. En esta lectura predomina un discurso A) argumentativo.
B) narrativo. 
C) descriptivo. 
D) expositivo.

18. Si la raíz latina loqui significa ‘hablar’, ¿cuál de las siguientes opciones representa el MEJOR
significado para la palabra “locutorio”?
A) Habitación privada donde se habla en persona o por teléfono
B) Persona que tiene por oficio hablar por radio o televisión
C) Discurso breve que comúnmente dirige un superior a sus subalternos
D) Facultad de hablar de modo eficaz para conmover o persuadir

19. Seleccione la opción que provea la MEJOR evidencia para la respuesta del ejercicio anterior.
A) Línea 4 (“El vocablo... -torio”)
B) Líneas 6-9 (“Y más... se sana”)
C) Líneas 14-15 (“El español... palabra atípica”)
D) Líneas 15-16 (“El tiempo... una acción”)

Un artículo que cuesta $48.00 tiene un 20 % de descuento. Los clientes que paguen utilizando la tarjeta de crédito del establecimiento reciben 10 % de descuento adicional. ¿Cuánto más pagará una persona que NO utilice la tarjeta de crédito, que otra que la utilice?
A) $38.40 B) $34.56 C) $33.60 D) $3.84
*/

import chalk from "chalk";

export type Question = {
  text: string;
  choices: string[];
};

export type Example = {
  type: "reading_comprehension" | "math_word_problem";
  context?: string;
  questions: Question[];
};

export const EXAMPLES: Example[] = [
  {
    type: "reading_comprehension",
    context: `La lectura trata sobre el uso de la palabra “conversatorio” en Puerto Rico.
    El VII Congreso de la Lengua, celebrado en Puerto Rico, se llenó de “conversatorios”, anunciados con tal palabra en los programas oficiales. Conversatorios entre escritores, entre filólogos... Un conversatorio aquí y otro allá, continuamente.
    El vocablo se forma a partir de “conversar”, con la adición del sufijo -torio. Sin embargo, la (5) nueva palabra rompe con lo que cualquier hablante intuye al escuchar un sustantivo creado del
    mismo modo: que nos estamos refiriendo a un lugar. Y más exactamente, a un lugar donde se ejecuta la acción mencionada por la raíz; porque en español, el valor locativo de –torio forma palabras como “consultorio”, “dormitorio”, “sanatorio”... es decir, los lugares donde se consulta, se duerme o se sana. Quizás por eso suene extraño “conversatorio”: al oírlo, nuestra mente
    (10) lingüística puede entender que se menciona el lugar donde se produce una conversación, igual que “auditorio” es el lugar donde se oye, y no la acción de oír. Sin embargo, aquí se refiere a la acción de conversar ante un público, actividad para la que ya tenía nuestra lengua sustantivos como “coloquio” o “mesa redonda”.
    El español de América, que tantos vocablos hermosos ha creado, se sale aquí del carril (15) para formar una palabra atípica. El tiempo dirá si estamos ante una simple ruptura de la
    norma o ante una nueva vía para formar palabras que representen una acción. Habría que organizar un buen conversatorio para debatirlo. 
    `,
    questions: [
      {
        text: "¿Cuál opción puede sustituir APROPIADAMENTE a la palabra “coloquio” (línea 13) en la lectura?",
        choices: ["Diálogo", "Conferencia", "Monólogo", "Soliloquio"],
      },
      {
        text: "Según la lectura, la palabra “conversatorio” en Puerto Rico es",
        choices: [
          "el lugar donde se produce una conversación entre especialistas, ante un público.",
          "la conversación que sostienen entre sí los especialistas, en presencia de un público.",
          "la conversación que sostienen los especialistas con el público interesado en el tema.",
          "un congreso de especialistas que discuten asuntos de lengua ante un público.",
        ],
      },
      {
        text: "En esta lectura predomina un discurso",
        choices: [
          "argumentativo.",
          "narrativo.",
          "descriptivo.",
          "expositivo.",
        ],
      },
      {
        text: "Si la raíz latina loqui significa ‘hablar’, ¿cuál de las siguientes opciones representa el MEJOR significado para la palabra “locutorio”?",
        choices: [
          "Habitación privada donde se habla en persona o por teléfono",
          "Persona que tiene por oficio hablar por radio o televisión",
          "Discurso breve que comúnmente dirige un superior a sus subalternos",
          "Facultad de hablar de modo eficaz para conmover o persuadir",
        ],
      },
      {
        text: "Seleccione la opción que provea la MEJOR evidencia para la respuesta del ejercicio anterior.",
        choices: [
          "Línea 4 (“El vocablo... -torio”)",
          "Líneas 6-9 (“Y más... se sana”)",
          "Líneas 14-15 (“El español... palabra atípica”)",
          "Líneas 15-16 (“El tiempo... una acción”)",
        ],
      },
    ],
  },
  {
    type: "math_word_problem",
    questions: [
      {
        text: "Un artículo que cuesta $48.00 tiene un 20 % de descuento. Los clientes que paguen utilizando la tarjeta de crédito del establecimiento reciben 10 % de descuento adicional. ¿Cuánto más pagará una persona que NO utilice la tarjeta de crédito, que otra que la utilice?",
        choices: ["$38.40", "$34.56", "$33.60", "$3.84"],
      },
    ],
  },
  {
    type: "math_word_problem",
    questions: [
      {
        text: "Un joven sale de su casa y viaja 12 millas al norte y luego 16 millas al oeste. ¿A cuántas millas se encuentra de su casa?",
        choices: ["20", "24", "25", "26"],
      },
    ],
  },
];

export const getRandomExample = (): Example => {
  return EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
}
