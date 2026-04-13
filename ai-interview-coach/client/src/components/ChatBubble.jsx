import React from "react";

const ChatBubble = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div className={`flex w-full items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* AI avatar */}
      {!isUser && (
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500 shadow-md">
          <span className="text-xs font-extrabold text-white">AI</span>
        </div>
      )}

      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md transition-all duration-200 sm:text-[15px]
          ${
            isUser
              ? "rounded-br-sm bg-gradient-to-br from-secondary to-blue-600 text-white"
              : "rounded-bl-sm border border-primary/25 bg-primary/10 text-white backdrop-blur"
          }`}
      >
        {content}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-blue-600 shadow-md">
          <span className="text-xs font-extrabold text-white">You</span>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
