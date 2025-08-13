"use client"

import React, { useState, useRef } from 'react';
import {
  FaPaperPlane as Send,
  FaBold as Bold,
  FaItalic as Italic,
  FaUnderline as Underline,
  FaCode as Code,
  FaPaperclip as Paperclip,
  FaRegSmile as Smile
} from 'react-icons/fa';
import { PostCommentProps } from '../types/types';
import { apiFetchWithAuth } from '../lib/apiFetch';
import { toast } from 'react-toastify';


const contactName = "Les Johnson";
const  contactAvatar = "/lovable-uploads/c71458fd-8a97-47bb-aa11-f0f648799aac.png";
const  unreadCount = 3


const PostComment:React.FC<PostCommentProps> = ({
    proposalId
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);

    const handlePostComment = async () => {
    if (inputMessage.trim()) {
      console.log('Posting comment:', inputMessage);

      const formData = new FormData();
      formData.append('commentText', inputMessage);

      try {
        const response = await apiFetchWithAuth(`/proposal/${proposalId}/Comment`, {
          method: 'POST',
          body: formData
        })

        toast.success(`Your comment has been registered`)
        console.log(response)
      } catch (error) {
        toast.error(`Error posting comment!: ${error}`)
      }

      setInputMessage("");
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePostComment();
    }
  };

  // const formatTime = (timestamp) => {
  //   return timestamp;
  // };

  return (
    <div className="flex flex-col w-full h-fit pb-24 bg-white max-w-4xl mx-auto shadow-md shadow-gray-200 rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={contactAvatar}
              alt={contactName}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contactName)}&background=random`;
              }}
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{contactName}</h2>
          {isTyping && <p>typing...</p>}
        </div>

        {unreadCount > 0 && (
          <div className="relative">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">{unreadCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white">

        <div className="p-4">
          <div className="border border-gray-200 rounded-lg focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
            {/* Formatting toolbar */}
            <div className="border-b border-gray-200 p-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button type='button' title='Bold' className="p-1 hover:bg-gray-100 rounded">
                  <Bold className="w-4 h-4 text-gray-600" />
                </button>
                <button type='button' title='Italic' className="p-1 hover:bg-gray-100 rounded">
                  <Italic className="w-4 h-4 text-gray-600" />
                </button>
                <button type='button' title='Underline' className="p-1 hover:bg-gray-100 rounded">
                  <Underline className="w-4 h-4 text-gray-600" />
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button type='button' title='Code' className="p-1 hover:bg-gray-100 rounded">
                  <Code className="w-4 h-4 text-gray-600" />
                </button>
                <button type='button' title='Attach file' className="p-1 hover:bg-gray-100 rounded">
                  <Paperclip className="w-4 h-4 text-gray-600" />
                </button>
                <button type='button' title='Emoji' className="p-1 hover:bg-gray-100 rounded">
                  <Smile className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Message input area */}
            <div className="flex items-end p-3">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  setIsTyping(e.target.value.length > 0);
                }}
                onKeyPress={handleKeyPress}
                placeholder="Send a message"
                className="flex-1 resize-none border-0 focus:outline-none focus:ring-0 text-sm placeholder-gray-500 max-h-32"
                rows={1}
              />
              <button
                type="button"
                aria-label="Send message"
                onClick={handlePostComment}
                disabled={!inputMessage.trim()}
                className={`ml-3 p-2 rounded-lg transition-colors ${
                  inputMessage.trim()
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComment;