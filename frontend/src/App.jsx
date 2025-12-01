import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import OnboardingPage from './components/OnboardingPage';
import OnboardingQuestions from './components/OnboardingQuestions';
import AccountCreation from './components/AccountCreation';
import { api } from './api';
import './App.css';

function App() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Onboarding state
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'questions', 'signup', 'signin', 'chat'
  const [userProfile, setUserProfile] = useState(null);
  const [hasBackendProfile, setHasBackendProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  // Check for existing profile from backend when user is signed in
  useEffect(() => {
    async function checkProfile() {
      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        // User is not signed in, show landing page
        setCurrentView('landing');
        setCheckingProfile(false);
        return;
      }

      try {
        // User is signed in, check if they have a backend profile
        const profile = await api.getProfile(getToken);
        if (profile) {
          // Profile exists in backend
          setHasBackendProfile(true);
          setUserProfile(profile.profile);
          setCurrentView('chat');
        } else {
          // No profile in backend, check localStorage
          const savedProfile = localStorage.getItem('userProfile');
          if (savedProfile) {
            // Has temp profile from questions, need to save to backend
            const tempProfile = JSON.parse(savedProfile);
            setUserProfile(tempProfile);

            // Try to save to backend
            try {
              await api.createProfile(tempProfile, getToken);
              setHasBackendProfile(true);
              localStorage.removeItem('userProfile'); // Clear temp storage
              setCurrentView('chat');
            } catch (error) {
              console.error('Failed to save profile to backend:', error);
              // Stay on current view
            }
          } else {
            // No profile anywhere, send to questions
            setCurrentView('questions');
          }
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setCheckingProfile(false);
      }
    }

    checkProfile();
  }, [isLoaded, isSignedIn, getToken]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load conversation details when selected
  useEffect(() => {
    if (currentConversationId) {
      loadConversation(currentConversationId);
    }
  }, [currentConversationId]);

  const loadConversations = async () => {
    try {
      const convs = await api.listConversations(getToken);
      setConversations(convs);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadConversation = async (id) => {
    try {
      const conv = await api.getConversation(id, getToken);
      setCurrentConversation(conv);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleNewConversation = async () => {
    try {
      const newConv = await api.createConversation(getToken);
      setConversations([
        { id: newConv.id, created_at: newConv.created_at, message_count: 0 },
        ...conversations,
      ]);
      setCurrentConversationId(newConv.id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleSelectConversation = (id) => {
    setCurrentConversationId(id);
  };

  const handleStarConversation = async (id) => {
    try {
      await api.toggleStarConversation(id, getToken);
      await loadConversations();
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  };

  const handleRenameConversation = async (id, newTitle) => {
    try {
      await api.updateConversationTitle(id, newTitle, getToken);
      await loadConversations();
    } catch (error) {
      console.error('Failed to rename conversation:', error);
    }
  };

  const handleDeleteConversation = async (id) => {
    try {
      await api.deleteConversation(id, getToken);
      // If we deleted the current conversation, clear it
      if (id === currentConversationId) {
        setCurrentConversationId(null);
        setCurrentConversation(null);
      }
      await loadConversations();
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleSendMessage = async (content) => {
    if (!currentConversationId) return;

    setIsLoading(true);
    try {
      // Optimistically add user message to UI
      const userMessage = { role: 'user', content };
      setCurrentConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }));

      // Create a partial assistant message that will be updated progressively
      const assistantMessage = {
        role: 'assistant',
        stage1: null,
        stage2: null,
        stage3: null,
        metadata: null,
        loading: {
          stage1: false,
          stage2: false,
          stage3: false,
        },
      };

      // Add the partial assistant message
      setCurrentConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
      }));

      // Send message with streaming
      await api.sendMessageStream(currentConversationId, content, (eventType, event) => {
        switch (eventType) {
          case 'stage1_start':
            setCurrentConversation((prev) => {
              const messages = [...prev.messages];
              const lastMsg = messages[messages.length - 1];
              lastMsg.loading.stage1 = true;
              return { ...prev, messages };
            });
            break;

          case 'stage1_complete':
            setCurrentConversation((prev) => {
              const messages = [...prev.messages];
              const lastMsg = messages[messages.length - 1];
              lastMsg.stage1 = event.data;
              lastMsg.loading.stage1 = false;
              return { ...prev, messages };
            });
            break;

          case 'stage2_start':
            setCurrentConversation((prev) => {
              const messages = [...prev.messages];
              const lastMsg = messages[messages.length - 1];
              lastMsg.loading.stage2 = true;
              return { ...prev, messages };
            });
            break;

          case 'stage2_complete':
            setCurrentConversation((prev) => {
              const messages = [...prev.messages];
              const lastMsg = messages[messages.length - 1];
              lastMsg.stage2 = event.data;
              lastMsg.metadata = event.metadata;
              lastMsg.loading.stage2 = false;
              return { ...prev, messages };
            });
            break;

          case 'stage3_start':
            setCurrentConversation((prev) => {
              const messages = [...prev.messages];
              const lastMsg = messages[messages.length - 1];
              lastMsg.loading.stage3 = true;
              return { ...prev, messages };
            });
            break;

          case 'stage3_complete':
            setCurrentConversation((prev) => {
              const messages = [...prev.messages];
              const lastMsg = messages[messages.length - 1];
              lastMsg.stage3 = event.data;
              lastMsg.loading.stage3 = false;
              return { ...prev, messages };
            });
            break;

          case 'title_complete':
            // Reload conversations to get updated title
            loadConversations();
            break;

          case 'complete':
            // Stream complete, reload conversations list
            loadConversations();
            setIsLoading(false);
            break;

          case 'error':
            console.error('Stream error:', event.message);
            setIsLoading(false);
            break;

          default:
            console.log('Unknown event type:', eventType);
        }
      }, getToken);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic messages on error
      setCurrentConversation((prev) => ({
        ...prev,
        messages: prev.messages.slice(0, -2),
      }));
      setIsLoading(false);
    }
  };

  // Handle authentication state changes
  useEffect(() => {
    if (isLoaded && isSignedIn && userProfile && currentView !== 'chat') {
      // User is signed in and has profile, go to chat
      setCurrentView('chat');
      loadConversations();
    }
  }, [isSignedIn, isLoaded, userProfile]);

  // Handle onboarding flow
  const handleStartOnboarding = () => {
    setCurrentView('questions');
  };

  const handleProfileComplete = (profile) => {
    // Save profile to localStorage for now (will move to backend later)
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));

    // Show sign up page
    setCurrentView('signup');
  };

  const handleSignIn = () => {
    setCurrentView('signin');
  };

  const handleSignUp = () => {
    setCurrentView('signup');
  };

  // View routing
  if (!isLoaded || checkingProfile) {
    // Show loading while Clerk initializes or checking profile
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#791f85',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (currentView === 'landing') {
    return (
      <OnboardingPage
        logoText="Wellness Partner"
        placeholder="whats on your mind?"
        onSubmit={handleStartOnboarding}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    );
  }

  if (currentView === 'questions') {
    return (
      <OnboardingQuestions onComplete={handleProfileComplete} />
    );
  }

  if (currentView === 'signup') {
    return (
      <AccountCreation mode="signup" />
    );
  }

  if (currentView === 'signin') {
    return (
      <AccountCreation mode="signin" />
    );
  }

  // Main chat view
  return (
    <div className="app">
      {!sidebarOpen && (
        <button
          className="sidebar-toggle-floating"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          title="Open sidebar (Ctrl+.)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 3h14v1H1V3zm0 4h14v1H1V7zm0 4h14v1H1v-1z"/>
          </svg>
        </button>
      )}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onStarConversation={handleStarConversation}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <ChatInterface
        conversation={currentConversation}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
