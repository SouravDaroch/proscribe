export const getExcerpt = (blocks: any[], maxLength = 100) => {
  // Find the first block that is 'text' and has content
  const firstTextBlock = blocks.find(b => b.type === 'text' && b.content);
  
  if (!firstTextBlock) return "No preview available...";

  const content = firstTextBlock.content;
  return content.length > maxLength 
    ? content.substring(0, maxLength) + "..." 
    : content;
};