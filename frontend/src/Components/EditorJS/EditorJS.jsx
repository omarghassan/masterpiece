import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Code from '@editorjs/code';
import Quote from '@editorjs/quote';
import ImageTool from '@editorjs/image';

const EditorComponent = ({ data, onChange }) => {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);

  // Initialize editor
  useEffect(() => {
    // Make sure we clean up any existing instance
    if (instanceRef.current) {
      instanceRef.current.destroy();
      instanceRef.current = null;
    }

    console.log("EditorJS initializing with data:", data);

    // Parse data if it's a string
    let parsedData = data;
    if (typeof data === 'string') {
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        console.error("Failed to parse editor data:", e);
        parsedData = { blocks: [] };
      }
    }

    // Ensure we have a valid blocks array
    if (!parsedData || !parsedData.blocks) {
      parsedData = { blocks: [] };
    }

    // Create Editor.js instance
    const editor = new EditorJS({
      holder: 'editorjs',
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 2
          }
        },
        list: {
          class: List,
          inlineToolbar: true
        },
        code: Code,
        quote: {
          class: Quote,
          inlineToolbar: true
        },
        image: {
          class: ImageTool,
          config: {
            // This would be your Laravel API endpoint for image uploads
            endpoints: {
              byFile: '/api/upload-image', 
            }
          }
        }
      },
      data: parsedData,
      onChange: async () => {
        try {
          const savedData = await editor.save();
          console.log("Editor data saved:", savedData);
          onChange(savedData);
        } catch (e) {
          console.error('Editor.js save error:', e);
        }
      },
      onReady: () => {
        console.log('Editor.js is ready to work!');
      },
      logLevel: 'ERROR'
    });

    // Store the instance
    instanceRef.current = editor;

    // Clean up on unmount
    return () => {
      // Check if the editor has the destroy method before calling it
      if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
        instanceRef.current.destroy();
      }
      instanceRef.current = null;
    };
  }, []); // Note: We removed data from dependency array to prevent re-initialization

  return <div id="editorjs" className="w-full border rounded-md min-h-64 p-4" />;
};

export default EditorComponent;