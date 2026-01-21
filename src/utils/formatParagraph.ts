const formatEveryFourSentences = (text: string): string[] => {
  if (!text) return [];

  const sentences = text.match(/[^.!?]+[.!?]/g) || [];
  const paragraphs: string[] = [];

  for (let i = 0; i < sentences.length; i += 4) {
    const paragraph = sentences
      .slice(i, i + 4)
      .join(" ")
      .trim();

    paragraphs.push(paragraph);
  }

  return paragraphs;
};

export default formatEveryFourSentences;
