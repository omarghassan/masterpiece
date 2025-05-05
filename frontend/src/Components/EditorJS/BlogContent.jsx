import React from 'react';

const BlogContent = ({ content }) => {
  // Helper function to safely render text that might be an object
  const renderText = (text) => {
    if (typeof text === 'string') {
      return text;
    } else if (text && typeof text === 'object') {
      // If it's an object, we need to stringify it or extract text from specific structure
      // Editor.js sometimes sends nested objects for formatted text
      if (text.content) {
        return text.content;
      } else {
        // For safety, convert to JSON string but only as fallback
        console.warn('Unexpected object structure in text:', text);
        return JSON.stringify(text);
      }
    }
    return '';
  };

  const renderBlock = (block) => {
    switch (block.type) {
      case 'header':
        const HeadingTag = `h${block.data.level}`;
        return <HeadingTag className="mt-6 mb-4 font-bold text-xl">{renderText(block.data.text)}</HeadingTag>;
      
      case 'paragraph':
        return <p className="my-4">{renderText(block.data.text)}</p>;
      
      case 'list':
        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        return (
          <ListTag className="my-4 pl-6">
            {block.data.items.map((item, i) => (
              <li key={i} className={block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'}>
                {renderText(item)}
              </li>
            ))}
          </ListTag>
        );
      
      case 'code':
        return (
          <pre className="bg-gray-100 p-4 rounded my-4 overflow-x-auto">
            <code>{renderText(block.data.code)}</code>
          </pre>
        );
      
      case 'quote':
        return (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
            {renderText(block.data.text)}
            {block.data.caption && <cite className="block mt-2">— {renderText(block.data.caption)}</cite>}
          </blockquote>
        );
      
      case 'image':
        return (
          <figure className="my-6">
            <img 
              src={block.data.file?.url || ''} 
              alt={block.data.caption || ''} 
              className="max-w-full h-auto rounded"
            />
            {block.data.caption && <figcaption className="text-center text-gray-500 mt-2">{renderText(block.data.caption)}</figcaption>}
          </figure>
        );
      
      default:
        console.warn('Unknown block type:', block.type);
        return null;
    }
  };

  try {
    // Parse the content if it's a string
    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
    
    // Add debugging to see what we're working with
    console.log('Rendering content:', parsedContent);
    
    // Handle different EditorJS output formats
    if (parsedContent.blocks) {
      return (
        <div className="blog-content">
          {parsedContent.blocks.map((block, index) => (
            <div key={index}>
              {renderBlock(block)}
            </div>
          ))}
        </div>
      );
    } else if (parsedContent.time && parsedContent.version && parsedContent.data) {
      // Handle older EditorJS format
      return (
        <div className="blog-content">
          {parsedContent.data.blocks.map((block, index) => (
            <div key={index}>
              {renderBlock(block)}
            </div>
          ))}
        </div>
      );
    } else {
      console.error("Unrecognized content format:", parsedContent);
      return <p>Content format not supported</p>;
    }
  } catch (error) {
    console.error("Failed to parse blog content:", error);
    return <p>Unable to display content. Error: {error.message}</p>;
  }
};

export default BlogContent;