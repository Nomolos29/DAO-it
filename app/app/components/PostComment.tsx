"use client"

import React, { useState, useRef } from 'react';
import {
  FaPaperPlane as Send,
  FaBold as Bold,
  FaItalic as Italic,
  FaUnderline as Underline,
  FaCode as Code,
  FaPaperclip as Paperclip,
  FaTimes as Times,
  FaImage as Image
} from 'react-icons/fa';
import { PostCommentProps } from '../types/types';
import { toast } from 'react-toastify';
import { useActiveAccount } from 'thirdweb/react';
import { usePostComment } from '../hooks/usePostComment';
import type { DAOCommentData } from '../lib/ipfs-service';
import { uploadFileToIPFS } from '../actions/ipfs-actions';

const PostComment:React.FC<PostCommentProps> = ({
    proposalId
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const account = useActiveAccount();
  const { mutate: postComment, isPending } = usePostComment();

  // Format text with bold, italic, underline, code
  const applyFormatting = (format: 'bold' | 'italic' | 'underline' | 'code') => {
    if (!inputRef.current) return;

    const textarea = inputRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedText = '';
    let cursorOffset = 0;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        cursorOffset = selectedText ? 2 : 9; // Position cursor inside markers
        setIsBold(!isBold);
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        cursorOffset = selectedText ? 1 : 7;
        setIsItalic(!isItalic);
        break;
      case 'underline':
        formattedText = `__${selectedText || 'underlined text'}__`;
        cursorOffset = selectedText ? 2 : 11;
        setIsUnderline(!isUnderline);
        break;
      case 'code':
        formattedText = `\`${selectedText || 'code'}  \``;
        cursorOffset = selectedText ? 1 : 5;
        setIsCode(!isCode);
        break;
    }

    const newText =
      textarea.value.substring(0, start) +
      formattedText +
      textarea.value.substring(end);

    setInputMessage(newText);

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + cursorOffset, end + cursorOffset);
      } else {
        textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
      }
    }, 0);
  };

  // Handle file attachments
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Limit to 5 files
    if (attachments.length + fileArray.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }

    // Limit file size to 10MB each
    const oversizedFiles = fileArray.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setAttachments([...attachments, ...fileArray]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handlePostComment = async () => {
    if (!inputMessage.trim() && attachments.length === 0) {
      toast.error('Please enter a message or attach a file');
      return;
    }

    if (!account) {
      toast.error('Please connect your wallet to comment');
      return;
    }

    setIsUploading(true);

    try {
      // Upload attachments to IPFS first
      const uploadedAttachments: DAOCommentData['attachments'] = [];

      for (const file of attachments) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', file.type.startsWith('image/') ? 'avatar' : 'proposal-image');

        const result = await uploadFileToIPFS(formData);

        if (result.success && result.cid && result.url) {
          uploadedAttachments.push({
            cid: result.cid,
            url: result.url,
            type: file.type.startsWith('image/') ? 'image' : 'file',
            name: file.name,
            size: file.size,
            mimeType: file.type,
          });
        }
      }

      // Detect formatting
      const formatting: DAOCommentData['formatting'] = {
        hasBold: inputMessage.includes('**'),
        hasItalic: inputMessage.includes('*') && !inputMessage.includes('**'),
        hasUnderline: inputMessage.includes('__'),
        hasCode: inputMessage.includes('`'),
        hasAttachments: uploadedAttachments.length > 0,
      };

      // Post comment
      postComment({
        proposalId: String(proposalId),
        text: inputMessage,
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
        formatting,
      });

      // Clear form
      setInputMessage("");
      setAttachments([]);
      setIsBold(false);
      setIsItalic(false);
      setIsUnderline(false);
      setIsCode(false);

    } catch (error) {
      toast.error(`Error posting comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePostComment();
    }
  };

  const isSubmitting = isPending || isUploading;

  return (
    <div className="flex flex-col w-full h-fit bg-white shadow-md shadow-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3">
        <h3 className="text-base font-semibold text-gray-900">Add Comment</h3>
      </div>

      {/* Comment Input */}
      <div className="bg-white p-3">
        <div className="border border-gray-200 rounded-lg focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
          {/* Formatting toolbar */}
          <div className="border-b border-gray-200 p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type='button'
                title='Bold'
                onClick={() => applyFormatting('bold')}
                className={`p-1 hover:bg-gray-100 rounded transition-colors ${isBold ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type='button'
                title='Italic'
                onClick={() => applyFormatting('italic')}
                className={`p-1 hover:bg-gray-100 rounded transition-colors ${isItalic ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type='button'
                title='Underline'
                onClick={() => applyFormatting('underline')}
                className={`p-1 hover:bg-gray-100 rounded transition-colors ${isUnderline ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
              >
                <Underline className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              <button
                type='button'
                title='Code'
                onClick={() => applyFormatting('code')}
                className={`p-1 hover:bg-gray-100 rounded transition-colors ${isCode ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'}`}
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                type='button'
                title='Attach file'
                onClick={() => fileInputRef.current?.click()}
                className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div className="border-b border-gray-200 p-2">
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1 text-sm"
                  >
                    {file.type.startsWith('image/') ? (
                      <Image className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Paperclip className="w-4 h-4 text-gray-600" />
                    )}
                    <span className="text-gray-700 max-w-[150px] truncate">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Times className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message input area */}
          <div className="flex items-end p-3">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Write your comment... (Shift+Enter for new line)"
              className="flex-1 resize-none border-0 focus:outline-none focus:ring-0 text-sm placeholder-gray-500 max-h-32 min-h-[60px]"
              rows={3}
              disabled={isSubmitting}
            />
            <button
              type="button"
              aria-label="Send message"
              onClick={handlePostComment}
              disabled={isSubmitting || (!inputMessage.trim() && attachments.length === 0)}
              className={`ml-3 p-2 rounded-lg transition-colors ${
                !isSubmitting && (inputMessage.trim() || attachments.length > 0)
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComment;
