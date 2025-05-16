
const easyTexts = [
  "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet.",
  "Learning to type quickly and accurately is an essential skill in today's digital world.",
  "Practice makes perfect. The more you type, the better you will become at it.",
  "Typing is like playing a musical instrument. It requires rhythm and muscle memory.",
  "Good posture is important when typing. Sit up straight and keep your wrists elevated.",
  "Using all ten fingers while typing can significantly increase your speed and accuracy.",
  "Take regular breaks to avoid fatigue and strain. Stretch your fingers and wrists to keep them limber.",
  "Typing games can be a fun way to improve your skills. They often include challenges and rewards to keep you motivated.",
  "The home row keys are the foundation of touch typing. They are A, S, D, F, G, H, J, K, L.",
  "Typing without looking at the keyboard is called touch typing. It allows you to focus on the screen instead of your hands.",
  "The average person types at a speed of about 40 words per minute. With practice, you can increase this speed significantly.",
]

const mediumTexts = [
  "The ability to type without looking at the keyboard is called touch typing. It's a skill that can significantly increase your productivity.",
  "Ergonomic keyboards are designed to minimize strain and reduce the risk of repetitive stress injuries like carpal tunnel syndrome.",
  "The QWERTY keyboard layout was designed in the 1870s for mechanical typewriters. Despite its inefficiency, it remains the standard layout.",
  "When learning to type, focus on accuracy first, then gradually increase your speed. Developing bad habits can be difficult to correct later.",
  "Many professional typists can achieve speeds of over 100 words per minute with near-perfect accuracy. This requires extensive practice.",
  "The Marvel and DC comic book characters often have unique typing styles that reflect their personalities. For example, Spider",
  "Iron Man's suite and his AI assistant, J.A.R.V.I.S., often type at superhuman speeds, reflecting their advanced technology.",
  "Typing tests are commonly used in job applications to assess a candidate's typing speed and accuracy. These tests can vary in length and difficulty.",
  "The Dvorak Simplified Keyboard was designed to increase typing speed and reduce finger movement. It places the most commonly used letters under the strongest fingers.",
  "Typing speed is often measured in words per minute (WPM). A word is typically defined as five characters, including spaces and punctuation.",
  "The rise of mobile devices has changed the way we type. Touchscreens and virtual keyboards have introduced new challenges and opportunities for typing.",
]

const hardTexts = [
  "The world record for typing speed was achieved by Barbara Blackburn, who maintained a speed of 212 words per minute for 50 minutes and reached a peak speed of 216 words per minute using a Dvorak simplified keyboard.",
  "Cognitive load theory suggests that when typing becomes automatic, it frees up mental resources for higher-level thinking, allowing you to focus on content creation rather than the mechanical process of typing.",
  "The development of predictive text and autocorrect technologies has revolutionized typing on mobile devices, though these features can sometimes lead to humorous or embarrassing miscommunications.",
  "Stenotype machines, used by court reporters, allow for speeds of up to 300 words per minute by typing multiple keys simultaneously to represent syllables, words, or phrases rather than individual characters.",
  "The phenomenon known as 'flow state' can occur during typing when a person is fully immersed and engaged in the activity, characterized by a feeling of energized focus and enjoyment in the process.",
  "Typing in a second language can be challenging due to different keyboard layouts and character sets, but it can also enhance cognitive flexibility and improve language skills.",
  "The rise of voice recognition technology has led to debates about the future of typing, with some experts predicting that it may become less common as speech-to-text software becomes more accurate and widely used.",
  "The concept of 'digital literacy' encompasses not only typing skills but also the ability to effectively communicate, collaborate, and create content using digital tools and platforms.",
  "Typing speed and accuracy can be influenced by various factors, including age, education level, and the amount of time spent practicing. Younger individuals often have higher typing speeds due to increased exposure to technology.",
  "The use of emojis and GIFs in digital communication has changed the way we express emotions and ideas, often replacing traditional text-based communication with visual elements that can convey complex meanings.",
  "The phenomenon of 'keyboard shortcuts' allows users to perform tasks more efficiently by using key combinations instead of navigating through menus, significantly speeding up workflow in various software applications.",
  "G.O.T. (Game of Thrones) and A.S.O.I.A.F. (A Song of Ice and Fire) are two popular fantasy series that have captivated audiences with their intricate plots, complex characters, and richly developed worlds.",
  "The rise of social media platforms has transformed the way we communicate, allowing for instant sharing of thoughts, images, and videos with a global audience, but also raising concerns about privacy and misinformation.",
  "The concept of 'digital citizenship' emphasizes the responsible and ethical use of technology, including understanding online etiquette, protecting personal information, and recognizing the impact of one's digital footprint.",
]

export function generateRandomText(difficulty: "easy" | "medium" | "hard"): string {
  let textArray: string[]

  switch (difficulty) {
    case "easy":
      textArray = easyTexts
      break
    case "medium":
      textArray = mediumTexts
      break
    case "hard":
      textArray = hardTexts
      break
    default:
      textArray = mediumTexts
  }

  const randomIndex = Math.floor(Math.random() * textArray.length)
  return textArray[randomIndex]
}
