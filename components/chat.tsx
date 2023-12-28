'use client'

import { useChat, type Message } from 'ai/react';
import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast'
import MetadataList from '@/components/metadata-list';
import styles from './ChatListContainer.module.css'; // Import the CSS module
import QuestionsOverlayStyles from './QuestionsOverlay.module.css'; // Import the CSS module
import { QuestionsOverlay, QuestionsOverlayLeftPanel } from './question-overlay';
import { ParsedMetadataEntry } from 'lib/types';


// Extend the Message type to include structured_metadata
export interface MetadataMessage extends Message {
  structured_metadata?: ParsedMetadataEntry[]; // Ideally, define a more specific type instead of any[]
}

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: MetadataMessage[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )

  // State to hold structured metadata entries
  const [structuredMetadataEntries, setStructuredMetadataEntries] = useState<ParsedMetadataEntry[]>([]);
  // State to control the visibility of "Top Sources" title
  const [showTopSources, setShowTopSources] = useState(false);
  const [newMessages, setMessages] = useState(initialMessages || []);
  const [lastMessageRole, setLastMessageRole] = useState('assistant');

  // Initialize a state to control the initial render of QuestionsOverlay
  const [initialLoad, setInitialLoad] = useState(true);

  // Additional state to track if the fade-out animation has completed
  const [fadeOutCompleted, setFadeOutCompleted] = useState(true);

  const [metadataContainerVisible, setMetadataContainerVisible] = useState(false);

  // State to control the visibility of QuestionsOverlayLeftPanel
  const [showLeftPanelOverlay, setShowLeftPanelOverlay] = useState(false);  

  // New state for controlling the visibility of QuestionsOverlay
  const [showMiddlePanelOverlay, setShowMiddlePanelOverlay] = useState(true);

  const [showEmptyScreen, setShowEmptyScreen] = useState(true);
  const [showChatList, setShowChatList] = useState(false); // New state for ChatList visibility
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    // Set initialLoad to false after the component has mounted
    setInitialLoad(false);
  }, []);



 // Effect to toggle visibility of metadataContainer based on structuredMetadataEntries
 useEffect(() => {
    let timer1: number | null = null;
    let timer2: number | null = null;

    if (structuredMetadataEntries.length > 0) {
      setShowTopSources(true); // Show "Top Sources" once there are entries

      // Set a timeout to fade out first
      timer1 = window.setTimeout(() => {
        setMetadataContainerVisible(false);
      }, 500); // Adjust this duration to match your CSS transition

      // Set another timeout to fade back in
      timer2 = window.setTimeout(() => {
        setMetadataContainerVisible(true);
      }, 500); // This starts after the first timer completes
    }

    return () => {
      if (timer1 !== null) clearTimeout(timer1);
      if (timer2 !== null) clearTimeout(timer2);
    };
  }, [structuredMetadataEntries]);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set the initial value
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Function to handle user input submission
  const handleUserInputSubmit = async (value: string) => {
    // Fade out EmptyScreen and QuestionsOverlay
    setShowMiddlePanelOverlay(false);

    // Set a timeout to hide the EmptyScreen after the fade-out animation
    setTimeout(() => {
      setShowEmptyScreen(false);
    }, 300); // This should match the duration of the fade-out animation

    // Delay the fade-in of ChatList
    setTimeout(() => {
      setShowChatList(true); // Show ChatList with fade-in
    }, 300); // Delay should match the fade-out duration
  
      const newUserMessage: MetadataMessage = {
      id: id || '',  // Provide a fallback value for 'id' to ensure it's not undefined
      content: value,
      role: 'user',  // Assuming 'user' is an acceptable value for 'role'
      structured_metadata: []  // Assuming this matches the type in MetadataMessage
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    append(newUserMessage);
    setLastMessageRole('user');
    // Hide the QuestionsOverlayLeftPanel on user input
    setShowLeftPanelOverlay(false);
    
    // Hide the middle panel overlay on user input
    setShowMiddlePanelOverlay(false);
    setFadeOutCompleted(false); // Animation starts, not yet completed
  };
  
  // Add an animation end handler
  const onAnimationEnd = () => {
    if (!showLeftPanelOverlay) {
      setFadeOutCompleted(true); // Animation completed
    }
  };

  // Update visibility of QuestionsOverlayLeftPanel based on message count and lastMessageRole
  useEffect(() => {
    // Show the overlay only if there are messages and the last message is from the assistant
    setShowLeftPanelOverlay(newMessages.length > 0 && lastMessageRole === 'assistant');
  }, [newMessages, lastMessageRole]);

  // Create a ref for the end of the chat list
  const chatListEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatListEndRef.current) {
      const isAtBottom = chatListEndRef.current.scrollHeight - chatListEndRef.current.scrollTop === chatListEndRef.current.clientHeight;
      if (isAtBottom) {
        chatListEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [newMessages]);

  const { messages, append, reload, stop, isLoading, input, setInput } =
  useChat({
      initialMessages,
      id,
      body: {
        id,
        previewToken
      },
      onResponse: async (originalResponse) => {
        if (originalResponse.status === 401) {
          toast.error(originalResponse.statusText)
        } else if (originalResponse.ok) {
          // Clone the response before reading it to avoid "already read" errors
          const response = originalResponse.clone();
          try {
            const responseData = await response.json();
            setStructuredMetadataEntries(responseData.structured_metadata || []);
            responseData.messages = responseData.messages.map((message: Message) => {
              if (message.role === "assistant") {
                  try {
                      // Try to parse the content as JSON
                      const parsedContent = JSON.parse(message.content);
                      
                      // Check if parsedContent has a messages array and it's not empty
                      if (parsedContent.messages && parsedContent.messages.length > 0) {
                          // Replace content with the last message of the messages array
                          message.content = parsedContent.messages[parsedContent.messages.length - 1].content;
                      }
                  } catch (error) {
                      // If parsing fails or doesn't meet criteria, leave content as is
                      console.error("Error parsing message content:", error);
                  }
              }
              return message;
            
            });
            setMessages(responseData.messages);
            setLastMessageRole('assistant');

          } catch (error) {
            console.error('Error reading response data:', error);
            toast.error('Error reading response data');
          }
        }
      }
    })

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 50); // Adjust this delay as needed
  
    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  // Determine the overlay class for QuestionsOverlay
  const overlayClass = isMobile 
    ? `${styles.questionsOverlay} ${styles.mobileHide}` 
    : initialLoad || (newMessages.length === 0 && showMiddlePanelOverlay)
      ? `${styles.questionsOverlay} ${QuestionsOverlayStyles.fadeIn}`
      : `${styles.questionsOverlay} ${QuestionsOverlayStyles.fadeOut}`;

  // Determine the overlay class for QuestionsOverlayLeftPanel
  const leftPanelOverlayClass = showLeftPanelOverlay 
  ? `${styles.questionsOverlay} ${QuestionsOverlayStyles.fadeIn}` 
  : `${styles.questionsOverlay} ${QuestionsOverlayStyles.fadeOut}`;

  const metadataContainerClass = cn(styles.metadataContainer, {
    [styles.metadataContainerVisible]: metadataContainerVisible,
  });

  return (
    <>
      <div className={styles.layoutContainer}>
        <div className={styles.leftPanel}>
          <div className={leftPanelOverlayClass} onAnimationEnd={onAnimationEnd}>
            {/* Render conditionally based on fadeOutCompleted */}
            {showLeftPanelOverlay || !fadeOutCompleted ? (
              <QuestionsOverlayLeftPanel onSubmit={handleUserInputSubmit} showOverlay={showLeftPanelOverlay} />
            ) : null}
          </div>
        </div>

        <div className={styles.middlePanel}>  {/* Middle panel for chatlist and prompt form */}
          <div className={styles.chatListContainer}>
            {showChatList ? (
              <div className={QuestionsOverlayStyles.fadeIn}>
                <ChatList messages={newMessages} />
              </div>
            ) : (
              <div className={showEmptyScreen ? '' : QuestionsOverlayStyles.hidden}>
                <EmptyScreen onSubmit={handleUserInputSubmit} showOverlay={showMiddlePanelOverlay} isVisible={showEmptyScreen} />
              </div>
            )}
          </div>
          
          {/* Apply overlayClass only when there are no messages and not on mobile */}
          {newMessages.length === 0 && !isMobile && (
            <div className={`${overlayClass} ${showMiddlePanelOverlay ? QuestionsOverlayStyles.fadeIn : QuestionsOverlayStyles.fadeOut}`}>
              <QuestionsOverlay onSubmit={handleUserInputSubmit} showOverlay={showMiddlePanelOverlay} />
            </div>
          )}
        </div>

        <div>  {/* ChatPanel component */}
          <ChatPanel
            id={id}
            isLoading={isLoading}
            stop={stop}
            append={append}
            reload={reload}
            messages={newMessages}
            input={input}
            setInput={setInput}
            onSubmit={handleUserInputSubmit} // Pass the function to ChatPanel
            setMessages={setMessages}
            setStructuredMetadataEntries={setStructuredMetadataEntries}
            setLastMessageRole={setLastMessageRole}
            setShowTopSources={setShowTopSources}
            setFadeOutCompleted={setFadeOutCompleted}
            setMetadataContainerVisible={setMetadataContainerVisible}
            setShowLeftPanelOverlay={setShowLeftPanelOverlay}
            setShowMiddlePanelOverlay={setShowMiddlePanelOverlay}
            setShowEmptyScreen={setShowEmptyScreen}
            setShowChatList={setShowChatList}
          />
        </div>

        {/* Right panel for metadata list */}
        <div className={`${styles.rightPanel}`}>
          {/* Metadata section */}
          <div className={metadataContainerClass}>

            {newMessages.length > 0 && ( // Only show metadataTitle if there are messages
              <div className={styles.metadataTitle}>Top Sources</div>
            )}

            <MetadataList entries={structuredMetadataEntries} />
          </div>
      </div>
    </div>
    </>
  )
}
